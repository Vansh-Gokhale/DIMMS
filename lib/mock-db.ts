// Mock database for DIMMS
// In production, this would be replaced with real database calls

export type UserRole = 'student' | 'mentor' | 'faculty' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  organization?: string;
}

export interface InternshipProgram {
  id: string;
  title: string;
  organization: string;
  duration: number; // weeks
  createdAt: Date;
}

export interface Internship {
  id: string;
  studentId: string;
  mentorId: string;
  facultyId: string;
  programId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'rejected';
}

export interface Task {
  id: string;
  internshipId: string;
  mentorId: string;
  title: string;
  description: string;
  deadline: Date;
  createdAt: Date;
  status: 'pending' | 'submitted' | 'reviewed';
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  studentId: string;
  textUpdate: string;
  fileUrl?: string;
  submittedAt: Date;
  mentorFeedback?: string;
  status: 'submitted' | 'reviewed';
}

export interface WeeklyReport {
  id: string;
  internshipId: string;
  studentId: string;
  week: number;
  workDone: string;
  learningOutcomes: string;
  issuesFaced: string;
  submittedAt: Date;
  mentorFeedback?: string;
  mentorRating?: number; // 1-5
  engagementQuality?: 'high' | 'medium' | 'low';
  aiAnalysis?: string;
}

export interface InternshipCompletion {
  id: string;
  internshipId: string;
  mentorRecommendation: 'complete' | 'incomplete' | 'pending';
  facultyApproval: 'approved' | 'rejected' | 'pending';
  facultyGrade?: string;
  certificateUrl?: string;
  completedAt?: Date;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@dimms.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 'student-1',
    email: 'student@example.com',
    password: 'student123',
    name: 'Yash Chaudhary',
    role: 'student',
  },
  {
    id: 'student-2',
    email: 'jane@example.com',
    password: 'student123',
    name: 'Jane Smith',
    role: 'student',
  },
  {
    id: 'mentor-1',
    email: 'mentor@example.com',
    password: 'mentor123',
    name: 'Vansh',
    role: 'mentor',
    organization: 'Tech Corp',
  },
  {
    id: 'mentor-2',
    email: 'mentor2@example.com',
    password: 'mentor123',
    name: 'Sarah Williams',
    role: 'mentor',
    organization: 'InnovateLabs',
  },
  {
    id: 'faculty-1',
    email: 'faculty@university.edu',
    password: 'faculty123',
    name: 'Dr. Robert Chen',
    role: 'faculty',
  },
  {
    id: 'faculty-2',
    email: 'faculty2@university.edu',
    password: 'faculty123',
    name: 'Dr. Maria Garcia',
    role: 'faculty',
  },
];

const mockPrograms: InternshipProgram[] = [
  {
    id: 'prog-1',
    title: 'Software Engineering Internship',
    organization: 'Tech Corp',
    duration: 12,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'prog-2',
    title: 'Product Management Internship',
    organization: 'InnovateLabs',
    duration: 10,
    createdAt: new Date('2024-01-15'),
  },
];

const mockInternships: Internship[] = [
  {
    id: 'intern-1',
    studentId: 'student-1',
    mentorId: 'mentor-1',
    facultyId: 'faculty-1',
    programId: 'prog-1',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-04-15'),
    status: 'active',
  },
  {
    id: 'intern-2',
    studentId: 'student-2',
    mentorId: 'mentor-2',
    facultyId: 'faculty-2',
    programId: 'prog-2',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-01'),
    status: 'active',
  },
];

const mockTasks: Task[] = [
  {
    id: 'task-1',
    internshipId: 'intern-1',
    mentorId: 'mentor-1',
    title: 'Setup Development Environment',
    description: 'Install Node.js, npm, and required development tools',
    deadline: new Date('2024-01-25'),
    createdAt: new Date('2024-01-15'),
    status: 'reviewed',
  },
  {
    id: 'task-2',
    internshipId: 'intern-1',
    mentorId: 'mentor-1',
    title: 'Build User Authentication Module',
    description: 'Implement login and signup functionality',
    deadline: new Date('2024-02-08'),
    createdAt: new Date('2024-01-25'),
    status: 'submitted',
  },
  {
    id: 'task-3',
    internshipId: 'intern-1',
    mentorId: 'mentor-1',
    title: 'Database Schema Design',
    description: 'Design and implement database models for the application',
    deadline: new Date('2024-02-22'),
    createdAt: new Date('2024-02-08'),
    status: 'pending',
  },
];

