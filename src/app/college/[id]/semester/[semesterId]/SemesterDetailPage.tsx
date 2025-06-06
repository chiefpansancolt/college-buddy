"use client";

import { AssignmentFormModal, ClassFormModal } from "@/components/modals";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Spinner,
  TabItem,
  Tabs,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HiAcademicCap,
  HiArrowLeft,
  HiBookOpen,
  HiCalendar,
  HiCheckCircle,
  HiClipboardList,
  HiClock,
  HiExclamationCircle,
  HiMail,
  HiPencil,
  HiPlus,
  HiTrash,
  HiUser,
  HiX,
} from "react-icons/hi";
import {
  Assignment,
  AssignmentStatus,
  Class,
  ClassSchedule,
  ClassStatus,
  College,
  CreateAssignmentData,
  CreateClassData,
  Priority,
  Semester,
} from "@/types/app/app";
import { errorToast, successToast } from "@/lib/notifications";
import {
  createAssignment,
  createClass,
  deleteAssignment,
  deleteClass,
  getCollegeById,
  getSemesterById,
  updateAssignment,
  updateClass,
} from "@/lib/storage";
import {
  DAYS_OF_WEEK,
  SCHEDULE_TYPE_OPTIONS,
  getScheduleTypeColor,
} from "@/data/constants/class";

interface SemesterDetailPageProps {
  collegeId: string;
  semesterId: string;
}

interface ScheduleSlot extends ClassSchedule {
  classId: string;
  className: string;
  courseCode: string;
  classColor?: string;
  instructor?: string;
}

