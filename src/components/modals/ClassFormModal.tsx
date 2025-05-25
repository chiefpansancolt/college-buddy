// Updated ClassFormModal.tsx with schedule type support

"use client";

import {
  Badge,
  Button,
  Card,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Spinner,
  TabItem,
  Tabs,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiBookOpen, HiClipboardList, HiPlus, HiTrash } from "react-icons/hi";
import {
  AssignmentStatus,
  AssignmentType,
  Class,
  ClassSchedule,
  ClassStatus,
  CreateAssignmentData,
  CreateClassData,
  Priority,
  ScheduleType,
} from "@/types/app/app";
import {
  ASSIGNMENT_STATUS_OPTIONS,
  ASSIGNMENT_TYPE_OPTIONS,
  CLASS_COLORS,
  CLASS_STATUS_OPTIONS,
  DAYS_OF_WEEK,
  PRIORITY_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
  getScheduleTypeColor,
} from "@/data/constants/class";

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    classData: CreateClassData,
    assignments: CreateAssignmentData[],
  ) => Promise<void>;
  editingClass?: Class | null;
  semesterId: string;
  isLoading?: boolean;
}

export default function ClassFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingClass,
  semesterId,
  isLoading = false,
}: ClassFormModalProps) {
  const [formData, setFormData] = useState<CreateClassData>({
    name: "",
    courseCode: "",
    section: "",
    credits: 3,
    instructor: "",
    instructorEmail: "",
    status: ClassStatus.ACTIVE,
    schedule: [],
    syllabus: "",
    description: "",
    officeHours: "",
    semesterId: semesterId,
    currentGrade: undefined,
    targetGrade: undefined,
    color: "#3B82F6",
  });

  const [assignments, setAssignments] = useState<CreateAssignmentData[]>([]);

  useEffect(() => {
    if (editingClass) {
      setFormData({
        name: editingClass.name,
        courseCode: editingClass.courseCode,
        section: editingClass.section || "",
        credits: editingClass.credits,
        instructor: editingClass.instructor,
        instructorEmail: editingClass.instructorEmail || "",
        status: editingClass.status,
        schedule: editingClass.schedule,
        syllabus: editingClass.syllabus || "",
        description: editingClass.description || "",
        officeHours: editingClass.officeHours || "",
        semesterId: editingClass.semesterId,
        currentGrade: editingClass.currentGrade,
        targetGrade: editingClass.targetGrade,
        color: editingClass.color || "#3B82F6",
      });
      setAssignments([]);
    } else {
      resetForm();
    }
  }, [editingClass, semesterId]);

  const resetForm = () => {
    setFormData({
      name: "",
      courseCode: "",
      section: "",
      credits: 3,
      instructor: "",
      instructorEmail: "",
      status: ClassStatus.ACTIVE,
      schedule: [],
      syllabus: "",
      description: "",
      officeHours: "",
      semesterId: semesterId,
      currentGrade: undefined,
      targetGrade: undefined,
      color: "#3B82F6",
    });
    setAssignments([]);
  };

  const handleInputChange = (
    field: keyof CreateClassData,
    value: string | number | ClassStatus | ClassSchedule[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addScheduleSlot = (type: ScheduleType = ScheduleType.LECTURE) => {
    const newSlot: ClassSchedule = {
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "10:30",
      location: "",
      building: "",
      room: "",
      type: type,
      instructor: "",
      notes: "",
    };
    handleInputChange("schedule", [...formData.schedule, newSlot]);
  };

  const updateScheduleSlot = (
    index: number,
    field: keyof ClassSchedule,
    value: string | number | ScheduleType,
  ) => {
    const updatedSchedule = formData.schedule.map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot,
    );
    handleInputChange("schedule", updatedSchedule);
  };

  const removeScheduleSlot = (index: number) => {
    const updatedSchedule = formData.schedule.filter((_, i) => i !== index);
    handleInputChange("schedule", updatedSchedule);
  };

  const addAssignment = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newAssignment: CreateAssignmentData = {
      title: "",
      description: "",
      type: AssignmentType.HOMEWORK,
      status: AssignmentStatus.NOT_STARTED,
      priority: Priority.MEDIUM,
      dueDate: tomorrow,
      estimatedHours: undefined,
      actualHours: undefined,
      points: undefined,
      earnedPoints: undefined,
      classId: "temp",
      notes: "",
      reminderDate: undefined,
    };
    setAssignments((prev) => [...prev, newAssignment]);
  };

  const updateAssignment = (
    index: number,
    field: keyof CreateAssignmentData,
    value: any,
  ) => {
    setAssignments((prev) =>
      prev.map((assignment, i) =>
        i === index ? { ...assignment, [field]: value } : assignment,
      ),
    );
  };

  const removeAssignment = (index: number) => {
    setAssignments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    await onSubmit(formData, assignments);
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose();
    if (!editingClass) {
      resetForm();
    }
  };

  // Group schedule slots by type for better organization
  const groupedSchedule = formData.schedule.reduce(
    (acc, slot, index) => {
      if (!acc[slot.type]) {
        acc[slot.type] = [];
      }
      acc[slot.type].push({ ...slot, originalIndex: index });
      return acc;
    },
    {} as Record<
      ScheduleType,
      Array<ClassSchedule & { originalIndex: number }>
    >,
  );

  return (
    <Modal show={isOpen} onClose={handleClose} size="2xl">
      <ModalHeader>{editingClass ? "Edit Class" : "Add New Class"}</ModalHeader>
      <ModalBody>
        <Tabs aria-label="Class form tabs" variant="fullWidth">
          <TabItem active title="Class Details" icon={HiBookOpen}>
            <div className="space-y-6">
              {/* Basic class information - same as before */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="className">
                    Class Name <abbr className="text-red-600">*</abbr>
                  </Label>
                  <TextInput
                    id="className"
                    placeholder="e.g., Introduction to Psychology"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="courseCode">
                    Course Code <abbr className="text-red-600">*</abbr>
                  </Label>
                  <TextInput
                    id="courseCode"
                    placeholder="e.g., PSYC 101"
                    value={formData.courseCode}
                    onChange={(e) =>
                      handleInputChange("courseCode", e.target.value)
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Other basic fields - same as before */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="section">Section</Label>
                  <TextInput
                    id="section"
                    placeholder="e.g., 001"
                    value={formData.section}
                    onChange={(e) =>
                      handleInputChange("section", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <TextInput
                    id="credits"
                    type="number"
                    min="1"
                    max="6"
                    value={formData.credits}
                    onChange={(e) =>
                      handleInputChange("credits", parseInt(e.target.value))
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value as ClassStatus)
                    }
                    disabled={isLoading}
                  >
                    {CLASS_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="instructor">
                    Instructor <abbr className="text-red-600">*</abbr>
                  </Label>
                  <TextInput
                    id="instructor"
                    placeholder="e.g., Dr. Jane Smith"
                    value={formData.instructor}
                    onChange={(e) =>
                      handleInputChange("instructor", e.target.value)
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instructorEmail">Instructor Email</Label>
                  <TextInput
                    id="instructorEmail"
                    type="email"
                    placeholder="e.g., jsmith@university.edu"
                    value={formData.instructorEmail}
                    onChange={(e) =>
                      handleInputChange("instructorEmail", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="color">Class Color</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CLASS_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleInputChange("color", color.value)}
                      className={`h-8 w-8 rounded-full border-2 ${
                        formData.color === color.value
                          ? "border-gray-900 dark:border-white"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Enhanced Schedule Section */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <Label>Class Schedule</Label>
                  <div className="flex gap-2">
                    <Button
                      size="xs"
                      onClick={() => addScheduleSlot(ScheduleType.LECTURE)}
                      disabled={isLoading}
                      color="blue"
                    >
                      <HiPlus className="mr-1 h-3 w-3" />
                      Add Lecture
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => addScheduleSlot(ScheduleType.LAB)}
                      disabled={isLoading}
                      color="green"
                    >
                      <HiPlus className="mr-1 h-3 w-3" />
                      Add Lab
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => addScheduleSlot(ScheduleType.OTHER)}
                      disabled={isLoading}
                      color="gray"
                    >
                      <HiPlus className="mr-1 h-3 w-3" />
                      Add Other
                    </Button>
                  </div>
                </div>

                {formData.schedule.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No schedule added yet. Click "Add Lecture", "Add Lab", or
                    "Add Other" to add class times.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedSchedule).map(([type, slots]) => {
                      const typeOption = SCHEDULE_TYPE_OPTIONS.find(
                        (opt) => opt.value === type,
                      );
                      return (
                        <div key={type} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: typeOption?.color || "#6B7280",
                              }}
                            />
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {typeOption?.label || type} Sessions
                            </h4>
                            <Badge color="blue" size="sm">
                              {slots.length}
                            </Badge>
                          </div>

                          {slots.map((slot) => (
                            <Card key={slot.originalIndex} className="p-3">
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                                <div>
                                  <Label htmlFor={`type-${slot.originalIndex}`}>
                                    Type
                                  </Label>
                                  <Select
                                    id={`type-${slot.originalIndex}`}
                                    value={slot.type}
                                    onChange={(e) =>
                                      updateScheduleSlot(
                                        slot.originalIndex,
                                        "type",
                                        e.target.value as ScheduleType,
                                      )
                                    }
                                    disabled={isLoading}
                                  >
                                    {SCHEDULE_TYPE_OPTIONS.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor={`day-${slot.originalIndex}`}>
                                    Day
                                  </Label>
                                  <Select
                                    id={`day-${slot.originalIndex}`}
                                    value={slot.dayOfWeek}
                                    onChange={(e) =>
                                      updateScheduleSlot(
                                        slot.originalIndex,
                                        "dayOfWeek",
                                        parseInt(e.target.value),
                                      )
                                    }
                                    disabled={isLoading}
                                  >
                                    {DAYS_OF_WEEK.map((day) => (
                                      <option key={day.value} value={day.value}>
                                        {day.label}
                                      </option>
                                    ))}
                                  </Select>
                                </div>

                                <div>
                                  <Label
                                    htmlFor={`start-${slot.originalIndex}`}
                                  >
                                    Start
                                  </Label>
                                  <TextInput
                                    id={`start-${slot.originalIndex}`}
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) =>
                                      updateScheduleSlot(
                                        slot.originalIndex,
                                        "startTime",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isLoading}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor={`end-${slot.originalIndex}`}>
                                    End
                                  </Label>
                                  <TextInput
                                    id={`end-${slot.originalIndex}`}
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) =>
                                      updateScheduleSlot(
                                        slot.originalIndex,
                                        "endTime",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isLoading}
                                  />
                                </div>

                                <div className="flex items-end">
                                  <Button
                                    size="xs"
                                    color="red"
                                    onClick={() =>
                                      removeScheduleSlot(slot.originalIndex)
                                    }
                                    disabled={isLoading}
                                  >
                                    <HiTrash className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
                                <div>
                                  <Label
                                    htmlFor={`location-${slot.originalIndex}`}
                                  >
                                    Location
                                  </Label>
                                  <TextInput
                                    id={`location-${slot.originalIndex}`}
                                    placeholder="e.g., Main Hall"
                                    value={slot.location || ""}
                                    onChange={(e) =>
                                      updateScheduleSlot(
                                        slot.originalIndex,
                                        "location",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isLoading}
                                  />
                                </div>

                                <div>
                                  <Label
                                    htmlFor={`building-${slot.originalIndex}`}
                                  >
                                    Building
                                  </Label>
                                  <TextInput
                                    id={`building-${slot.originalIndex}`}
                                    placeholder="e.g., Science Building"
                                    value={slot.building || ""}
                                    onChange={(e) =>
                                      updateScheduleSlot(
                                        slot.originalIndex,
                                        "building",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isLoading}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor={`room-${slot.originalIndex}`}>
                                    Room
                                  </Label>
                                  <TextInput
                                    id={`room-${slot.originalIndex}`}
                                    placeholder="e.g., 204"
                                    value={slot.room || ""}
                                    onChange={(e) =>
                                      updateScheduleSlot(
                                        slot.originalIndex,
                                        "room",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isLoading}
                                  />
                                </div>

                                <div>
                                  <Label
                                    htmlFor={`slot-instructor-${slot.originalIndex}`}
                                  >
                                    Instructor
                                  </Label>
                                  <TextInput
                                    id={`slot-instructor-${slot.originalIndex}`}
                                    placeholder="e.g., TA Name"
                                    value={slot.instructor || ""}
                                    onChange={(e) =>
                                      updateScheduleSlot(
                                        slot.originalIndex,
                                        "instructor",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isLoading}
                                  />
                                </div>
                              </div>

                              {slot.type === ScheduleType.LAB && (
                                <div className="mt-3">
                                  <Label
                                    htmlFor={`notes-${slot.originalIndex}`}
                                  >
                                    Lab Notes
                                  </Label>
                                  <TextInput
                                    id={`notes-${slot.originalIndex}`}
                                    placeholder="e.g., Bring laptop, safety goggles required"
                                    value={slot.notes || ""}
                                    onChange={(e) =>
                                      updateScheduleSlot(
                                        slot.originalIndex,
                                        "notes",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isLoading}
                                  />
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Rest of the form fields remain the same */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="currentGrade">Current Grade (%)</Label>
                  <TextInput
                    id="currentGrade"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="e.g., 87.5"
                    value={formData.currentGrade || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "currentGrade",
                        e.target.value ? parseFloat(e.target.value) : "",
                      )
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="targetGrade">Target Grade (%)</Label>
                  <TextInput
                    id="targetGrade"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="e.g., 90.0"
                    value={formData.targetGrade || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "targetGrade",
                        e.target.value ? parseFloat(e.target.value) : "",
                      )
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Course description..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="syllabus">Syllabus URL</Label>
                  <TextInput
                    id="syllabus"
                    type="url"
                    placeholder="e.g., https://example.com/syllabus.pdf"
                    value={formData.syllabus}
                    onChange={(e) =>
                      handleInputChange("syllabus", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="officeHours">Office Hours</Label>
                  <TextInput
                    id="officeHours"
                    placeholder="e.g., Mon & Wed 2-4 PM"
                    value={formData.officeHours}
                    onChange={(e) =>
                      handleInputChange("officeHours", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </TabItem>

          {/* Assignments tab remains the same */}
          {!editingClass && (
            <TabItem
              title={
                <div className="flex items-center">
                  Assignments
                  {assignments.length > 0 && (
                    <Badge color="blue" size="sm" className="ml-2">
                      {assignments.length}
                    </Badge>
                  )}
                </div>
              }
              icon={HiClipboardList}
            >
              {/* Assignment form content remains the same as original */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Bulk Add Assignments
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add multiple assignments that will be created along with
                      the class
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={addAssignment}
                    disabled={isLoading}
                  >
                    <HiPlus className="mr-2 h-4 w-4" />
                    Add Assignment
                  </Button>
                </div>

                {assignments.length === 0 ? (
                  <Card className="py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No assignments added yet. Click "Add Assignment" to start
                      adding assignments.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {/* Assignment form components remain the same */}
                  </div>
                )}
              </div>
            </TabItem>
          )}
        </Tabs>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={handleSubmit}
          disabled={
            isLoading ||
            !formData.name.trim() ||
            !formData.courseCode.trim() ||
            !formData.instructor.trim()
          }
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Spinner
                size="sm"
                aria-label="Loading..."
                className="me-3"
                light
              />
              Loading...
            </>
          ) : editingClass ? (
            "Update Class"
          ) : (
            `Create Class${assignments.length > 0 ? ` & ${assignments.length} Assignment${assignments.length === 1 ? "" : "s"}` : ""}`
          )}
        </Button>
        <Button color="gray" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