const mockTaskSubmissions: TaskSubmission[] = [
  {
    id: 'submission-1',
    taskId: 'task-1',
    studentId: 'student-1',
    textUpdate: 'All development tools successfully installed and configured.',
    submittedAt: new Date('2024-01-24'),
    mentorFeedback: 'Great work! All setup completed successfully.',
    status: 'reviewed',
  },
  {
    id: 'submission-2',
    taskId: 'task-2',
    studentId: 'student-1',
    textUpdate: 'Implemented JWT-based authentication with email verification.',
    fileUrl: '/uploads/auth-module.pdf',
    submittedAt: new Date('2024-02-07'),
    status: 'submitted',
  },
];

const mockWeeklyReports: WeeklyReport[] = [
  {
    id: 'report-1',
    internshipId: 'intern-1',
    studentId: 'student-1',
    week: 1,
    workDone: 'Set up development environment, initialized project repository, attended onboarding session.',
    learningOutcomes: 'Learned about company tech stack and code standards.',
    issuesFaced: 'Some initial setup issues with Node version compatibility.',
    submittedAt: new Date('2024-01-22'),
    mentorFeedback: 'Good start! Make sure to follow the coding standards document.',
    mentorRating: 4,
    engagementQuality: 'high',
  },
  {
    id: 'report-2',
    internshipId: 'intern-1',
    studentId: 'student-1',
    week: 2,
    workDone: 'Implemented authentication module, created API endpoints for login/signup.',
    learningOutcomes: 'Deepened understanding of JWT tokens and secure authentication practices.',
    issuesFaced: 'None significant.',
    submittedAt: new Date('2024-01-29'),
    mentorFeedback: 'Excellent work on the auth implementation. Code quality is very good.',
    mentorRating: 5,
    engagementQuality: 'high',
  },
];

const mockCompletions: InternshipCompletion[] = [
  {
    id: 'completion-1',
    internshipId: 'intern-1',
    mentorRecommendation: 'complete',
    facultyApproval: 'pending',
  },
];

// Database simulation with in-memory storage
class MockDatabase {
  private users: User[] = mockUsers;
  private programs: InternshipProgram[] = mockPrograms;
  private internships: Internship[] = mockInternships;
  private tasks: Task[] = mockTasks;
  private taskSubmissions: TaskSubmission[] = mockTaskSubmissions;
  private weeklyReports: WeeklyReport[] = mockWeeklyReports;
  private completions: InternshipCompletion[] = mockCompletions;

