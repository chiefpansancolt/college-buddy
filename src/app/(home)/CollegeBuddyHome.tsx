"use client";

import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Select,
  DarkThemeToggle,
  Badge,
  Spinner,
} from "flowbite-react";
import { useState, useEffect } from "react";
import {
  HiPlus,
  HiAcademicCap,
  HiBookOpen,
  HiClipboardList,
  HiCalendar,
  HiTrendingUp,
  HiUsers,
  HiLocationMarker,
  HiGlobeAlt,
} from "react-icons/hi";
import { College, CreateCollegeData } from "@/types/app/app";
import { getColleges, createCollege } from "@/lib/storage";
import { successToast, errorToast } from "@/lib/notifications";

export default function CollegeBuddyHome() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCollegeData>({
    name: "",
    abbreviation: "",
    website: "",
    location: "",
    overallGPA: undefined,
  });

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      const collegeData = await getColleges();
      setColleges(collegeData);
    } catch (error) {
      console.error("Error loading colleges:", error);
    }
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

  const handleCreateCollege = async () => {
    if (!formData.name.trim()) {
      errorToast({ message: "College name is required" });
      return;
    }

    setIsLoading(true);
    try {
      const newCollege = await createCollege(formData);
      setColleges((prev) => [...prev, newCollege]);
      setShowCreateModal(false);
      setFormData({
        name: "",
        abbreviation: "",
        website: "",
        location: "",
        overallGPA: undefined,
      });
      successToast({
        message: `${newCollege.name} has been created successfully!`,
      });
    } catch (error) {
      console.error("Error creating college:", error);
      errorToast({ message: "Failed to create college. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const featuresData = [
    {
      title: "Semester Management",
      description:
        "Organize your academic journey by semesters with start/end dates and GPA tracking",
      icon: <HiCalendar className="h-8 w-8" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Class Tracking",
      description:
        "Keep track of all your classes, instructors, schedules, and course materials",
      icon: <HiBookOpen className="h-8 w-8" />,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Assignment Management",
      description:
        "Never miss a deadline with comprehensive assignment tracking and reminders",
      icon: <HiClipboardList className="h-8 w-8" />,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "GPA Monitoring",
      description:
        "Track your academic performance with automatic GPA calculations",
      icon: <HiTrendingUp className="h-8 w-8" />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
  ];

  const statsData = [
    {
      label: "Total Colleges",
      value: colleges.length,
      icon: <HiAcademicCap className="h-6 w-6" />,
    },
    {
      label: "Total Semesters",
      value: colleges.reduce(
        (total, college) => total + college.semesters.length,
        0,
      ),
      icon: <HiCalendar className="h-6 w-6" />,
    },
    {
      label: "Total Classes",
      value: colleges.reduce(
        (total, college) =>
          total +
          college.semesters.reduce(
            (semTotal, semester) => semTotal + semester.classes.length,
            0,
          ),
        0,
      ),
      icon: <HiBookOpen className="h-6 w-6" />,
    },
    {
      label: "Total Credits",
      value: colleges.reduce(
        (total, college) => total + college.totalCredits,
        0,
      ),
      icon: <HiTrendingUp className="h-6 w-6" />,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-lg bg-blue-600 p-2">
                <HiAcademicCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  College Buddy
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your academic companion for success
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DarkThemeToggle />
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <HiPlus className="mr-2 h-4 w-4" />
                Add College
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Welcome to Your Academic Dashboard
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
            Track your college journey, manage assignments, monitor your GPA,
            and stay organized throughout your academic career. Start by adding
            your college below.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <Card key={index} className="text-center">
              <div className="flex flex-col items-center">
                <div className="mb-2 text-blue-600 dark:text-blue-400">
                  {stat.icon}
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h3 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Everything You Need to Succeed
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {featuresData.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`rounded-lg p-3 ${feature.bgColor}`}>
                    <div className={feature.color}>{feature.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Colleges Section */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Colleges
            </h3>
            {colleges.length > 0 && (
              <Button
                onClick={() => setShowCreateModal(true)}
                size="sm"
                outline
              >
                <HiPlus className="mr-2 h-4 w-4" />
                Add Another
              </Button>
            )}
          </div>

          {colleges.length === 0 ? (
            <Card className="py-12 text-center">
              <div className="flex flex-col items-center">
                <HiAcademicCap className="mb-4 h-16 w-16 text-gray-400" />
                <h4 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  No Colleges Added Yet
                </h4>
                <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
                  Get started by adding your college or university. This will be
                  your central hub for tracking semesters, classes, and
                  assignments.
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <HiPlus className="mr-2 h-4 w-4" />
                  Add Your First College
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {colleges.map((college) => (
                <Card
                  key={college.id}
                  className="transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {college.name}
                      </h5>
                      {college.abbreviation && (
                        <Badge color="blue" size="sm">
                          {college.abbreviation}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {college.location && (
                      <div className="flex items-center">
                        <HiLocationMarker className="mr-2 h-4 w-4" />
                        {college.location}
                      </div>
                    )}
                    {college.website && (
                      <div className="flex items-center">
                        <HiGlobeAlt className="mr-2 h-4 w-4" />
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <span>{college.semesters.length} Semesters</span>
                      <span>{college.totalCredits} Credits</span>
                    </div>
                    {college.overallGPA && (
                      <div className="flex items-center justify-between">
                        <span>Overall GPA:</span>
                        <Badge color="green">
                          {college.overallGPA.toFixed(2)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create College Modal */}
      <Modal
        show={showCreateModal}
        onClose={() => !isLoading && setShowCreateModal(false)}
        size="lg"
      >
        <ModalHeader>Add New College</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <Label htmlFor="collegeName">
                College Name <abbr className="color-red-600">*</abbr>
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
            onClick={handleCreateCollege}
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
            ) : (
              <>Create College</>
            )}
          </Button>
          <Button
            color="gray"
            onClick={() => setShowCreateModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </main>
  );
}
