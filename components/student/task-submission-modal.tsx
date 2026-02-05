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
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TaskSubmissionModalProps {
  taskId: string;
  taskTitle: string;
  onSubmit: () => void;
}

export default function TaskSubmissionModal({
  taskId,
  taskTitle,
  onSubmit,
}: TaskSubmissionModalProps) {
  const [open, setOpen] = useState(false);
  const [textUpdate, setTextUpdate] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = getCurrentUserId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!textUpdate.trim()) {
      setError('Please provide a text update for this task');
      return;
    }

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      db.submitTask({
        taskId,
        studentId: userId,
        textUpdate,
        fileUrl: fileUrl || undefined,
        submittedAt: new Date(),
        status: 'submitted',
      });

      setOpen(false);
      setTextUpdate('');
      setFileUrl('');
      onSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-transparent">
          Submit Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Task: {taskTitle}</DialogTitle>
          <DialogDescription>
            Provide your task deliverables and any supporting documentation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="text-update" className="text-sm font-medium">
              Task Update (Required)
            </label>
            <Textarea
              id="text-update"
              placeholder="Describe what you accomplished, what was completed, and any key details about the deliverables..."
              value={textUpdate}
              onChange={(e) => setTextUpdate(e.target.value)}
              rows={6}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters required
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="file-url" className="text-sm font-medium">
              File or Link (Optional)
            </label>
            <Input
              id="file-url"
              type="text"
              placeholder="https://example.com/file.pdf or /uploads/my-file.pdf"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              You can provide a URL to a file, PDF link, or GitHub repository
            </p>
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
              {loading ? 'Submitting...' : 'Submit Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