  // User operations
  authenticateUser(email: string, password: string): User | null {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );
    return user || null;
  }

  getUserById(id: string): User | null {
    return this.users.find((u) => u.id === id) || null;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  createUser(user: Omit<User, 'id'>): User {
    const newUser: User = { ...user, id: `user-${Date.now()}` };
    this.users.push(newUser);
    return newUser;
  }

  // Internship operations
  getInternshipsByStudent(studentId: string): Internship[] {
    return this.internships.filter((i) => i.studentId === studentId);
  }

  getInternshipsByMentor(mentorId: string): Internship[] {
    return this.internships.filter((i) => i.mentorId === mentorId);
  }

  getInternshipsByFaculty(facultyId: string): Internship[] {
    return this.internships.filter((i) => i.facultyId === facultyId);
  }

  getInternshipById(id: string): Internship | null {
    return this.internships.find((i) => i.id === id) || null;
  }

  getAllInternships(): Internship[] {
    return this.internships;
  }

  // Task operations
  getTasksByInternship(internshipId: string): Task[] {
    return this.tasks.filter((t) => t.internshipId === internshipId);
  }

  getTaskById(id: string): Task | null {
    return this.tasks.find((t) => t.id === id) || null;
  }

  createTask(task: Omit<Task, 'id'>): Task {
    const newTask: Task = { ...task, id: `task-${Date.now()}` };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTaskStatus(taskId: string, status: Task['status']): Task | null {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
    }
    return task || null;
  }

  // Task Submission operations
  getSubmissionsByTask(taskId: string): TaskSubmission[] {
    return this.taskSubmissions.filter((s) => s.taskId === taskId);
  }

  getSubmissionsByStudent(studentId: string): TaskSubmission[] {
    return this.taskSubmissions.filter((s) => s.studentId === studentId);
  }

  submitTask(submission: Omit<TaskSubmission, 'id'>): TaskSubmission {
    const newSubmission: TaskSubmission = {
      ...submission,
      id: `submission-${Date.now()}`,
    };
    this.taskSubmissions.push(newSubmission);
    const task = this.tasks.find((t) => t.id === submission.taskId);
    if (task) {
      task.status = 'submitted';
    }
    return newSubmission;
  }

  updateSubmissionFeedback(
    submissionId: string,
    feedback: string
  ): TaskSubmission | null {
    const submission = this.taskSubmissions.find((s) => s.id === submissionId);
    if (submission) {
      submission.mentorFeedback = feedback;
      submission.status = 'reviewed';
      const task = this.tasks.find((t) => t.id === submission.taskId);
      if (task) {
        task.status = 'reviewed';
      }
    }
    return submission || null;
  }

  // Weekly Report operations
  getWeeklyReportsByStudent(studentId: string): WeeklyReport[] {
    return this.weeklyReports.filter((r) => r.studentId === studentId);
  }

  getWeeklyReportsByInternship(internshipId: string): WeeklyReport[] {
    return this.weeklyReports.filter((r) => r.internshipId === internshipId);
  }

  submitWeeklyReport(report: Omit<WeeklyReport, 'id'>): WeeklyReport {
    const newReport: WeeklyReport = {
      ...report,
      id: `report-${Date.now()}`,
    };
    this.weeklyReports.push(newReport);
    return newReport;
  }

  updateWeeklyReportFeedback(
    reportId: string,
    feedback: string,
    rating: number
  ): WeeklyReport | null {
    const report = this.weeklyReports.find((r) => r.id === reportId);
    if (report) {
      report.mentorFeedback = feedback;
      report.mentorRating = rating;
    }
    return report || null;
  }

  // Completion operations
  getCompletionByInternship(internshipId: string): InternshipCompletion | null {
    return (
      this.completions.find((c) => c.internshipId === internshipId) || null
    );
  }

  updateMentorRecommendation(
    completionId: string,
    recommendation: InternshipCompletion['mentorRecommendation']
  ): InternshipCompletion | null {
    const completion = this.completions.find((c) => c.id === completionId);
    if (completion) {
      completion.mentorRecommendation = recommendation;
    }
    return completion || null;
  }

  updateFacultyApproval(
    completionId: string,
    approval: InternshipCompletion['facultyApproval'],
    grade?: string
  ): InternshipCompletion | null {
    const completion = this.completions.find((c) => c.id === completionId);
    if (completion) {
      completion.facultyApproval = approval;
      if (grade) completion.facultyGrade = grade;
      if (approval === 'approved') {
        completion.completedAt = new Date();
      }
    }
    return completion || null;
  }

  // Program operations
  getAllPrograms(): InternshipProgram[] {
    return this.programs;
  }

  getProgramById(id: string): InternshipProgram | null {
    return this.programs.find((p) => p.id === id) || null;
  }

  createProgram(program: Omit<InternshipProgram, 'id' | 'createdAt'>): InternshipProgram {
    const newProgram: InternshipProgram = {
      ...program,
      id: `prog-${Date.now()}`,
      createdAt: new Date(),
    };
    this.programs.push(newProgram);
    return newProgram;
  }

  createInternship(internship: Omit<Internship, 'id'>): Internship {
    const newInternship: Internship = {
      ...internship,
      id: `intern-${Date.now()}`,
    };
    this.internships.push(newInternship);
    // Create associated completion record
    this.completions.push({
      id: `completion-${Date.now()}`,
      internshipId: newInternship.id,
      mentorRecommendation: 'pending',
      facultyApproval: 'pending',
    });
    return newInternship;
  }
}

// Singleton instance
export const db = new MockDatabase();
