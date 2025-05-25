import {
  AssignmentStatus,
  AssignmentType,
  ClassStatus,
  Priority,
  ScheduleType,
  ClassSchedule,
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

export const SCHEDULE_TYPE_OPTIONS = [
  { value: ScheduleType.LECTURE, label: "Lecture", color: "#3B82F6" },
  { value: ScheduleType.LAB, label: "Lab", color: "#10B981" },
  { value: ScheduleType.DISCUSSION, label: "Discussion", color: "#F59E0B" },
  { value: ScheduleType.SEMINAR, label: "Seminar", color: "#8B5CF6" },
  { value: ScheduleType.TUTORIAL, label: "Tutorial", color: "#EF4444" },
  { value: ScheduleType.WORKSHOP, label: "Workshop", color: "#F97316" },
  { value: ScheduleType.EXAM, label: "Exam", color: "#6B7280" },
  { value: ScheduleType.OTHER, label: "Other", color: "#EC4899" },
] as const;

// Helper function to get schedule type color
export const getScheduleTypeColor = (type: ScheduleType): string => {
  const option = SCHEDULE_TYPE_OPTIONS.find((opt) => opt.value === type);
  return option?.color || "#6B7280";
};

// Helper function to format schedule with type distinction
export const formatScheduleWithType = (schedule: ClassSchedule[]): string => {
  if (schedule.length === 0) return "No schedule set";

  // Group by type for better display
  const groupedByType = schedule.reduce(
    (acc, slot) => {
      if (!acc[slot.type]) {
        acc[slot.type] = [];
      }
      acc[slot.type].push(slot);
      return acc;
    },
    {} as Record<ScheduleType, ClassSchedule[]>,
  );

  const formattedGroups = Object.entries(groupedByType).map(([type, slots]) => {
    const typeLabel =
      SCHEDULE_TYPE_OPTIONS.find((opt) => opt.value === type)?.label || type;
    const slotStrings = slots.map((slot) => {
      const day =
        DAYS_OF_WEEK.find((d) => d.value === slot.dayOfWeek)?.label ||
        "Unknown";
      const location =
        slot.location || slot.building || slot.room
          ? ` @ ${[slot.building, slot.room, slot.location].filter(Boolean).join(", ")}`
          : "";
      return `${day} ${slot.startTime}-${slot.endTime}${location}`;
    });
    return `${typeLabel}: ${slotStrings.join(", ")}`;
  });

  return formattedGroups.join("; ");
};
