'use client';

import { useEffect, useState } from 'react';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { db, Internship, Task, TaskSubmission, WeeklyReport } from '@/lib/mock-db';
import { getCurrentUserId } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateTaskModal from '@/components/mentor/create-task-modal';
import FeedbackModal from '@/components/mentor/feedback-modal';

export default function MentorDashboard() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternshipId, setSelectedInternshipId] = useState<string | null>(null);
  const userId = getCurrentUserId();

  useEffect(() => {
    if (!userId) return;

    const mentorInternships = db.getInternshipsByMentor(userId);
    setInternships(mentorInternships);

    if (mentorInternships.length > 0 && !selectedInternshipId) {
      setSelectedInternshipId(mentorInternships[0].id);
    }

    setLoading(false);
  }, [userId, selectedInternshipId]);

  useEffect(() => {
    if (!selectedInternshipId) return;

    const internshipTasks = db.getTasksByInternship(selectedInternshipId);
    setTasks(internshipTasks);

    // Get all submissions for these tasks
    const allSubmissions = internshipTasks.flatMap((task) =>
      db.getSubmissionsByTask(task.id)
    );
    setSubmissions(allSubmissions);

    // Get all reports for this internship
    const internship = db.getInternshipById(selectedInternshipId);
    if (internship) {
      const weeklyReports = db.getWeeklyReportsByInternship(selectedInternshipId);
      setReports(weeklyReports);
    }
  }, [selectedInternshipId]);

  if (loading) return <ProtectedLayout><div>Loading...</div></ProtectedLayout>;

  if (internships.length === 0) {
    return (
      <ProtectedLayout allowedRoles={['mentor']}>
        <Card>
          <CardHeader>
            <CardTitle>No Assigned Interns</CardTitle>
            <CardDescription>
              You don't have any interns assigned to you yet. Please contact the administrator.
            </CardDescription>
          </CardHeader>
        </Card>
      </ProtectedLayout>
    );
  }

  const selectedInternship = internships.find(
    (i) => i.id === selectedInternshipId
  );
  const student = selectedInternship
    ? db.getUserById(selectedInternship.studentId)
    : null;

  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted');
  const pendingReports = reports.filter((r) => !r.mentorRating);

  return (
    <ProtectedLayout allowedRoles={['mentor']}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your interns, review tasks, provide feedback, and track progress
          </p>
        </div>

        {/* Intern Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Intern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {internships.map((internship) => {
                const internStudent = db.getUserById(internship.studentId);
                const isSelected = internship.id === selectedInternshipId;
                return (
                  <Button
                    key={internship.id}
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => setSelectedInternshipId(internship.id)}
                    className="gap-2"
                  >
                    <span>{internStudent?.name}</span>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                    >
                      {isSelected ? 'Selected' : 'View'}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {selectedInternship && student && (
          <>
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Intern</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.email}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">{tasks.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {tasks.filter((t) => t.status === 'reviewed').length} reviewed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Pending Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-orange-600">
                    {pendingSubmissions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Task submissions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Weekly Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">{reports.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {pendingReports.length} pending review
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="tasks" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tasks">Task Management</TabsTrigger>
                <TabsTrigger value="submissions">
                  Submissions
                  {pendingSubmissions.length > 0 && (
                    <Badge className="ml-2" variant="destructive">
                      {pendingSubmissions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="reports">
                  Weekly Reports
                  {pendingReports.length > 0 && (
                    <Badge className="ml-2" variant="destructive">
                      {pendingReports.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-4">
                <div className="flex justify-end">
                  <CreateTaskModal
                    internshipId={selectedInternship.id}
                    onTaskCreated={() => {
                      const updatedTasks = db.getTasksByInternship(
                        selectedInternship.id
                      );
                      setTasks(updatedTasks);
                    }}
                  />
                </div>

                {tasks.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No tasks created yet. Create your first task to get started.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {tasks.map((task) => {
                      const submission = submissions.find(
                        (s) => s.taskId === task.id
                      );
                      return (
                        <Card key={task.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <CardTitle className="text-base">
                                  {task.title}
                                </CardTitle>
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
                                {task.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              Deadline:{' '}
                              {new Date(task.deadline).toLocaleDateString()}
                            </p>

                            {submission ? (
                              <div className="bg-muted p-3 rounded-lg space-y-2">
                                <p className="text-sm font-semibold">
                                  Student Submission
                                </p>
                                <p className="text-sm">
                                  {submission.textUpdate}
                                </p>
                                {submission.fileUrl && (
                                  <a
                                    href={submission.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline"
                                  >
                                    View attached file →
                                  </a>
                                )}

                                {submission.status === 'submitted' && (
                                  <FeedbackModal
                                    submissionId={submission.id}
                                    taskTitle={task.title}
                                    onFeedbackSaved={() => {
                                      const updatedSubmissions =
                                        submissions.map((s) =>
                                          s.id === submission.id
                                            ? {
                                                ...s,
                                                status: 'reviewed' as const,
                                              }
                                            : s
                                        );
                                      setSubmissions(updatedSubmissions);
                                      const updatedTask = db.updateTaskStatus(
                                        task.id,
                                        'reviewed'
                                      );
                                      if (updatedTask) {
                                        setTasks(
                                          tasks.map((t) =>
                                            t.id === task.id
                                              ? updatedTask
                                              : t
                                          )
                                        );
                                      }
                                    }}
                                  />
                                )}

                                {submission.mentorFeedback && (
                                  <div className="border-t pt-2 mt-2">
                                    <p className="text-xs font-semibold text-primary">
                                      Your Feedback:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {submission.mentorFeedback}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                Waiting for student submission...
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Submissions Tab */}
              <TabsContent value="submissions" className="space-y-4">
                {pendingSubmissions.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No pending submissions to review
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {pendingSubmissions.map((submission) => {
                      const task = tasks.find((t) => t.id === submission.taskId);
                      return (
                        <Card key={submission.id} className="border-orange-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <CardTitle className="text-base">
                                  {task?.title}
                                </CardTitle>
                                <CardDescription>
                                  Submitted on{' '}
                                  {new Date(
                                    submission.submittedAt
                                  ).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              <Badge>Pending Review</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <p className="text-sm font-semibold text-muted-foreground mb-1">
                                Student's Work
                              </p>
                              <p className="text-sm">{submission.textUpdate}</p>
                            </div>
                            {submission.fileUrl && (
                              <a
                                href={submission.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline block"
                              >
                                View attached file →
                              </a>
                            )}
                            <FeedbackModal
                              submissionId={submission.id}
                              taskTitle={task?.title || 'Task'}
                              onFeedbackSaved={() => {
                                const updatedSubmissions =
                                  submissions.filter((s) =>
                                    s.id !== submission.id
                                  );
                                setSubmissions(updatedSubmissions);
                              }}
                            />
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-4">
                {reports.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No weekly reports submitted yet
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {reports.map((report) => (
                      <Card
                        key={report.id}
                        className={
                          !report.mentorRating ? 'border-orange-200' : ''
                        }
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-base">
                                Week {report.week}
                              </CardTitle>
                              <CardDescription>
                                Submitted on{' '}
                                {new Date(
                                  report.submittedAt
                                ).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            {report.mentorRating ? (
                              <Badge variant="secondary">
                                Rating: {report.mentorRating}/5
                              </Badge>
                            ) : (
                              <Badge variant="outline">Pending Review</Badge>
                            )}
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

                          {!report.mentorRating && (
                            <div className="mt-4 pt-4 border-t">
                              <Button
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={() => {
                                  // Open feedback modal for weekly report
                                  const updatedReport =
                                    db.updateWeeklyReportFeedback(
                                      report.id,
                                      'Great progress this week! Keep up the excellent work.',
                                      4
                                    );
                                  if (updatedReport) {
                                    setReports(
                                      reports.map((r) =>
                                        r.id === report.id
                                          ? updatedReport
                                          : r
                                      )
                                    );
                                  }
                                }}
                              >
                                Provide Feedback & Rating
                              </Button>
                            </div>
                          )}

                          {report.mentorFeedback && (
                            <div className="bg-primary/5 p-3 rounded-lg">
                              <p className="text-xs font-semibold text-primary mb-1">
                                Your Feedback
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
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </ProtectedLayout>
  );
}
