'use client';

import { useEffect, useState } from 'react';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { db, Internship, Task, TaskSubmission, WeeklyReport } from '@/lib/mock-db';
import { getCurrentUserId } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import TaskSubmissionModal from '@/components/student/task-submission-modal';
import WeeklyReportModal from '@/components/student/weekly-report-modal';
import CertificateSection from '@/components/student/certificate-section';

export default function StudentDashboard() {
  const [internship, setInternship] = useState<Internship | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getCurrentUserId();

  useEffect(() => {
    if (!userId) return;

    const userInternships = db.getInternshipsByStudent(userId);
    if (userInternships.length > 0) {
      const activeInternship = userInternships[0];
      setInternship(activeInternship);
      setTasks(db.getTasksByInternship(activeInternship.id));
      setSubmissions(db.getSubmissionsByStudent(userId));
      setReports(db.getWeeklyReportsByStudent(userId));
    }

    setLoading(false);
  }, [userId]);

  if (loading) return <ProtectedLayout><div>Loading...</div></ProtectedLayout>;

  if (!internship) {
    return (
      <ProtectedLayout allowedRoles={['student']}>
        <Card>
          <CardHeader>
            <CardTitle>No Active Internship</CardTitle>
            <CardDescription>
              You don't have an active internship assigned yet. Please contact your administrator.
            </CardDescription>
          </CardHeader>
        </Card>
      </ProtectedLayout>
    );
  }

  const mentor = db.getUserById(internship.mentorId);
  const faculty = db.getUserById(internship.facultyId);
  const program = db.getProgramById(internship.programId);

  const completedTasks = tasks.filter((t) => t.status === 'reviewed').length;
  const submittedTasks = tasks.filter((t) => t.status === 'submitted').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const totalTasks = tasks.length || 1;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <ProtectedLayout allowedRoles={['student']}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Your Internship</h1>
          <p className="text-muted-foreground">
            Track your progress, submit tasks, and stay connected with your mentor and faculty guide.
          </p>
        </div>

        {/* Program Overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-2xl font-bold">{program?.title}</p>
              <p className="text-xs text-muted-foreground">{program?.organization}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Mentor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-semibold">{mentor?.name}</p>
              <p className="text-xs text-muted-foreground">{mentor?.organization}</p>
              <p className="text-xs text-muted-foreground">{mentor?.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Faculty Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-semibold">{faculty?.name}</p>
              <p className="text-xs text-muted-foreground">{faculty?.email}</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Progress</CardTitle>
            <CardDescription>
              You have completed {completedTasks} of {totalTasks} tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-semibold">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold text-blue-600">{submittedTasks}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Assigned Tasks</h2>
          </div>
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No tasks assigned yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => {
                const submission = submissions.find((s) => s.taskId === task.id);
                const daysUntilDeadline = Math.ceil(
                  (new Date(task.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const isOverdue = daysUntilDeadline < 0;

                return (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            task.status === 'reviewed'
                              ? 'secondary'
                              : task.status === 'submitted'
                                ? 'outline'
                                : 'destructive'
                          }
                        >
                          {task.status === 'pending' && 'Pending'}
                          {task.status === 'submitted' && 'Submitted'}
                          {task.status === 'reviewed' && 'Reviewed'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Deadline:{' '}
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                        <span
                          className={`font-semibold ${
                            isOverdue ? 'text-destructive' : 'text-muted-foreground'
                          }`}
                        >
                          {isOverdue
                            ? `${Math.abs(daysUntilDeadline)} days overdue`
                            : `${daysUntilDeadline} days left`}
                        </span>
                      </div>

                      {submission && (
                        <div className="bg-muted p-3 rounded-lg space-y-2">
                          <p className="text-sm font-semibold">Your Submission</p>
                          <p className="text-sm text-muted-foreground">
                            {submission.textUpdate}
                          </p>
                          {submission.mentorFeedback && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs font-semibold text-primary">
                                Mentor Feedback:
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {submission.mentorFeedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {task.status === 'pending' || !submission ? (
                        <TaskSubmissionModal
                          taskId={task.id}
                          taskTitle={task.title}
                          onSubmit={() => {
                            const updatedSubmissions =
                              db.getSubmissionsByStudent(userId!);
                            setSubmissions(updatedSubmissions);
                            const updatedTasks = db.getTasksByInternship(
                              internship.id
                            );
                            setTasks(updatedTasks);
                          }}
                        />
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly Reports Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Weekly Reports</h2>
            <WeeklyReportModal
              internshipId={internship.id}
              onSubmit={() => {
                const updatedReports = db.getWeeklyReportsByStudent(userId!);
                setReports(updatedReports);
              }}
            />
          </div>
          {reports.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No weekly reports submitted yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">
                          Week {report.week}
                        </CardTitle>
                        <CardDescription>
                          Submitted on{' '}
                          {new Date(report.submittedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.mentorRating && (
                          <Badge variant="outline">
                            Rating: {report.mentorRating}/5
                          </Badge>
                        )}
                        {report.engagementQuality && (
                          <Badge
                            variant={
                              report.engagementQuality === 'high'
                                ? 'secondary'
                                : report.engagementQuality === 'medium'
                                  ? 'outline'
                                  : 'destructive'
                            }
                          >
                            {report.engagementQuality}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Work Done
                      </p>
                      <p className="text-sm">{report.workDone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Learning Outcomes
                      </p>
                      <p className="text-sm">{report.learningOutcomes}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Issues Faced
                      </p>
                      <p className="text-sm">{report.issuesFaced}</p>
                    </div>
                    {report.mentorFeedback && (
                      <div className="bg-primary/5 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-primary mb-1">
                          Mentor Feedback
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {report.mentorFeedback}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Certificate Section */}
        <CertificateSection internshipId={internship.id} />
      </div>
    </ProtectedLayout>
  );
}
