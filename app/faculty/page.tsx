'use client';

import { useEffect, useState } from 'react';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { db, Internship, WeeklyReport, InternshipCompletion } from '@/lib/mock-db';
import { getCurrentUserId } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApprovalModal from '@/components/faculty/approval-modal';

export default function FacultyDashboard() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [reportsMap, setReportsMap] = useState<Map<string, WeeklyReport[]>>(new Map());
  const [completionsMap, setCompletionsMap] = useState<
    Map<string, InternshipCompletion>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const userId = getCurrentUserId();

  useEffect(() => {
    if (!userId) return;

    const facultyInternships = db.getInternshipsByFaculty(userId);
    setInternships(facultyInternships);

    const newReportsMap = new Map<string, WeeklyReport[]>();
    const newCompletionsMap = new Map<string, InternshipCompletion>();

    facultyInternships.forEach((internship) => {
      const reports = db.getWeeklyReportsByInternship(internship.id);
      newReportsMap.set(internship.id, reports);

      const completion = db.getCompletionByInternship(internship.id);
      if (completion) {
        newCompletionsMap.set(internship.id, completion);
      }
    });

    setReportsMap(newReportsMap);
    setCompletionsMap(newCompletionsMap);
    setLoading(false);
  }, [userId]);

  if (loading) return <ProtectedLayout><div>Loading...</div></ProtectedLayout>;

  if (internships.length === 0) {
    return (
      <ProtectedLayout allowedRoles={['faculty']}>
        <Card>
          <CardHeader>
            <CardTitle>No Students Assigned</CardTitle>
            <CardDescription>
              You don't have any students assigned to supervise yet.
            </CardDescription>
          </CardHeader>
        </Card>
      </ProtectedLayout>
    );
  }

  const pendingApprovals = internships.filter((i) => {
    const completion = completionsMap.get(i.id);
    return completion?.facultyApproval === 'pending';
  });

  const completedInternships = internships.filter((i) => {
    const completion = completionsMap.get(i.id);
    return completion?.facultyApproval === 'approved';
  });

  const rejectedInternships = internships.filter((i) => {
    const completion = completionsMap.get(i.id);
    return completion?.facultyApproval === 'rejected';
  });

  return (
    <ProtectedLayout allowedRoles={['faculty']}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor student progress, review mentor feedback, and approve internship completions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{internships.length}</p>
              <p className="text-xs text-muted-foreground">Under supervision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {pendingApprovals.length}
              </p>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {completedInternships.length}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">
                {rejectedInternships.length}
              </p>
              <p className="text-xs text-muted-foreground">Not approved</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Approvals
              {pendingApprovals.length > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {pendingApprovals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All Students</TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingApprovals.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No pending approvals
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingApprovals.map((internship) => {
                  const student = db.getUserById(internship.studentId);
                  const mentor = db.getUserById(internship.mentorId);
                  const program = db.getProgramById(internship.programId);
                  const reports = reportsMap.get(internship.id) || [];
                  const completion = completionsMap.get(internship.id);

                  return (
                    <Card key={internship.id} className="border-orange-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">
                              {student?.name}
                            </CardTitle>
                            <CardDescription>
                              {program?.title} at {program?.organization}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">Pending Review</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Student
                            </p>
                            <p className="text-sm font-semibold">
                              {student?.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Mentor
                            </p>
                            <p className="text-sm font-semibold">
                              {mentor?.name}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            Progress Summary
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">
                                Weekly Reports
                              </p>
                              <p className="font-semibold">{reports.length}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Mentor Recommendation
                              </p>
                              <p className="font-semibold">
                                {completion?.mentorRecommendation === 'complete'
                                  ? 'Complete'
                                  : completion?.mentorRecommendation ===
                                      'incomplete'
                                    ? 'Incomplete'
                                    : 'Pending'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {reports.length > 0 && (
                          <div className="pt-2 border-t">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">
                              Recent Reports
                            </p>
                            <div className="space-y-2">
                              {reports.slice(-2).map((report) => (
                                <div
                                  key={report.id}
                                  className="text-xs p-2 bg-muted rounded"
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="font-semibold">
                                      Week {report.week}
                                    </span>
                                    {report.mentorRating && (
                                      <Badge variant="outline" className="text-xs">
                                        {report.mentorRating}/5
                                      </Badge>
                                    )}
                                  </div>
                                  {report.engagementQuality && (
                                    <Badge
                                      variant={
                                        report.engagementQuality === 'high'
                                          ? 'secondary'
                                          : report.engagementQuality === 'medium'
                                            ? 'outline'
                                            : 'destructive'
                                      }
                                      className="text-xs mt-1"
                                    >
                                      {report.engagementQuality} engagement
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <ApprovalModal
                            completionId={completion?.id || ''}
                            studentName={student?.name || ''}
                            onApprovalUpdated={(updatedCompletion) => {
                              setCompletionsMap(
                                new Map(completionsMap).set(
                                  internship.id,
                                  updatedCompletion
                                )
                              );
                              setInternships(internships);
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved" className="space-y-4">
            {completedInternships.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No approved internships yet
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {completedInternships.map((internship) => {
                  const student = db.getUserById(internship.studentId);
                  const program = db.getProgramById(internship.programId);
                  const completion = completionsMap.get(internship.id);

                  return (
                    <Card key={internship.id} className="border-green-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">
                              {student?.name}
                            </CardTitle>
                            <CardDescription>
                              {program?.title}
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Approved
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Grade</p>
                            <p className="font-semibold">
                              {completion?.facultyGrade || 'A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Approved Date
                            </p>
                            <p className="font-semibold">
                              {completion?.completedAt
                                ? new Date(
                                    completion.completedAt
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Rejected Tab */}
          <TabsContent value="rejected" className="space-y-4">
            {rejectedInternships.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No rejected internships
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {rejectedInternships.map((internship) => {
                  const student = db.getUserById(internship.studentId);
                  const program = db.getProgramById(internship.programId);

                  return (
                    <Card key={internship.id} className="border-red-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">
                              {student?.name}
                            </CardTitle>
                            <CardDescription>
                              {program?.title}
                            </CardDescription>
                          </div>
                          <Badge variant="destructive">Rejected</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Contact the student to discuss further actions.
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* All Students Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {internships.map((internship) => {
                const student = db.getUserById(internship.studentId);
                const program = db.getProgramById(internship.programId);
                const completion = completionsMap.get(internship.id);

                return (
                  <Card key={internship.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <CardTitle className="text-base">
                            {student?.name}
                          </CardTitle>
                          <CardDescription>
                            {program?.title}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            completion?.facultyApproval === 'approved'
                              ? 'secondary'
                              : completion?.facultyApproval === 'rejected'
                                ? 'destructive'
                                : 'outline'
                          }
                        >
                          {completion?.facultyApproval === 'approved'
                            ? 'Approved'
                            : completion?.facultyApproval === 'rejected'
                              ? 'Rejected'
                              : 'Pending'}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
}
