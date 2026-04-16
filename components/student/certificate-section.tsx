'use client';

import { useEffect, useState } from 'react';
import { db, InternshipCompletion, Internship } from '@/lib/mock-db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentUserId } from '@/lib/auth';

interface CertificateSectionProps {
  internshipId: string;
}

// Gold ornamental corner SVG as data URI — used in all four corners
const cornerSVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" fill="none">
  <path d="M5 5 C5 5, 70 5, 80 15 C90 25, 90 40, 85 50 C80 60, 65 65, 55 60 C45 55, 45 40, 50 30 C55 20, 70 15, 80 15" stroke="#C5A55A" stroke-width="2" fill="none"/>
  <path d="M5 5 C5 5, 5 70, 15 80 C25 90, 40 90, 50 85 C60 80, 65 65, 60 55 C55 45, 40 45, 30 50 C20 55, 15 70, 15 80" stroke="#C5A55A" stroke-width="2" fill="none"/>
  <path d="M5 5 C15 5, 40 8, 50 12" stroke="#C5A55A" stroke-width="1.5" fill="none"/>
  <path d="M5 5 C5 15, 8 40, 12 50" stroke="#C5A55A" stroke-width="1.5" fill="none"/>
  <circle cx="10" cy="10" r="3" fill="#C5A55A"/>
  <circle cx="25" cy="8" r="1.5" fill="#C5A55A"/>
  <circle cx="8" cy="25" r="1.5" fill="#C5A55A"/>
  <path d="M20 20 C30 15, 40 20, 35 30 C30 40, 20 35, 20 20Z" fill="#C5A55A" opacity="0.3"/>
</svg>`)}`;

// Bottom ornamental scroll SVG
const scrollSVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" fill="none">
  <path d="M30 20 C40 5, 60 5, 70 15 C75 20, 75 25, 70 28 C65 31, 58 28, 60 22 C62 18, 70 18, 75 20 L125 20 C130 18, 138 18, 140 22 C142 28, 135 31, 130 28 C125 25, 125 20, 130 15 C140 5, 160 5, 170 20" stroke="#C5A55A" stroke-width="1.5" fill="none"/>
  <circle cx="100" cy="20" r="3" fill="#C5A55A"/>
  <circle cx="25" cy="20" r="2" fill="#C5A55A"/>
  <circle cx="175" cy="20" r="2" fill="#C5A55A"/>
</svg>`)}`;

