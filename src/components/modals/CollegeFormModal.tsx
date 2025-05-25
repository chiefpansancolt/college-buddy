"use client";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  TextInput,
  Spinner,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { CreateCollegeData, College } from "@/types/app/app";

interface CollegeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCollegeData) => Promise<void>;
  editingCollege?: College | null;
  isLoading?: boolean;
}

export default function CollegeFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingCollege,
  isLoading = false,
}: CollegeFormModalProps) {
  const [formData, setFormData] = useState<CreateCollegeData>({
    name: "",
    abbreviation: "",
    website: "",
    location: "",
    overallGPA: undefined,
  });

  useEffect(() => {
    if (editingCollege) {
      setFormData({
        name: editingCollege.name,
        abbreviation: editingCollege.abbreviation || "",
        website: editingCollege.website || "",
        location: editingCollege.location || "",
        overallGPA: editingCollege.overallGPA,
      });
    } else {
      resetForm();
    }
  }, [editingCollege]);

  const resetForm = () => {
    setFormData({
      name: "",
      abbreviation: "",
      website: "",
      location: "",
      overallGPA: undefined,
    });
  };

  const handleInputChange = (
    field: keyof CreateCollegeData,
    value: string | number,
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
    if (!editingCollege) {
      resetForm();
    }
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="lg">
      <ModalHeader>
        {editingCollege ? "Edit College" : "Add New College"}
      </ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <div>
            <Label htmlFor="collegeName">
              College Name <abbr className="text-red-600">*</abbr>
            </Label>
            <TextInput
              id="collegeName"
              placeholder="e.g., University of Example"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="abbreviation">Abbreviation</Label>
            <TextInput
              id="abbreviation"
              placeholder="e.g., UOE"
              value={formData.abbreviation}
              onChange={(e) =>
                handleInputChange("abbreviation", e.target.value)
              }
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <TextInput
              id="location"
              placeholder="e.g., Example City, State"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <TextInput
              id="website"
              type="url"
              placeholder="e.g., https://www.example.edu"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="gpa">Current Overall GPA</Label>
            <TextInput
              id="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              placeholder="e.g., 3.75"
              value={formData.overallGPA || ""}
              onChange={(e) =>
                handleInputChange(
                  "overallGPA",
                  e.target.value ? parseFloat(e.target.value) : "",
                )
              }
              disabled={isLoading}
            />
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
          ) : editingCollege ? (
            "Update College"
          ) : (
            "Create College"
          )}
        </Button>
        <Button color="gray" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
