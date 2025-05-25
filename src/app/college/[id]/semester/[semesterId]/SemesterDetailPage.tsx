"use client";

import {
  Button,
  Card,
  Badge,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabItem,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiPlus,
  HiAcademicCap,
  HiCalendar,
  HiArrowLeft,
  HiBookOpen,
  HiClipboardList,
  HiPencil,
  HiTrash,
  HiClock,
  HiLocationMarker,
  HiUser,
  HiMail,
  HiExclamationCircle,
  HiCheckCircle,
  HiX,
} from "react-icons/hi";
import {
  College,
  Semester,
  Class,
  Assignment,
  CreateClassData,
  CreateAssignmentData,
  ClassStatus,
  AssignmentStatus,
  Priority,
} from "@/types/app/app";
import {
  getCollegeById,
  getSemesterById,
  createClass,
  updateClass,
  deleteClass,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "@/lib/storage";
import { successToast, errorToast } from "@/lib/notifications";
import ClassFormModal from "@/components/modals/ClassFormModal";
import AssignmentFormModal from "@/components/modals/AssignmentFormModal";
import { DAYS_OF_WEEK } from "@/data/constants/class";

interface SemesterDetailPageProps {
  collegeId: string;
  semesterId: string;
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

      await loadData(); // Refresh data
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
        await loadData(); // Refresh data
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
      await loadData(); // Refresh data
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
      await loadData(); // Refresh data
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
        await loadData(); // Refresh data
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
      await loadData(); // Refresh data
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
      {/* Header */}
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

      {/* Class Form Modal */}
      <ClassFormModal
        isOpen={showClassModal}
        onClose={closeClassModal}
        onSubmit={editingClass ? handleUpdateClass : handleCreateClass}
        editingClass={editingClass}
        semesterId={semesterId}
        isLoading={isLoading}
      />

      {/* Assignment Form Modal */}
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
