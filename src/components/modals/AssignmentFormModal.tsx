"use client";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  Spinner,
} from "flowbite-react";
import { useState, useEffect } from "react";
import {
  CreateAssignmentData,
  Assignment,
  AssignmentType,
  AssignmentStatus,
  Priority,
} from "@/types/app/app";
import {
  ASSIGNMENT_TYPE_OPTIONS,
  ASSIGNMENT_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from "@/data/constants/class";

interface AssignmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssignmentData) => Promise<void>;
  editingAssignment?: Assignment | null;
  classId: string;
  isLoading?: boolean;
}

export default function AssignmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingAssignment,
  classId,
  isLoading = false,
}: AssignmentFormModalProps) {
  const [formData, setFormData] = useState<CreateAssignmentData>({
    title: "",
    description: "",
    type: AssignmentType.HOMEWORK,
    status: AssignmentStatus.NOT_STARTED,
    priority: Priority.MEDIUM,
    dueDate: new Date(),
    estimatedHours: undefined,
    actualHours: undefined,
    points: undefined,
    earnedPoints: undefined,
    classId: classId,
    notes: "",
    reminderDate: undefined,
  });

  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        title: editingAssignment.title,
        description: editingAssignment.description || "",
        type: editingAssignment.type,
        status: editingAssignment.status,
        priority: editingAssignment.priority,
        dueDate: editingAssignment.dueDate,
        estimatedHours: editingAssignment.estimatedHours,
        actualHours: editingAssignment.actualHours,
        points: editingAssignment.points,
        earnedPoints: editingAssignment.earnedPoints,
        classId: editingAssignment.classId,
        notes: editingAssignment.notes || "",
        reminderDate: editingAssignment.reminderDate,
      });
    } else {
      resetForm();
    }
  }, [editingAssignment, classId]);

  const resetForm = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    setFormData({
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
      classId: classId,
      notes: "",
      reminderDate: undefined,
    });
  };

  const handleInputChange = (
    field: keyof CreateAssignmentData,
    value:
      | string
      | number
      | Date
      | AssignmentType
      | AssignmentStatus
      | Priority,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose();
    if (!editingAssignment) {
      resetForm();
    }
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="xl">
      <ModalHeader>
        {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
      </ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <div>
            <Label htmlFor="assignmentTitle">
              Title <abbr className="text-red-600">*</abbr>
            </Label>
            <TextInput
              id="assignmentTitle"
              placeholder="e.g., Chapter 5 Homework"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Assignment details..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  handleInputChange("type", e.target.value as AssignmentType)
                }
                disabled={isLoading}
              >
                {ASSIGNMENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    e.target.value as AssignmentStatus,
                  )
                }
                disabled={isLoading}
              >
                {ASSIGNMENT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) =>
                  handleInputChange("priority", e.target.value as Priority)
                }
                disabled={isLoading}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">
                Due Date <abbr className="text-red-600">*</abbr>
              </Label>
              <TextInput
                id="dueDate"
                type="datetime-local"
                value={
                  formData.dueDate instanceof Date
                    ? formData.dueDate.toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("dueDate", new Date(e.target.value))
                }
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <TextInput
                id="estimatedHours"
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g., 2.5"
                value={formData.estimatedHours || ""}
                onChange={(e) =>
                  handleInputChange(
                    "estimatedHours",
                    e.target.value ? parseFloat(e.target.value) : "",
                  )
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="actualHours">Actual Hours</Label>
              <TextInput
                id="actualHours"
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g., 3.0"
                value={formData.actualHours || ""}
                onChange={(e) =>
                  handleInputChange(
                    "actualHours",
                    e.target.value ? parseFloat(e.target.value) : "",
                  )
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="points">Total Points</Label>
              <TextInput
                id="points"
                type="number"
                min="0"
                placeholder="e.g., 100"
                value={formData.points || ""}
                onChange={(e) =>
                  handleInputChange(
                    "points",
                    e.target.value ? parseInt(e.target.value) : "",
                  )
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="earnedPoints">Earned Points</Label>
              <TextInput
                id="earnedPoints"
                type="number"
                min="0"
                placeholder="e.g., 85"
                value={formData.earnedPoints || ""}
                onChange={(e) =>
                  handleInputChange(
                    "earnedPoints",
                    e.target.value ? parseInt(e.target.value) : "",
                  )
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reminderDate">Reminder Date</Label>
            <TextInput
              id="reminderDate"
              type="datetime-local"
              value={
                formData.reminderDate instanceof Date
                  ? formData.reminderDate.toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                handleInputChange(
                  "reminderDate",
                  e.target.value ? new Date(e.target.value) : "",
                )
              }
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !formData.title.trim()}
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
          ) : editingAssignment ? (
            "Update Assignment"
          ) : (
            "Create Assignment"
          )}
        </Button>
        <Button color="gray" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
