'use client';

import React from "react"

import { useState } from 'react';
import { db } from '@/lib/mock-db';
import { getCurrentUserId } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WeeklyReportModalProps {
  internshipId: string;
  onSubmit: () => void;
}

export default function WeeklyReportModal({
  internshipId,
  onSubmit,
}: WeeklyReportModalProps) {
  const [open, setOpen] = useState(false);
  const [workDone, setWorkDone] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState('');
  const [issuesFaced, setIssuesFaced] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = getCurrentUserId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!workDone.trim() || !learningOutcomes.trim() || !issuesFaced.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      const existingReports = db.getWeeklyReportsByStudent(userId);
      const nextWeekNumber = existingReports.length + 1;

      db.submitWeeklyReport({
        internshipId,
        studentId: userId,
        week: nextWeekNumber,
        workDone,
        learningOutcomes,
        issuesFaced,
        submittedAt: new Date(),
      });

      setOpen(false);
      setWorkDone('');
      setLearningOutcomes('');
      setIssuesFaced('');
      onSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Submit Weekly Report</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Weekly Report</DialogTitle>
          <DialogDescription>
            Share your progress, learnings, and any challenges you faced this week
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="work-done" className="text-sm font-medium">
              What work did you complete this week? *
            </label>
            <Textarea
              id="work-done"
              placeholder="Describe the tasks you completed, projects worked on, features implemented, etc."
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="learning" className="text-sm font-medium">
              What did you learn this week? *
            </label>
            <Textarea
              id="learning"
              placeholder="Describe new skills acquired, technologies learned, best practices discovered, etc."
              value={learningOutcomes}
              onChange={(e) => setLearningOutcomes(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="issues" className="text-sm font-medium">
              What challenges or issues did you face? *
            </label>
            <Textarea
              id="issues"
              placeholder="Describe any obstacles, blockers, or areas where you need support. If no issues, you can write 'None' or describe minor challenges."
              value={issuesFaced}
              onChange={(e) => setIssuesFaced(e.target.value)}
              rows={4}
              disabled={loading}
            />
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
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
