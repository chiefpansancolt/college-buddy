export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AssignmentStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  OVERDUE = "overdue",
  SUBMITTED = "submitted",
}

export enum AssignmentType {
  HOMEWORK = "homework",
  QUIZ = "quiz",
  EXAM = "exam",
  PROJECT = "project",
  ESSAY = "essay",
  LAB = "lab",
  PRESENTATION = "presentation",
  DISCUSSION = "discussion",
  OTHER = "other",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum ScheduleType {
  LECTURE = "lecture",
  LAB = "lab",
  DISCUSSION = "discussion",
  SEMINAR = "seminar",
  TUTORIAL = "tutorial",
  WORKSHOP = "workshop",
  EXAM = "exam",
  OTHER = "other",
}

export interface ClassSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location?: string;
  building?: string;
  room?: string;
  type: ScheduleType; // New field to distinguish schedule types
  instructor?: string; // Lab instructors might be different from lecture instructors
  notes?: string; // Additional notes for specific schedule types
}

export interface Assignment extends BaseEntity {
  title: string;
  description?: string;
  type: AssignmentType;
  status: AssignmentStatus;
  priority: Priority;
  dueDate: Date;
  estimatedHours?: number;
  actualHours?: number;
  points?: number;
  earnedPoints?: number;
  classId: string;
  notes?: string;
  attachments?: string[];
  reminderDate?: Date;
}

export enum ClassStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DROPPED = "dropped",
  WITHDRAWN = "withdrawn",
}

export interface ClassSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location?: string;
  building?: string;
  room?: string;
}

export interface Class extends BaseEntity {
  name: string;
  courseCode: string;
  section?: string;
  credits: number;
  instructor: string;
  instructorEmail?: string;
  status: ClassStatus;
  schedule: ClassSchedule[];
  syllabus?: string;
  description?: string;
  officeHours?: string;
  semesterId: string;
  assignments: Assignment[];
  currentGrade?: number;
  targetGrade?: number;
  color?: string;
}

export enum SemesterType {
  FALL = "fall",
  SPRING = "spring",
  SUMMER = "summer",
  WINTER = "winter",
}

export enum SemesterStatus {
  UPCOMING = "upcoming",
  CURRENT = "current",
  COMPLETED = "completed",
}

export interface Semester extends BaseEntity {
  name: string;
  type: SemesterType;
  year: number;
  status: SemesterStatus;
  startDate: Date;
  endDate: Date;
  collegeId: string;
  classes: Class[];
  gpa?: number;
  targetGPA?: number;
  totalCredits: number;
}

export interface College extends BaseEntity {
  name: string;
  abbreviation?: string;
  website?: string;
  location?: string;
  semesters: Semester[];
  overallGPA?: number;
  totalCredits: number;
}

export interface AppData {
  colleges: College[];
  settings: AppSettings;
  lastUpdated: Date;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  defaultView: "calendar" | "list" | "kanban";
  notifications: NotificationSettings;
  academic: AcademicSettings;
}

export interface NotificationSettings {
  assignmentReminders: boolean;
  reminderDaysBefore: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface AcademicSettings {
  gradeScale: GradeScale;
  defaultCredits: number;
  semesterStartMonth: number;
}

export interface GradeScale {
  aPlus: number;
  a: number;
  aMinus: number;
  bPlus: number;
  b: number;
  bMinus: number;
  cPlus: number;
  c: number;
  cMinus: number;
  dPlus: number;
  d: number;
  f: number;
}

export type CreateCollegeData = Omit<
  College,
  "id" | "createdAt" | "updatedAt" | "semesters" | "totalCredits"
>;
export type UpdateCollegeData = Partial<CreateCollegeData>;

export type CreateSemesterData = Omit<
  Semester,
  "id" | "createdAt" | "updatedAt" | "classes" | "totalCredits"
>;
export type UpdateSemesterData = Partial<CreateSemesterData>;

export type CreateClassData = Omit<
  Class,
  "id" | "createdAt" | "updatedAt" | "assignments"
>;
export type UpdateClassData = Partial<CreateClassData>;

export type CreateAssignmentData = Omit<
  Assignment,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateAssignmentData = Partial<CreateAssignmentData>;

export interface DashboardStats {
  totalAssignments: number;
  completedAssignments: number;
  overdueAssignments: number;
  upcomingAssignments: number;
  currentGPA: number;
  totalCredits: number;
  currentSemesterClasses: number;
}

export interface AssignmentFilter {
  status?: AssignmentStatus[];
  type?: AssignmentType[];
  priority?: Priority[];
  classId?: string;
  semesterId?: string;
  dueDateRange?: {
    start: Date;
    end: Date;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "class" | "assignment" | "exam";
  classId?: string;
  assignmentId?: string;
  color?: string;
  location?: string;
}
