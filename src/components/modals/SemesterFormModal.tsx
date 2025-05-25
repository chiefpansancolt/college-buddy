"use client";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  TextInput,
  Select,
  Spinner,
} from "flowbite-react";
import { useState, useEffect } from "react";
import {
  CreateSemesterData,
  Semester,
  SemesterType,
  SemesterStatus,
} from "@/types/app/app";

interface SemesterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSemesterData) => Promise<void>;
  editingSemester?: Semester | null;
  collegeId: string;
  isLoading?: boolean;
}

const semesterTypeOptions = [
  { value: SemesterType.FALL, label: "Fall" },
  { value: SemesterType.SPRING, label: "Spring" },
  { value: SemesterType.SUMMER, label: "Summer" },
  { value: SemesterType.WINTER, label: "Winter" },
];

const semesterStatusOptions = [
  { value: SemesterStatus.UPCOMING, label: "Upcoming" },
  { value: SemesterStatus.CURRENT, label: "Current" },
  { value: SemesterStatus.COMPLETED, label: "Completed" },
];

export default function SemesterFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingSemester,
  collegeId,
  isLoading = false,
}: SemesterFormModalProps) {
  const [formData, setFormData] = useState<CreateSemesterData>({
    name: "",
    type: SemesterType.FALL,
    year: new Date().getFullYear(),
    status: SemesterStatus.UPCOMING,
    startDate: new Date(),
    endDate: new Date(),
    collegeId: collegeId,
    gpa: undefined,
    targetGPA: undefined,
  });

  useEffect(() => {
    if (editingSemester) {
      setFormData({
        name: editingSemester.name,
        type: editingSemester.type,
        year: editingSemester.year,
        status: editingSemester.status,
        startDate: editingSemester.startDate,
        endDate: editingSemester.endDate,
        collegeId: editingSemester.collegeId,
        gpa: editingSemester.gpa,
        targetGPA: editingSemester.targetGPA,
      });
    } else {
      resetForm();
    }
  }, [editingSemester, collegeId]);

  const resetForm = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Auto-suggest semester type based on current month
    let suggestedType = SemesterType.FALL;
    if (currentMonth >= 0 && currentMonth <= 4) {
      suggestedType = SemesterType.SPRING;
    } else if (currentMonth >= 5 && currentMonth <= 7) {
      suggestedType = SemesterType.SUMMER;
    }

    setFormData({
      name: "",
      type: suggestedType,
      year: currentYear,
      status: SemesterStatus.UPCOMING,
      startDate: new Date(),
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
      collegeId: collegeId,
      gpa: undefined,
      targetGPA: undefined,
    });
  };

  const handleInputChange = (
    field: keyof CreateSemesterData,
    value: string | number | Date | SemesterType | SemesterStatus,
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
    if (!editingSemester) {
      resetForm();
    }
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="lg">
      <ModalHeader>
        {editingSemester ? "Edit Semester" : "Add New Semester"}
      </ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <div>
            <Label htmlFor="semesterName">
              Semester Name <abbr className="text-red-600">*</abbr>
            </Label>
            <TextInput
              id="semesterName"
              placeholder="e.g., Fall 2024"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="semesterType">Semester Type</Label>
              <Select
                id="semesterType"
                value={formData.type}
                onChange={(e) =>
                  handleInputChange("type", e.target.value as SemesterType)
                }
                disabled={isLoading}
              >
                {semesterTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <TextInput
                id="year"
                type="number"
                min="2000"
                max="2100"
                value={formData.year}
                onChange={(e) =>
                  handleInputChange("year", parseInt(e.target.value))
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) =>
                handleInputChange("status", e.target.value as SemesterStatus)
              }
              disabled={isLoading}
            >
              {semesterStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <TextInput
                id="startDate"
                type="date"
                value={
                  formData.startDate instanceof Date
                    ? formData.startDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("startDate", new Date(e.target.value))
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <TextInput
                id="endDate"
                type="date"
                value={
                  formData.endDate instanceof Date
                    ? formData.endDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("endDate", new Date(e.target.value))
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="gpa">Current GPA</Label>
              <TextInput
                id="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="e.g., 3.75"
                value={formData.gpa || ""}
                onChange={(e) =>
                  handleInputChange(
                    "gpa",
                    e.target.value ? parseFloat(e.target.value) : "",
                  )
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="targetGPA">Target GPA</Label>
              <TextInput
                id="targetGPA"
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="e.g., 3.8"
                value={formData.targetGPA || ""}
                onChange={(e) =>
                  handleInputChange(
                    "targetGPA",
                    e.target.value ? parseFloat(e.target.value) : "",
                  )
                }
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !formData.name.trim()}
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
          ) : editingSemester ? (
            "Update Semester"
          ) : (
            "Create Semester"
          )}
        </Button>
        <Button color="gray" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
