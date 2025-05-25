import {
  ClassStatus,
  AssignmentType,
  AssignmentStatus,
  Priority,
} from "@/types/app/app";

export const CLASS_STATUS_OPTIONS = [
  { value: ClassStatus.ACTIVE, label: "Active" },
  { value: ClassStatus.COMPLETED, label: "Completed" },
  { value: ClassStatus.DROPPED, label: "Dropped" },
  { value: ClassStatus.WITHDRAWN, label: "Withdrawn" },
] as const;

export const ASSIGNMENT_TYPE_OPTIONS = [
  { value: AssignmentType.HOMEWORK, label: "Homework" },
  { value: AssignmentType.QUIZ, label: "Quiz" },
  { value: AssignmentType.EXAM, label: "Exam" },
  { value: AssignmentType.PROJECT, label: "Project" },
  { value: AssignmentType.ESSAY, label: "Essay" },
  { value: AssignmentType.LAB, label: "Lab" },
  { value: AssignmentType.PRESENTATION, label: "Presentation" },
  { value: AssignmentType.DISCUSSION, label: "Discussion" },
  { value: AssignmentType.OTHER, label: "Other" },
] as const;

export const ASSIGNMENT_STATUS_OPTIONS = [
  { value: AssignmentStatus.NOT_STARTED, label: "Not Started" },
  { value: AssignmentStatus.IN_PROGRESS, label: "In Progress" },
  { value: AssignmentStatus.COMPLETED, label: "Completed" },
  { value: AssignmentStatus.OVERDUE, label: "Overdue" },
  { value: AssignmentStatus.SUBMITTED, label: "Submitted" },
] as const;

export const PRIORITY_OPTIONS = [
  { value: Priority.LOW, label: "Low" },
  { value: Priority.MEDIUM, label: "Medium" },
  { value: Priority.HIGH, label: "High" },
  { value: Priority.URGENT, label: "Urgent" },
] as const;

export const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
] as const;

export const CLASS_COLORS = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#EF4444", label: "Red" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Yellow" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#F97316", label: "Orange" },
  { value: "#06B6D4", label: "Cyan" },
  { value: "#EC4899", label: "Pink" },
] as const;
