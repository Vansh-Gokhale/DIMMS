'use client';

import React from "react"

import { useState } from 'react';
import { db, User, InternshipProgram } from '@/lib/mock-db';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface CreateInternshipModalProps {
  users: User[];
  programs: InternshipProgram[];
  onInternshipCreated: () => void;
}

export default function CreateInternshipModal({
  users,
  programs,
  onInternshipCreated,
}: CreateInternshipModalProps) {
  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [programId, setProgramId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const students = users.filter((u) => u.role === 'student');
  const mentors = users.filter((u) => u.role === 'mentor');
  const faculty = users.filter((u) => u.role === 'faculty');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!studentId || !mentorId || !facultyId || !programId || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      db.createInternship({
        studentId,
        mentorId,
        facultyId,
        programId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'active',
      });

      setOpen(false);
      setStudentId('');
      setMentorId('');
      setFacultyId('');
      setProgramId('');
      setStartDate('');
      setEndDate('');
      onInternshipCreated();
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Internship</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Internship</DialogTitle>
          <DialogDescription>
            Assign a student to an internship program with mentor and faculty
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="student" className="text-sm font-medium">
                Student *
              </label>
              <Select value={studentId} onValueChange={setStudentId} disabled={loading}>
                <SelectTrigger id="student">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="program" className="text-sm font-medium">
                Program *
              </label>
              <Select value={programId} onValueChange={setProgramId} disabled={loading}>
                <SelectTrigger id="program">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="mentor" className="text-sm font-medium">
                Mentor *
              </label>
              <Select value={mentorId} onValueChange={setMentorId} disabled={loading}>
                <SelectTrigger id="mentor">
                  <SelectValue placeholder="Select a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.organization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="faculty" className="text-sm font-medium">
                Faculty Guide *
              </label>
              <Select value={facultyId} onValueChange={setFacultyId} disabled={loading}>
                <SelectTrigger id="faculty">
                  <SelectValue placeholder="Select a faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="start-date" className="text-sm font-medium">
                Start Date *
              </label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={today}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="end-date" className="text-sm font-medium">
                End Date *
              </label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || today}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Internship'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
