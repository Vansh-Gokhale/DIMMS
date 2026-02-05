'use client';

import React from "react"

import { useState } from 'react';
import { db } from '@/lib/mock-db';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateProgramModalProps {
  onProgramCreated: () => void;
}

export default function CreateProgramModal({
  onProgramCreated,
}: CreateProgramModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !organization.trim() || !duration) {
      setError('Please fill in all required fields');
      return;
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum < 1) {
      setError('Duration must be a positive number');
      return;
    }

    setLoading(true);

    try {
      db.createProgram({
        title,
        organization,
        duration: durationNum,
      });

      setOpen(false);
      setTitle('');
      setOrganization('');
      setDuration('');
      onProgramCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Program</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Program</DialogTitle>
          <DialogDescription>
            Create a new internship program
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
              Program Title *
            </label>
            <Input
              id="title"
              placeholder="e.g., Software Engineering Internship"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="organization" className="text-sm font-medium">
              Organization *
            </label>
            <Input
              id="organization"
              placeholder="e.g., Tech Corp Inc."
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium">
              Duration (weeks) *
            </label>
            <Input
              id="duration"
              type="number"
              placeholder="12"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
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
              {loading ? 'Creating...' : 'Create Program'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