export default function CertificateSection({
  internshipId,
}: CertificateSectionProps) {
  const [completion, setCompletion] = useState<InternshipCompletion | null>(null);
  const [internship, setInternship] = useState<Internship | null>(null);
  const userId = getCurrentUserId();

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
    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const mentor = db.getUserById(internship.mentorId);
      const faculty = db.getUserById(internship.facultyId);
      const program = db.getProgramById(internship.programId);
      const user = db.getUserById(userId!);

      // Luxury gold & black certificate — fully self-contained with inline styles
      // Matches the Google Stitch "Luxury Gold Certificate" design
      const certificateHTML = `
        <div style="
          width: 297mm;
          height: 210mm;
          position: relative;
          background-color: #1a1a1a;
          color: #C5A55A;
          font-family: 'Georgia', 'Times New Roman', serif;
          box-sizing: border-box;
          overflow: hidden;
        ">
          <!-- Outer gold border -->
          <div style="
            position: absolute;
            inset: 8mm;
            border: 2px solid #C5A55A;
            pointer-events: none;
          "></div>

          <!-- Inner gold border -->
          <div style="
            position: absolute;
            inset: 12mm;
            border: 1px solid #C5A55A;
            pointer-events: none;
          "></div>

          <!-- Top-left corner ornament -->
          <img src="${cornerSVG}" style="position:absolute;top:6mm;left:6mm;width:40mm;height:40mm;opacity:0.85;" />
          <!-- Top-right corner ornament (flipped) -->
          <img src="${cornerSVG}" style="position:absolute;top:6mm;right:6mm;width:40mm;height:40mm;opacity:0.85;transform:scaleX(-1);" />
          <!-- Bottom-left corner ornament (flipped) -->
          <img src="${cornerSVG}" style="position:absolute;bottom:6mm;left:6mm;width:40mm;height:40mm;opacity:0.85;transform:scaleY(-1);" />
          <!-- Bottom-right corner ornament (flipped both) -->
          <img src="${cornerSVG}" style="position:absolute;bottom:6mm;right:6mm;width:40mm;height:40mm;opacity:0.85;transform:scale(-1,-1);" />

          <!-- Certificate content -->
          <div style="
            position: absolute;
            inset: 20mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 4mm;
          ">
            <!-- Title -->
            <h1 style="
              font-size: 36px;
              font-weight: 400;
              letter-spacing: 10px;
              text-transform: uppercase;
              color: #C5A55A;
              margin: 0 0 2mm 0;
              font-family: 'Georgia', 'Times New Roman', serif;
            ">Certificate of Completion</h1>

            <!-- Gold divider line -->
            <div style="width:80mm;height:1px;background:linear-gradient(90deg,transparent,#C5A55A,transparent);margin:2mm 0;"></div>

            <!-- Subtitle -->
            <p style="
              font-size: 16px;
              font-style: italic;
              color: #B8984F;
              margin: 0 0 4mm 0;
              letter-spacing: 2px;
            ">Digital Internship &amp; Mentorship Management System</p>

            <!-- Certify text -->
            <p style="
              font-size: 16px;
              font-style: italic;
              color: #9A8347;
              margin: 8mm 0 2mm 0;
            ">This is to certify that</p>

            <!-- Student name -->
            <h2 style="
              font-size: 42px;
              font-weight: 400;
              font-style: italic;
              color: #D4AF37;
              margin: 0 0 4mm 0;
              font-family: 'Georgia', 'Times New Roman', serif;
              letter-spacing: 2px;
              text-shadow: 0 0 20px rgba(212,175,55,0.3);
            ">${user?.name || 'Student Name'}</h2>

            <!-- Program info -->
            <p style="
              font-size: 15px;
              font-style: italic;
              color: #9A8347;
              margin: 0 0 1mm 0;
            ">has successfully completed the internship program</p>

            <h3 style="
              font-size: 22px;
              font-weight: 700;
              color: #C5A55A;
              margin: 2mm 0;
              letter-spacing: 1px;
            ">${program?.title || 'Internship Program'}</h3>

            <p style="
              font-size: 15px;
              color: #9A8347;
              margin: 0 0 1mm 0;
            ">at <span style="font-weight:600;color:#B8984F;">${program?.organization || 'Organization'}</span></p>

            <p style="
              font-size: 13px;
              color: #7A6B3D;
              margin: 0;
            ">Duration: ${new Date(internship.startDate).toLocaleDateString()} — ${new Date(internship.endDate).toLocaleDateString()}</p>

            <!-- Bottom scroll ornament -->
            <img src="${scrollSVG}" style="width:60mm;height:12mm;margin:4mm 0;opacity:0.7;" />

            <!-- Signatures -->
            <div style="
              width: 100%;
              display: flex;
              justify-content: space-between;
              padding: 0 15mm;
              margin-top: 6mm;
            ">
              <div style="text-align:center;width:40%;">
                <div style="
                  border-bottom: 1px solid #7A6B3D;
                  padding-bottom: 4px;
                  margin-bottom: 6px;
                  font-size: 18px;
                  font-style: italic;
                  color: #C5A55A;
                ">${mentor?.name || 'Mentor Name'}</div>
                <p style="font-size:12px;font-weight:700;color:#9A8347;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:2px;">Mentor</p>
                <p style="font-size:10px;color:#7A6B3D;margin:0;">${mentor?.organization || ''}</p>
              </div>
              <div style="text-align:center;width:40%;">
                <div style="
                  border-bottom: 1px solid #7A6B3D;
                  padding-bottom: 4px;
                  margin-bottom: 6px;
                  font-size: 18px;
                  font-style: italic;
                  color: #C5A55A;
                ">${faculty?.name || 'Faculty Name'}</div>
                <p style="font-size:12px;font-weight:700;color:#9A8347;margin:0 0 2px 0;text-transform:uppercase;letter-spacing:2px;">Faculty Guide</p>
                <p style="font-size:10px;color:#7A6B3D;margin:0;">${faculty?.email || ''}</p>
              </div>
            </div>

            <!-- Footer -->
            <div style="
              margin-top: auto;
              padding-top: 4mm;
              font-size: 10px;
              color: #5A4F30;
              letter-spacing: 1px;
            ">
              Certificate ID: ${internshipId} &nbsp;•&nbsp; Generated on ${new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      `;

      // Create a temporary container completely outside the page's style scope
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.zIndex = '-9999';
      container.innerHTML = certificateHTML;
      document.body.appendChild(container);

      const targetElement = container.firstElementChild as HTMLElement;

      const opt = {
        margin: 0,
        filename: `DIMMS-Certificate-${user?.name.replace(/\s+/g, '-').toLowerCase() || 'certificate'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#1a1a1a',
          ignoreElements: (element: Element) => {
            return element.tagName === 'STYLE' || element.tagName === 'LINK';
          },
        },
        jsPDF: { unit: 'mm' as const, format: 'a4', orientation: 'landscape' as const },
      };

      await html2pdf().set(opt).from(targetElement).save();

      // Clean up
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  return (
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
            Download Certificate (PDF)
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
  );
}
