'use client';

import { useEffect, useState } from 'react';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { db, User, Internship, InternshipProgram } from '@/lib/mock-db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CreateUserModal from '@/components/admin/create-user-modal';
import CreateProgramModal from '@/components/admin/create-program-modal';
import CreateInternshipModal from '@/components/admin/create-internship-modal';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(db.getAllUsers());
    setPrograms(db.getAllPrograms());
    setInternships(db.getAllInternships());
    setLoading(false);
  }, []);

  if (loading) return <ProtectedLayout><div>Loading...</div></ProtectedLayout>;

  const studentCount = users.filter((u) => u.role === 'student').length;
  const mentorCount = users.filter((u) => u.role === 'mentor').length;
  const facultyCount = users.filter((u) => u.role === 'faculty').length;
  const completedInternships = internships.filter(
    (i) => i.status === 'completed'
  ).length;

  return (
    <ProtectedLayout allowedRoles={['admin']}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, programs, and monitor system-wide statistics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-xs text-muted-foreground">All roles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{studentCount}</p>
              <p className="text-xs text-muted-foreground">Interns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mentorCount}</p>
              <p className="text-xs text-muted-foreground">Industry guides</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{facultyCount}</p>
              <p className="text-xs text-muted-foreground">Supervisors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {completedInternships}
              </p>
              <p className="text-xs text-muted-foreground">Internships</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-end">
              <CreateUserModal
                onUserCreated={() => {
                  setUsers(db.getAllUsers());
                }}
              />
            </div>

            <div className="space-y-3">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {user.organization && (
                      <p className="text-sm text-muted-foreground">
                        {user.organization}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-4">
            <div className="flex justify-end">
              <CreateProgramModal
                onProgramCreated={() => {
                  setPrograms(db.getAllPrograms());
                }}
              />
            </div>

            <div className="space-y-3">
              {programs.map((program) => (
                <Card key={program.id}>
                  <CardHeader className="pb-3">
                    <div className="space-y-2">
                      <CardTitle className="text-base">
                        {program.title}
                      </CardTitle>
                      <CardDescription>
                        {program.organization}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold">{program.duration} weeks</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-semibold">
                        {new Date(program.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Internships Tab */}
          <TabsContent value="internships" className="space-y-4">
            <div className="flex justify-end">
              <CreateInternshipModal
                users={users}
                programs={programs}
                onInternshipCreated={() => {
                  setInternships(db.getAllInternships());
                }}
              />
            </div>

            <div className="space-y-3">
              {internships.map((internship) => {
                const student = db.getUserById(internship.studentId);
                const mentor = db.getUserById(internship.mentorId);
                const faculty = db.getUserById(internship.facultyId);
                const program = db.getProgramById(internship.programId);

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
                            internship.status === 'active'
                              ? 'secondary'
                              : internship.status === 'completed'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {internship.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Student</p>
                          <p className="font-semibold">{student?.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Mentor</p>
                          <p className="font-semibold">{mentor?.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Faculty</p>
                          <p className="font-semibold">{faculty?.name}</p>
                        </div>
                      </div>
                    </CardContent>
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
