'use client';

import React from "react"

import { useState } from 'react';
import { db } from '@/lib/mock-db';
import { enhanceFeedback } from '@/lib/ai-analysis';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FeedbackModalProps {
  submissionId: string;
  taskTitle: string;
  onFeedbackSaved: () => void;
}

export default function FeedbackModal({
  submissionId,
  taskTitle,
  onFeedbackSaved,
}: FeedbackModalProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bulletPoints, setBulletPoints] = useState('');
  const [enhancedFeedback, setEnhancedFeedback] = useState<string>('');
  const [useEnhanced, setUseEnhanced] = useState(false);

  const handleEnhance = () => {
    if (!bulletPoints.trim()) {
      setError('Please enter bullet points to enhance');
      return;
    }

    const result = enhanceFeedback(bulletPoints, 'constructive');
    setEnhancedFeedback(result.enhanced);
    setFeedback(result.enhanced);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const finalFeedback = useEnhanced ? enhancedFeedback : feedback;

    if (!finalFeedback.trim()) {
      setError('Please provide feedback for the student');
      return;
    }

    setLoading(true);

    try {
      db.updateSubmissionFeedback(submissionId, finalFeedback);
      setOpen(false);
      setFeedback('');
      setRating('');
      setBulletPoints('');
      setEnhancedFeedback('');
      setUseEnhanced(false);
      onFeedbackSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-transparent">
          Provide Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>
            Review the submission for "{taskTitle}" and provide constructive feedback
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="direct" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="direct">Direct Feedback</TabsTrigger>
              <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="direct" className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                Feedback *
              </label>
              <Textarea
                id="feedback"
                placeholder="Provide constructive feedback on the student's submission. Include strengths, areas for improvement, and suggestions."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
                disabled={loading}
              />
            </TabsContent>

            <TabsContent value="assistant" className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
                <p className="text-xs font-semibold text-blue-900 mb-1">
                  AI Feedback Enhancement
                </p>
                <p className="text-xs text-blue-800">
                  Enter bullet points and our AI will transform them into professional, academically-structured feedback.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="bullet-points" className="text-sm font-medium">
                  Bullet Points
                </label>
                <Textarea
                  id="bullet-points"
                  placeholder="- First point
- Second point
- Third point"
                  value={bulletPoints}
                  onChange={(e) => setBulletPoints(e.target.value)}
                  rows={5}
                  disabled={loading}
                />
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={handleEnhance}
                disabled={loading || !bulletPoints.trim()}
                className="w-full"
              >
                Enhance with AI
              </Button>

              {enhancedFeedback && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enhanced Feedback</label>
                  <div className="bg-muted p-3 rounded-lg text-sm whitespace-pre-wrap border">
                    {enhancedFeedback}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFeedback(enhancedFeedback);
                      setUseEnhanced(true);
                    }}
                    disabled={loading}
                    className="w-full"
                  >
                    Use This Feedback
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <label htmlFor="rating" className="text-sm font-medium">
              Quality Rating (Optional)
            </label>
            <Select value={rating} onValueChange={setRating} disabled={loading}>
              <SelectTrigger id="rating">
                <SelectValue placeholder="Select a rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Excellent</SelectItem>
                <SelectItem value="4">Good</SelectItem>
                <SelectItem value="3">Satisfactory</SelectItem>
                <SelectItem value="2">Needs Improvement</SelectItem>
                <SelectItem value="1">Poor</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? 'Saving...' : 'Save Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
