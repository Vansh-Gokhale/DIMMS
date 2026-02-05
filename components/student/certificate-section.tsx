'use client';

import { useEffect, useState, useRef } from 'react';
import { db, InternshipCompletion, Internship } from '@/lib/mock-db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentUserId } from '@/lib/auth';

interface CertificateSectionProps {
  internshipId: string;
}

export default function CertificateSection({
  internshipId,
}: CertificateSectionProps) {
  const [completion, setCompletion] = useState<InternshipCompletion | null>(null);
  const [internship, setInternship] = useState<Internship | null>(null);
  const userId = getCurrentUserId();
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const comp = db.getCompletionByInternship(internshipId);
    const intern = db.getInternshipById(internshipId);
    setCompletion(comp);
    setInternship(intern);
  }, [internshipId]);

  if (!completion || !internship) return null;

  const isApproved = completion.facultyApproval === 'approved';
  const isPending =
    completion.mentorRecommendation === 'pending' ||
    completion.facultyApproval === 'pending';

  const generateCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const mentor = db.getUserById(internship.mentorId);
      const faculty = db.getUserById(internship.facultyId);
      const program = db.getProgramById(internship.programId);
      const user = db.getUserById(userId!);

      const opt = {
        margin: 10,
        filename: `internship-certificate-${user?.name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const }
      };

      html2pdf().set(opt).from(certificateRef.current).save();
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  return (
    <>
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={certificateRef}
          className="w-[297mm] h-[210mm] p-[20mm] relative border-[10px] border-double flex flex-col items-center justify-between text-center"
          style={{
            fontFamily: 'serif',
            backgroundColor: '#ffffff',
            borderColor: '#1e293b',
            color: '#0f172a'
          }}
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4" style={{ borderColor: '#1e293b' }} />
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4" style={{ borderColor: '#1e293b' }} />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4" style={{ borderColor: '#1e293b' }} />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4" style={{ borderColor: '#1e293b' }} />

          {/* Header */}
          <div className="space-y-4 mt-8">
            <h1 className="text-4xl font-bold tracking-widest uppercase" style={{ color: '#0f172a' }}>Certificate of Completion</h1>
            <div className="w-32 h-1 mx-auto" style={{ backgroundColor: '#1e293b' }} />
            <p className="text-xl" style={{ color: '#475569' }}>Digital Internship & Mentorship Management System</p>
          </div>

          {/* Content */}
          <div className="space-y-6 my-8">
            <p className="text-xl italic" style={{ color: '#475569' }}>This is to certify that</p>
            <h2 className="text-5xl font-bold font-serif italic" style={{ color: '#0f172a' }}>{db.getUserById(userId!)?.name}</h2>
            <p className="text-xl italic" style={{ color: '#475569' }}>has successfully completed the internship program</p>
            <h3 className="text-3xl font-bold" style={{ color: '#1e293b' }}>{db.getProgramById(internship.programId)?.title}</h3>
            <p className="text-xl" style={{ color: '#475569' }}>at <span className="font-semibold">{db.getProgramById(internship.programId)?.organization}</span></p>
            <p className="text-lg" style={{ color: '#475569' }}>
              Duration: {new Date(internship.startDate).toLocaleDateString()} to {new Date(internship.endDate).toLocaleDateString()}
            </p>
          </div>

          {/* Signatures */}
          <div className="w-full grid grid-cols-2 gap-32 px-12 mt-auto mb-8">
            <div className="text-center space-y-2">
              <div className="border-b-2 pb-2 mb-2 font-dancing text-xl" style={{ borderColor: '#94a3b8', color: '#0f172a' }}>
                {/* Mock Signature could go here */}
                {db.getUserById(internship.mentorId)?.name}
              </div>
              <p className="font-bold" style={{ color: '#1e293b' }}>Mentor</p>
              <p className="text-sm" style={{ color: '#475569' }}>{db.getUserById(internship.mentorId)?.email}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="border-b-2 pb-2 mb-2 font-dancing text-xl" style={{ borderColor: '#94a3b8', color: '#0f172a' }}>
                {/* Mock Signature could go here */}
                {db.getUserById(internship.facultyId)?.name}
              </div>
              <p className="font-bold" style={{ color: '#1e293b' }}>Faculty Guide</p>
              <p className="text-sm" style={{ color: '#475569' }}>{db.getUserById(internship.facultyId)?.email}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full text-center border-t pt-4 text-sm" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>
            <p>Certificate ID: {internshipId} • Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <Card className={isApproved ? 'border-green-200 bg-green-50/50' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Internship Certificate</CardTitle>
              <CardDescription>
                Download your official internship completion certificate
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={isApproved ? 'secondary' : 'outline'}>
                {completion.mentorRecommendation === 'pending'
                  ? 'Awaiting Mentor'
                  : completion.mentorRecommendation === 'incomplete'
                    ? 'Not Recommended'
                    : 'Mentor Recommended'}
              </Badge>
              <Badge
                variant={
                  completion.facultyApproval === 'approved'
                    ? 'secondary'
                    : completion.facultyApproval === 'rejected'
                      ? 'destructive'
                      : 'outline'
                }
              >
                {completion.facultyApproval === 'pending'
                  ? 'Awaiting Faculty'
                  : completion.facultyApproval === 'approved'
                    ? 'Approved'
                    : 'Rejected'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Mentor Recommendation</p>
              <p className="text-sm font-semibold">
                {completion.mentorRecommendation === 'pending'
                  ? 'Pending'
                  : completion.mentorRecommendation === 'complete'
                    ? 'Complete'
                    : 'Incomplete'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Faculty Approval</p>
              <p className="text-sm font-semibold">
                {completion.facultyApproval === 'pending'
                  ? 'Pending'
                  : completion.facultyApproval === 'approved'
                    ? 'Approved'
                    : 'Rejected'}
              </p>
            </div>
            {completion.facultyGrade && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Grade</p>
                <p className="text-sm font-semibold">{completion.facultyGrade}</p>
              </div>
            )}
          </div>

          {isApproved ? (
            <Button onClick={generateCertificate} className="w-full">
              Download Certificate
            </Button>
          ) : isPending ? (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Your certificate will be available once both your mentor and faculty
                guide have approved your internship completion.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Your internship completion has not been approved. Please contact your
                mentor or faculty guide for more information.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