export default function SemesterDetailPage({
  collegeId,
  semesterId,
}: SemesterDetailPageProps) {
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [semester, setSemester] = useState<Semester | null>(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null,
  );
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [collegeId, semesterId]);

  const loadData = async () => {
    try {
      setPageLoading(true);
      const [collegeData, semesterData] = await Promise.all([
        getCollegeById(collegeId),
        getSemesterById(collegeId, semesterId),
      ]);

      if (!collegeData) {
        errorToast({ message: "College not found" });
        router.push("/");
        return;
      }

      if (!semesterData) {
        errorToast({ message: "Semester not found" });
        router.push(`/college/${collegeId}`);
        return;
      }

      setCollege(collegeData);
      setSemester(semesterData);
    } catch (error) {
      console.error("Error loading data:", error);
      errorToast({ message: "Failed to load data" });
    } finally {
      setPageLoading(false);
    }
  };

  const handleCreateClass = async (
    classData: CreateClassData,
    assignments: CreateAssignmentData[],
  ) => {
    setIsLoading(true);
    try {
      const newClass = await createClass(collegeId, semesterId, classData);

      // Create assignments if any were added
      for (const assignmentData of assignments) {
        await createAssignment(collegeId, semesterId, newClass.id, {
          ...assignmentData,
          classId: newClass.id,
        });
      }

      await loadData();
      setShowClassModal(false);
      successToast({
        message: `${newClass.name} has been created successfully!${
          assignments.length > 0
            ? ` Added ${assignments.length} assignment${assignments.length === 1 ? "" : "s"}.`
            : ""
        }`,
      });
    } catch (error) {
      console.error("Error creating class:", error);
      errorToast({ message: "Failed to create class. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem);
    setShowClassModal(true);
  };

  const handleUpdateClass = async (
    classData: CreateClassData,
    assignments: CreateAssignmentData[],
  ) => {
    if (!editingClass) return;

    setIsLoading(true);
    try {
      const success = await updateClass(
        collegeId,
        semesterId,
        editingClass.id,
        classData,
      );
      if (success) {
        await loadData();
        setShowClassModal(false);
        setEditingClass(null);
        successToast({
          message: `${classData.name} has been updated successfully!`,
        });
      } else {
        errorToast({ message: "Class not found" });
      }
    } catch (error) {
      console.error("Error updating class:", error);
      errorToast({ message: "Failed to update class. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async (classItem: Class) => {
    if (
      !confirm(
        `Are you sure you want to delete "${classItem.name}"? This will also delete all assignments in this class.`,
      )
    ) {
      return;
    }

    try {
      await deleteClass(collegeId, semesterId, classItem.id);
      await loadData();
      successToast({
        message: `${classItem.name} has been deleted successfully!`,
      });
    } catch (error) {
      console.error("Error deleting class:", error);
      errorToast({ message: "Failed to delete class. Please try again." });
    }
  };

  const handleCreateAssignment = async (
    assignmentData: CreateAssignmentData,
  ) => {
    if (!selectedClassId) return;

    setIsLoading(true);
    try {
      const newAssignment = await createAssignment(
        collegeId,
        semesterId,
        selectedClassId,
        assignmentData,
      );
      await loadData();
      setShowAssignmentModal(false);
      setSelectedClassId("");
      successToast({
        message: `${newAssignment.title} has been created successfully!`,
      });
    } catch (error) {
      console.error("Error creating assignment:", error);
      errorToast({ message: "Failed to create assignment. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setSelectedClassId(assignment.classId);
    setShowAssignmentModal(true);
  };

  const handleUpdateAssignment = async (
    assignmentData: CreateAssignmentData,
  ) => {
    if (!editingAssignment) return;

    setIsLoading(true);
    try {
      const success = await updateAssignment(
        collegeId,
        semesterId,
        editingAssignment.classId,
        editingAssignment.id,
        assignmentData,
      );
      if (success) {
        await loadData();
        setShowAssignmentModal(false);
        setEditingAssignment(null);
        setSelectedClassId("");
        successToast({
          message: `${assignmentData.title} has been updated successfully!`,
        });
      } else {
        errorToast({ message: "Assignment not found" });
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      errorToast({ message: "Failed to update assignment. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignment: Assignment) => {
    if (!confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      return;
    }

    try {
      await deleteAssignment(
        collegeId,
        semesterId,
        assignment.classId,
        assignment.id,
      );
      await loadData();
      successToast({
        message: `${assignment.title} has been deleted successfully!`,
      });
    } catch (error) {
      console.error("Error deleting assignment:", error);
      errorToast({ message: "Failed to delete assignment. Please try again." });
    }
  };

  const openAssignmentModal = (classId: string) => {
    setSelectedClassId(classId);
    setEditingAssignment(null);
    setShowAssignmentModal(true);
  };

  const closeClassModal = () => {
    if (isLoading) return;
    setShowClassModal(false);
    setEditingClass(null);
  };

  const closeAssignmentModal = () => {
    if (isLoading) return;
    setShowAssignmentModal(false);
    setEditingAssignment(null);
    setSelectedClassId("");
  };

  const getClassStatusBadgeColor = (status: ClassStatus) => {
    switch (status) {
      case ClassStatus.ACTIVE:
        return "success";
      case ClassStatus.COMPLETED:
        return "gray";
      case ClassStatus.DROPPED:
        return "red";
      case ClassStatus.WITHDRAWN:
        return "yellow";
      default:
        return "gray";
    }
  };

  const getAssignmentStatusBadgeColor = (status: AssignmentStatus) => {
    switch (status) {
      case AssignmentStatus.COMPLETED:
      case AssignmentStatus.SUBMITTED:
        return "success";
      case AssignmentStatus.IN_PROGRESS:
        return "blue";
      case AssignmentStatus.OVERDUE:
        return "red";
      case AssignmentStatus.NOT_STARTED:
        return "gray";
      default:
        return "gray";
    }
  };

  const getPriorityBadgeColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return "red";
      case Priority.HIGH:
        return "yellow";
      case Priority.MEDIUM:
        return "blue";
      case Priority.LOW:
        return "gray";
      default:
        return "gray";
    }
  };

  const formatSchedule = (classItem: Class) => {
    if (classItem.schedule.length === 0) return "No schedule set";

    return classItem.schedule
      .map((slot) => {
        const day =
          DAYS_OF_WEEK.find((d) => d.value === slot.dayOfWeek)?.label ||
          "Unknown";
        const location =
          slot.location || slot.building || slot.room
            ? ` @ ${[slot.building, slot.room, slot.location].filter(Boolean).join(", ")}`
            : "";
        return `${day} ${slot.startTime}-${slot.endTime}${location}`;
      })
      .join("; ");
  };

  const getAllAssignments = () => {
    if (!semester) return [];

    return semester.classes.reduce(
      (acc, classItem) => {
        return acc.concat(
          classItem.assignments.map((assignment) => ({
            ...assignment,
            className: classItem.name,
            classColor: classItem.color,
          })),
        );
      },
      [] as Array<Assignment & { className: string; classColor?: string }>,
    );
  };

  const getAllScheduleSlots = (): ScheduleSlot[] => {
    if (!semester) return [];

    const scheduleSlots: ScheduleSlot[] = [];

    semester.classes.forEach((classItem) => {
      classItem.schedule.forEach((slot) => {
        scheduleSlots.push({
          ...slot,
          classId: classItem.id,
          className: classItem.name,
          courseCode: classItem.courseCode,
          classColor: classItem.color,
          instructor: slot.instructor || classItem.instructor,
        });
      });
    });

    return scheduleSlots;
  };

  const formatTime = (time: string): string => {
    try {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  const timeToMinutes = (time: string): number => {
    try {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    } catch {
      return 0;
    }
  };

  const renderWeeklyCalendar = () => {
    const scheduleSlots = getAllScheduleSlots();

    const slotsByDay: { [key: number]: ScheduleSlot[] } = {};
    scheduleSlots.forEach((slot) => {
      if (!slotsByDay[slot.dayOfWeek]) {
        slotsByDay[slot.dayOfWeek] = [];
      }
      slotsByDay[slot.dayOfWeek].push(slot);
    });

    Object.keys(slotsByDay).forEach((day) => {
      slotsByDay[parseInt(day)].sort(
        (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
      );
    });

    const timeSlots = [];
    for (let hour = 6; hour <= 22; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 22) {
        timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }

    const daysWithClasses = Object.keys(slotsByDay).map(Number).sort();
    const workingDays =
      daysWithClasses.length > 0 ? daysWithClasses : [1, 2, 3, 4, 5];

    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
            <div className="p-4 text-center font-medium text-gray-500 dark:text-gray-400">
              Time
            </div>
            {workingDays.map((dayValue) => {
              const day = DAYS_OF_WEEK.find((d) => d.value === dayValue);
              const daySlots = slotsByDay[dayValue] || [];
              return (
                <div key={dayValue} className="p-4 text-center">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {day?.label || "Unknown"}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {daySlots.length} class{daySlots.length !== 1 ? "es" : ""}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative">
            {timeSlots.map((time, timeIndex) => (
              <div
                key={time}
                className={`grid grid-cols-8 border-b border-gray-100 dark:border-gray-700 ${
                  time.endsWith(":00")
                    ? "border-gray-200 dark:border-gray-600"
                    : ""
                }`}
                style={{ minHeight: "60px" }}
              >
                <div className="flex items-center justify-center border-r border-gray-200 p-2 dark:border-gray-700">
                  <span
                    className={`text-sm ${
                      time.endsWith(":00")
                        ? "font-medium text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {time.endsWith(":00") ? formatTime(time) : ""}
                  </span>
                </div>

                {/* Day columns */}
                {workingDays.map((dayValue) => {
                  const daySlots = slotsByDay[dayValue] || [];
                  const currentTimeMinutes = timeToMinutes(time);

                  // Find slots that start at this time
                  const slotsAtThisTime = daySlots.filter((slot) => {
                    const slotStartMinutes = timeToMinutes(slot.startTime);
                    return slotStartMinutes === currentTimeMinutes;
                  });

                  return (
                    <div
                      key={`${dayValue}-${time}`}
                      className="relative border-r border-gray-200 p-1 dark:border-gray-700"
                    >
                      {slotsAtThisTime.map((slot, slotIndex) => {
                        const startMinutes = timeToMinutes(slot.startTime);
                        const endMinutes = timeToMinutes(slot.endTime);
                        const durationMinutes = endMinutes - startMinutes;
                        const heightPixels = (durationMinutes / 30) * 60;

                        const typeOption = SCHEDULE_TYPE_OPTIONS.find(
                          (opt) => opt.value === slot.type,
                        );

                        return (
                          <div
                            key={`${slot.classId}-${slot.type}-${slotIndex}`}
                            className="absolute right-1 left-1 rounded-md border-l-4 bg-white p-2 shadow-sm dark:bg-gray-700"
                            style={{
                              height: `${heightPixels}px`,
                              borderLeftColor:
                                slot.classColor ||
                                typeOption?.color ||
                                "#3B82F6",
                              backgroundColor: `${slot.classColor || typeOption?.color || "#3B82F6"}08`,
                            }}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                  {slot.courseCode}
                                </div>
                                <Badge
                                  color="gray"
                                  size="xs"
                                  style={{
                                    backgroundColor:
                                      typeOption?.color || "#6B7280",
                                    color: "white",
                                  }}
                                >
                                  {typeOption?.label || slot.type}
                                </Badge>
                              </div>
                              <div className="truncate text-xs text-gray-600 dark:text-gray-300">
                                {slot.className}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(slot.startTime)} -{" "}
                                {formatTime(slot.endTime)}
                              </div>
                              {(slot.location ||
                                slot.building ||
                                slot.room) && (
                                <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                                  📍{" "}
                                  {[slot.building, slot.room, slot.location]
                                    .filter(Boolean)
                                    .join(", ")}
                                </div>
                              )}
                              {slot.instructor &&
                                slot.instructor !==
                                  semester?.classes.find(
                                    (c) => c.id === slot.classId,
                                  )?.instructor && (
                                  <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                                    👨‍🏫 {slot.instructor}
                                  </div>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {semester?.classes
            .filter((classItem) => classItem.schedule.length > 0)
            .map((classItem) => (
              <Card key={classItem.id} className="overflow-hidden">
                <div
                  className="h-2"
                  style={{ backgroundColor: classItem.color || "#3B82F6" }}
                />
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {classItem.courseCode}
                    </h5>
                    <Badge
                      color={getClassStatusBadgeColor(classItem.status)}
                      size="sm"
                    >
                      {classItem.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    {classItem.name}
                  </p>
                  <div className="space-y-2">
                    {classItem.schedule.map((slot, index) => {
                      const day = DAYS_OF_WEEK.find(
                        (d) => d.value === slot.dayOfWeek,
                      );
                      const typeOption = SCHEDULE_TYPE_OPTIONS.find(
                        (opt) => opt.value === slot.type,
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: typeOption?.color || "#6B7280",
                              }}
                            />
                            <span className="text-gray-900 dark:text-white">
                              {day?.label} {formatTime(slot.startTime)}-
                              {formatTime(slot.endTime)}
                            </span>
                          </div>
                          <Badge color="gray" size="xs">
                            {typeOption?.label}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    );
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!college || !semester) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <HiX className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Data Not Found
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            The semester you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push(`/college/${collegeId}`)}
            color="blue"
          >
            <HiArrowLeft className="mr-2 h-4 w-4" />
            Back to College
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Breadcrumb className="mb-4">
              <BreadcrumbItem href="/">
                <HiAcademicCap className="mr-2 h-4 w-4" />
                College Buddy
              </BreadcrumbItem>
              <BreadcrumbItem href={`/college/${collegeId}`}>
                {college.name}
              </BreadcrumbItem>
              <BreadcrumbItem>{semester.name}</BreadcrumbItem>
            </Breadcrumb>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg bg-blue-600 p-2">
                  <HiCalendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {semester.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <Badge color="blue" size="sm">
                      {semester.type} {semester.year}
                    </Badge>
                    <span>
                      {new Date(semester.startDate).toLocaleDateString()} -{" "}
                      {new Date(semester.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowClassModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <HiPlus className="mr-2 h-4 w-4" />
                  Add Class
                </Button>
                <Button
                  color="gray"
                  onClick={() => router.push(`/college/${collegeId}`)}
                >
                  <HiArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs aria-label="Semester content">
          <TabItem active title="Classes" icon={HiBookOpen}>
            <div className="space-y-6">
              {semester.classes.length === 0 ? (
                <Card className="py-12 text-center">
                  <div className="flex flex-col items-center">
                    <HiBookOpen className="mb-4 h-16 w-16 text-gray-400" />
                    <h4 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      No Classes Added Yet
                    </h4>
                    <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
                      Start adding your classes for this semester. You can also
                      bulk add assignments when creating a class.
                    </p>
                    <Button
                      onClick={() => setShowClassModal(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <HiPlus className="mr-2 h-4 w-4" />
                      Add Your First Class
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {semester.classes.map((classItem) => (
                    <Card key={classItem.id} className="overflow-hidden">
                      <div
                        className="h-2"
                        style={{
                          backgroundColor: classItem.color || "#3B82F6",
                        }}
                      />
                      <div className="p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {classItem.name}
                            </h5>
                            <div className="mt-1 flex items-center space-x-2">
                              <Badge color="blue" size="sm">
                                {classItem.courseCode}
                              </Badge>
                              {classItem.section && (
                                <Badge color="gray" size="sm">
                                  Section {classItem.section}
                                </Badge>
                              )}
                              <Badge
                                color={getClassStatusBadgeColor(
                                  classItem.status,
                                )}
                                size="sm"
                              >
                                {classItem.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="xs"
                              color="gray"
                              onClick={() => handleEditClass(classItem)}
                            >
                              <HiPencil className="h-3 w-3" />
                            </Button>
                            <Button
                              size="xs"
                              color="red"
                              onClick={() => handleDeleteClass(classItem)}
                            >
                              <HiTrash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <HiUser className="mr-2 h-4 w-4" />
                            <span>{classItem.instructor}</span>
                            {classItem.instructorEmail && (
                              <a
                                href={`mailto:${classItem.instructorEmail}`}
                                className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                              >
                                <HiMail className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          <div className="flex items-center">
                            <HiClock className="mr-2 h-4 w-4" />
                            <span>{formatSchedule(classItem)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Credits: {classItem.credits}</span>
                            <span>
                              Assignments: {classItem.assignments.length}
                            </span>
                          </div>
                          {classItem.currentGrade && (
                            <div className="flex justify-between">
                              <span>Current Grade:</span>
                              <Badge color="green">
                                {classItem.currentGrade.toFixed(1)}%
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <Button
                            size="sm"
                            outline
                            className="flex-1"
                            onClick={() => openAssignmentModal(classItem.id)}
                          >
                            <HiPlus className="mr-2 h-4 w-4" />
                            Add Assignment
                          </Button>
                          {classItem.syllabus && (
                            <Button
                              size="sm"
                              color="gray"
                              onClick={() =>
                                window.open(classItem.syllabus, "_blank")
                              }
                            >
                              Syllabus
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabItem>

          <TabItem title="Weekly Schedule" icon={HiCalendar}>
            {semester.classes.filter((c) => c.schedule.length > 0).length ===
            0 ? (
              <Card className="py-12 text-center">
                <div className="flex flex-col items-center">
                  <HiCalendar className="mb-4 h-16 w-16 text-gray-400" />
                  <h4 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    No Class Schedule Yet
                  </h4>
                  <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
                    Add classes with scheduled times to see your weekly calendar
                    view.
                  </p>
                  <Button
                    onClick={() => setShowClassModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <HiPlus className="mr-2 h-4 w-4" />
                    Add Class with Schedule
                  </Button>
                </div>
              </Card>
            ) : (
              renderWeeklyCalendar()
            )}
          </TabItem>

          <TabItem title="Assignments" icon={HiClipboardList}>
            <div className="space-y-6">
              {getAllAssignments().length === 0 ? (
                <Card className="py-12 text-center">
                  <div className="flex flex-col items-center">
                    <HiClipboardList className="mb-4 h-16 w-16 text-gray-400" />
                    <h4 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      No Assignments Yet
                    </h4>
                    <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
                      Add classes first, then you can create assignments for
                      each class.
                    </p>
                    {semester.classes.length === 0 ? (
                      <Button
                        onClick={() => setShowClassModal(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <HiPlus className="mr-2 h-4 w-4" />
                        Add Your First Class
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          openAssignmentModal(semester.classes[0].id)
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <HiPlus className="mr-2 h-4 w-4" />
                        Add Your First Assignment
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {getAllAssignments()
                    .sort(
                      (a, b) =>
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime(),
                    )
                    .map((assignment) => (
                      <Card key={assignment.id} className="overflow-hidden">
                        <div
                          className="h-1"
                          style={{
                            backgroundColor: assignment.classColor || "#3B82F6",
                          }}
                        />
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {assignment.title}
                                </h5>
                                <Badge
                                  color={getAssignmentStatusBadgeColor(
                                    assignment.status,
                                  )}
                                  size="sm"
                                >
                                  {assignment.status.replace("_", " ")}
                                </Badge>
                                <Badge
                                  color={getPriorityBadgeColor(
                                    assignment.priority,
                                  )}
                                  size="sm"
                                >
                                  {assignment.priority}
                                </Badge>
                              </div>
                              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">
                                  {assignment.className}
                                </span>
                                <span>{assignment.type.replace("_", " ")}</span>
                                <span>
                                  Due:{" "}
                                  {new Date(
                                    assignment.dueDate,
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                size="xs"
                                color="gray"
                                onClick={() => handleEditAssignment(assignment)}
                              >
                                <HiPencil className="h-3 w-3" />
                              </Button>
                              <Button
                                size="xs"
                                color="red"
                                onClick={() =>
                                  handleDeleteAssignment(assignment)
                                }
                              >
                                <HiTrash className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {assignment.description && (
                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                              {assignment.description}
                            </p>
                          )}

                          <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              {assignment.points && (
                                <span className="text-gray-600 dark:text-gray-400">
                                  Points: {assignment.earnedPoints || 0}/
                                  {assignment.points}
                                </span>
                              )}
                              {assignment.estimatedHours && (
                                <span className="text-gray-600 dark:text-gray-400">
                                  Est. Hours: {assignment.estimatedHours}
                                </span>
                              )}
                              {assignment.actualHours && (
                                <span className="text-gray-600 dark:text-gray-400">
                                  Actual Hours: {assignment.actualHours}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {new Date(assignment.dueDate) < new Date() &&
                                assignment.status !==
                                  AssignmentStatus.COMPLETED &&
                                assignment.status !==
                                  AssignmentStatus.SUBMITTED && (
                                  <HiExclamationCircle
                                    className="h-5 w-5 text-red-500"
                                    title="Overdue"
                                  />
                                )}
                              {(assignment.status ===
                                AssignmentStatus.COMPLETED ||
                                assignment.status ===
                                  AssignmentStatus.SUBMITTED) && (
                                <HiCheckCircle
                                  className="h-5 w-5 text-green-500"
                                  title="Completed"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </TabItem>
        </Tabs>
      </div>

      <ClassFormModal
        isOpen={showClassModal}
        onClose={closeClassModal}
        onSubmit={editingClass ? handleUpdateClass : handleCreateClass}
        editingClass={editingClass}
        semesterId={semesterId}
        isLoading={isLoading}
      />

      <AssignmentFormModal
        isOpen={showAssignmentModal}
        onClose={closeAssignmentModal}
        onSubmit={
          editingAssignment ? handleUpdateAssignment : handleCreateAssignment
        }
        editingAssignment={editingAssignment}
        classId={selectedClassId}
        isLoading={isLoading}
      />
    </main>
  );
}
