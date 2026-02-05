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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateTaskModalProps {
  internshipId: string;
  onTaskCreated: () => void;
}

export default function CreateTaskModal({
  internshipId,
  onTaskCreated,
}: CreateTaskModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = getCurrentUserId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !deadline) {
      setError('Please fill in all required fields');
      return;
    }

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      db.createTask({
        internshipId,
        mentorId: userId,
        title,
        description,
        deadline: new Date(deadline),
        createdAt: new Date(),
        status: 'pending',
      });

      setOpen(false);
      setTitle('');
      setDescription('');
      setDeadline('');
      onTaskCreated();
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Task</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Assign a new task to your intern with a clear deadline
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Task Title *
            </label>
            <Input
              id="title"
              placeholder="e.g., Build User Authentication Module"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description *
            </label>
            <Textarea
              id="description"
              placeholder="Provide detailed instructions for the task, including requirements, acceptance criteria, and any resources needed."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="deadline" className="text-sm font-medium">
              Deadline *
            </label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={minDate}
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
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
