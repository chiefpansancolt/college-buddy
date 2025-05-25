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
} from "@/types/app/app";
import {
  ASSIGNMENT_STATUS_OPTIONS,
  ASSIGNMENT_TYPE_OPTIONS,
  CLASS_COLORS,
  CLASS_STATUS_OPTIONS,
  DAYS_OF_WEEK,
  PRIORITY_OPTIONS,
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

  const addScheduleSlot = () => {
    const newSlot: ClassSchedule = {
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "10:30",
      location: "",
      building: "",
      room: "",
    };
    handleInputChange("schedule", [...formData.schedule, newSlot]);
  };

  const updateScheduleSlot = (
    index: number,
    field: keyof ClassSchedule,
    value: string | number,
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

  return (
    <Modal show={isOpen} onClose={handleClose} size="2xl">
      <ModalHeader>{editingClass ? "Edit Class" : "Add New Class"}</ModalHeader>
      <ModalBody>
        <Tabs aria-label="Class form tabs" variant="fullWidth">
          <TabItem active title="Class Details" icon={HiBookOpen}>
            <div className="space-y-6">
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

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <Label>Class Schedule</Label>
                  <Button
                    size="xs"
                    onClick={addScheduleSlot}
                    disabled={isLoading}
                  >
                    <HiPlus className="mr-1 h-3 w-3" />
                    Add Time Slot
                  </Button>
                </div>

                {formData.schedule.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No schedule added yet. Click "Add Time Slot" to add class
                    times.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {formData.schedule.map((slot, index) => (
                      <Card key={index} className="p-3">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                          <div>
                            <Label htmlFor={`day-${index}`}>Day</Label>
                            <Select
                              id={`day-${index}`}
                              value={slot.dayOfWeek}
                              onChange={(e) =>
                                updateScheduleSlot(
                                  index,
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
                            <Label htmlFor={`start-${index}`}>Start Time</Label>
                            <TextInput
                              id={`start-${index}`}
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateScheduleSlot(
                                  index,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                              disabled={isLoading}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`end-${index}`}>End Time</Label>
                            <TextInput
                              id={`end-${index}`}
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateScheduleSlot(
                                  index,
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
                              onClick={() => removeScheduleSlot(index)}
                              disabled={isLoading}
                            >
                              <HiTrash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                          <div>
                            <Label htmlFor={`location-${index}`}>
                              Location
                            </Label>
                            <TextInput
                              id={`location-${index}`}
                              placeholder="e.g., Main Hall"
                              value={slot.location || ""}
                              onChange={(e) =>
                                updateScheduleSlot(
                                  index,
                                  "location",
                                  e.target.value,
                                )
                              }
                              disabled={isLoading}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`building-${index}`}>
                              Building
                            </Label>
                            <TextInput
                              id={`building-${index}`}
                              placeholder="e.g., Science Building"
                              value={slot.building || ""}
                              onChange={(e) =>
                                updateScheduleSlot(
                                  index,
                                  "building",
                                  e.target.value,
                                )
                              }
                              disabled={isLoading}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`room-${index}`}>Room</Label>
                            <TextInput
                              id={`room-${index}`}
                              placeholder="e.g., 204"
                              value={slot.room || ""}
                              onChange={(e) =>
                                updateScheduleSlot(
                                  index,
                                  "room",
                                  e.target.value,
                                )
                              }
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

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
                    {assignments.map((assignment, index) => (
                      <Card key={index} className="p-4">
                        <div className="mb-4 flex items-start justify-between">
                          <h5 className="text-md font-medium text-gray-900 dark:text-white">
                            Assignment #{index + 1}
                          </h5>
                          <Button
                            size="xs"
                            color="red"
                            onClick={() => removeAssignment(index)}
                            disabled={isLoading}
                          >
                            <HiTrash className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`assignment-title-${index}`}>
                              Title <abbr className="text-red-600">*</abbr>
                            </Label>
                            <TextInput
                              id={`assignment-title-${index}`}
                              placeholder="e.g., Chapter 1 Quiz"
                              value={assignment.title}
                              onChange={(e) =>
                                updateAssignment(index, "title", e.target.value)
                              }
                              disabled={isLoading}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                              <Label htmlFor={`assignment-type-${index}`}>
                                Type
                              </Label>
                              <Select
                                id={`assignment-type-${index}`}
                                value={assignment.type}
                                onChange={(e) =>
                                  updateAssignment(
                                    index,
                                    "type",
                                    e.target.value as AssignmentType,
                                  )
                                }
                                disabled={isLoading}
                              >
                                {ASSIGNMENT_TYPE_OPTIONS.map((option) => (
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
                              <Label htmlFor={`assignment-priority-${index}`}>
                                Priority
                              </Label>
                              <Select
                                id={`assignment-priority-${index}`}
                                value={assignment.priority}
                                onChange={(e) =>
                                  updateAssignment(
                                    index,
                                    "priority",
                                    e.target.value as Priority,
                                  )
                                }
                                disabled={isLoading}
                              >
                                {PRIORITY_OPTIONS.map((option) => (
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
                              <Label htmlFor={`assignment-due-${index}`}>
                                Due Date <abbr className="text-red-600">*</abbr>
                              </Label>
                              <TextInput
                                id={`assignment-due-${index}`}
                                type="datetime-local"
                                value={
                                  assignment.dueDate instanceof Date
                                    ? assignment.dueDate
                                        .toISOString()
                                        .slice(0, 16)
                                    : ""
                                }
                                onChange={(e) =>
                                  updateAssignment(
                                    index,
                                    "dueDate",
                                    new Date(e.target.value),
                                  )
                                }
                                disabled={isLoading}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <Label htmlFor={`assignment-points-${index}`}>
                                Points
                              </Label>
                              <TextInput
                                id={`assignment-points-${index}`}
                                type="number"
                                min="0"
                                placeholder="e.g., 100"
                                value={assignment.points || ""}
                                onChange={(e) =>
                                  updateAssignment(
                                    index,
                                    "points",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined,
                                  )
                                }
                                disabled={isLoading}
                              />
                            </div>

                            <div>
                              <Label htmlFor={`assignment-hours-${index}`}>
                                Estimated Hours
                              </Label>
                              <TextInput
                                id={`assignment-hours-${index}`}
                                type="number"
                                step="0.5"
                                min="0"
                                placeholder="e.g., 2.5"
                                value={assignment.estimatedHours || ""}
                                onChange={(e) =>
                                  updateAssignment(
                                    index,
                                    "estimatedHours",
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : undefined,
                                  )
                                }
                                disabled={isLoading}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`assignment-description-${index}`}>
                              Description
                            </Label>
                            <Textarea
                              id={`assignment-description-${index}`}
                              placeholder="Assignment details..."
                              value={assignment.description}
                              onChange={(e) =>
                                updateAssignment(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              disabled={isLoading}
                              rows={2}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
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
