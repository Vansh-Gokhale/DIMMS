'use client';

import React from "react"

import { useState } from 'react';
import { db, InternshipCompletion } from '@/lib/mock-db';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApprovalModalProps {
  completionId: string;
  studentName: string;
  onApprovalUpdated: (completion: InternshipCompletion) => void;
}

export default function ApprovalModal({
  completionId,
  studentName,
  onApprovalUpdated,
}: ApprovalModalProps) {
  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState<'approved' | 'rejected' | ''>('');
  const [grade, setGrade] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!decision) {
      setError('Please select an approval decision');
      return;
    }

    setLoading(true);

    try {
      const updatedCompletion = db.updateFacultyApproval(
        completionId,
        decision as 'approved' | 'rejected',
        decision === 'approved' ? grade || 'A' : undefined
      );

      if (updatedCompletion) {
        setOpen(false);
        setDecision('');
        setGrade('');
        setNotes('');
        onApprovalUpdated(updatedCompletion);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Review & Decide</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Internship Approval Decision</DialogTitle>
          <DialogDescription>
            Make a final decision on {studentName}'s internship completion
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="decision" className="text-sm font-medium">
              Final Decision *
            </label>
            <Select value={decision} onValueChange={(v) => setDecision(v as 'approved' | 'rejected')} disabled={loading}>
              <SelectTrigger id="decision">
                <SelectValue placeholder="Select a decision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approve Completion</SelectItem>
                <SelectItem value="rejected">Reject Completion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {decision === 'approved' && (
            <div className="space-y-2">
              <label htmlFor="grade" className="text-sm font-medium">
                Academic Grade
              </label>
              <Select value={grade} onValueChange={setGrade} disabled={loading}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A (Excellent)</SelectItem>
                  <SelectItem value="A-">A- (Excellent)</SelectItem>
                  <SelectItem value="B+">B+ (Good)</SelectItem>
                  <SelectItem value="B">B (Good)</SelectItem>
                  <SelectItem value="B-">B- (Satisfactory)</SelectItem>
                  <SelectItem value="C">C (Acceptable)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Additional Notes (Optional)
            </label>
            <Textarea
              id="notes"
              placeholder="Add any comments, recommendations, or feedback for the student."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-900">
              Approval Checklist
            </p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ Mentor has recommended completion</li>
              <li>✓ Student submitted weekly reports</li>
              <li>✓ Task submissions reviewed and approved</li>
              <li>✓ Overall performance meets requirements</li>
            </ul>
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
            <Button type="submit" disabled={loading} variant={decision === 'approved' ? 'default' : decision === 'rejected' ? 'destructive' : 'secondary'}>
              {loading ? 'Processing...' : 'Submit Decision'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
