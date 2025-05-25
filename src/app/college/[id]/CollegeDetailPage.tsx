"use client";

import { SemesterFormModal } from "@/components/modals";
import { Badge, Breadcrumb, BreadcrumbItem, Button, Card, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	HiAcademicCap,
	HiBookOpen,
	HiCalendar,
	HiChevronLeft,
	HiClipboardList,
	HiGlobeAlt,
	HiLocationMarker,
	HiPencil,
	HiPlus,
	HiTrash,
	HiTrendingUp,
	HiX,
} from "react-icons/hi";
import { College, CreateSemesterData, Semester, SemesterStatus } from "@/types/app/app";
import { errorToast, successToast } from "@/lib/notifications";
import { createSemester, deleteSemester, getCollegeById, updateSemester } from "@/lib/storage";

interface CollegeDetailPageProps {
	collegeId: string;
}

export default function CollegeDetailPage({ collegeId }: CollegeDetailPageProps) {
	const router = useRouter();
	const [college, setCollege] = useState<College | null>(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);

	useEffect(() => {
		loadCollege();
	}, [collegeId]);

	const loadCollege = async () => {
		try {
			setPageLoading(true);
			const collegeData = await getCollegeById(collegeId);
			if (!collegeData) {
				errorToast({ message: "College not found" });
				router.push("/");
				return;
			}
			setCollege(collegeData);
		} catch (error) {
			console.error("Error loading college:", error);
			errorToast({ message: "Failed to load college data" });
		} finally {
			setPageLoading(false);
		}
	};

	const handleCreateSemester = async (formData: CreateSemesterData) => {
		if (!formData.name.trim()) {
			errorToast({ message: "Semester name is required" });
			return;
		}

		if (formData.startDate >= formData.endDate) {
			errorToast({ message: "End date must be after start date" });
			return;
		}

		setIsLoading(true);
		try {
			const newSemester = await createSemester(collegeId, formData);
			await loadCollege();
			setShowCreateModal(false);
			successToast({
				message: `${newSemester.name} has been created successfully!`,
			});
		} catch (error) {
			console.error("Error creating semester:", error);
			errorToast({ message: "Failed to create semester. Please try again." });
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditSemester = (semester: Semester) => {
		setEditingSemester(semester);
		setShowEditModal(true);
	};

	const handleUpdateSemester = async (formData: CreateSemesterData) => {
		if (!editingSemester) return;

		if (!formData.name.trim()) {
			errorToast({ message: "Semester name is required" });
			return;
		}

		if (formData.startDate >= formData.endDate) {
			errorToast({ message: "End date must be after start date" });
			return;
		}

		setIsLoading(true);
		try {
			const success = await updateSemester(collegeId, editingSemester.id, formData);
			if (success) {
				await loadCollege();
				setShowEditModal(false);
				setEditingSemester(null);
				successToast({
					message: `${formData.name} has been updated successfully!`,
				});
			} else {
				errorToast({ message: "Semester not found" });
			}
		} catch (error) {
			console.error("Error updating semester:", error);
			errorToast({ message: "Failed to update semester. Please try again." });
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteSemester = async (semester: Semester) => {
		if (
			!confirm(
				`Are you sure you want to delete "${semester.name}"? This will also delete all classes and assignments in this semester.`
			)
		) {
			return;
		}

		try {
			await deleteSemester(collegeId, semester.id);
			await loadCollege();
			successToast({
				message: `${semester.name} has been deleted successfully!`,
			});
		} catch (error) {
			console.error("Error deleting semester:", error);
			errorToast({ message: "Failed to delete semester. Please try again." });
		}
	};

	const getStatusBadgeColor = (status: SemesterStatus) => {
		switch (status) {
			case SemesterStatus.CURRENT:
				return "success";
			case SemesterStatus.UPCOMING:
				return "info";
			case SemesterStatus.COMPLETED:
				return "gray";
			default:
				return "gray";
		}
	};

	const closeCreateModal = () => {
		if (isLoading) return;
		setShowCreateModal(false);
	};

	const closeEditModal = () => {
		if (isLoading) return;
		setShowEditModal(false);
		setEditingSemester(null);
	};

	if (pageLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size="xl" />
			</div>
		);
	}

	if (!college) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Card className="w-full max-w-md p-6 text-center">
					<HiX className="mx-auto mb-4 h-16 w-16 text-red-500" />
					<h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
						College Not Found
					</h2>
					<p className="mb-4 text-gray-600 dark:text-gray-400">
						The college you're looking for doesn't exist.
					</p>
					<Button onClick={() => router.push("/")} color="blue">
						<HiChevronLeft className="mr-2 h-4 w-4" />
						Back to Home
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
							<BreadcrumbItem>{college.name}</BreadcrumbItem>
						</Breadcrumb>

						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<div className="rounded-lg bg-blue-600 p-2">
									<HiAcademicCap className="h-8 w-8 text-white" />
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
										{college.name}
									</h1>
									<div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
										{college.abbreviation && (
											<Badge color="blue" size="sm">
												{college.abbreviation}
											</Badge>
										)}
										{college.location && (
											<div className="flex items-center">
												<HiLocationMarker className="mr-1 h-4 w-4" />
												{college.location}
											</div>
										)}
										{college.website && (
											<div className="flex items-center">
												<HiGlobeAlt className="mr-1 h-4 w-4" />
												<a
													href={college.website}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
												>
													Website
												</a>
											</div>
										)}
									</div>
								</div>
							</div>
							<Button
								onClick={() => setShowCreateModal(true)}
								className="bg-blue-600 hover:bg-blue-700"
							>
								<HiPlus className="mr-2 h-4 w-4" />
								Add Semester
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
					<Card className="text-center">
						<div className="flex flex-col items-center">
							<div className="mb-2 text-blue-600 dark:text-blue-400">
								<HiCalendar className="h-6 w-6" />
							</div>
							<div className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
								{college.semesters.length}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Semesters
							</div>
						</div>
					</Card>

					<Card className="text-center">
						<div className="flex flex-col items-center">
							<div className="mb-2 text-green-600 dark:text-green-400">
								<HiBookOpen className="h-6 w-6" />
							</div>
							<div className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
								{college.semesters.reduce(
									(total, semester) => total + semester.classes.length,
									0
								)}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">Classes</div>
						</div>
					</Card>

					<Card className="text-center">
						<div className="flex flex-col items-center">
							<div className="mb-2 text-purple-600 dark:text-purple-400">
								<HiClipboardList className="h-6 w-6" />
							</div>
							<div className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
								{college.semesters.reduce(
									(total, semester) =>
										total +
										semester.classes.reduce(
											(classTotal, cls) =>
												classTotal + cls.assignments.length,
											0
										),
									0
								)}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Assignments
							</div>
						</div>
					</Card>

					<Card className="text-center">
						<div className="flex flex-col items-center">
							<div className="mb-2 text-yellow-600 dark:text-yellow-400">
								<HiTrendingUp className="h-6 w-6" />
							</div>
							<div className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
								{college.totalCredits}
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Total Credits
							</div>
						</div>
					</Card>
				</div>

				<div>
					<div className="mb-6 flex items-center justify-between">
						<h3 className="text-2xl font-bold text-gray-900 dark:text-white">
							Semesters
						</h3>
						{college.semesters.length > 0 && (
							<Button onClick={() => setShowCreateModal(true)} size="sm" outline>
								<HiPlus className="mr-2 h-4 w-4" />
								Add Another
							</Button>
						)}
					</div>

					{college.semesters.length === 0 ? (
						<Card className="py-12 text-center">
							<div className="flex flex-col items-center">
								<HiCalendar className="mb-4 h-16 w-16 text-gray-400" />
								<h4 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
									No Semesters Added Yet
								</h4>
								<p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
									Start organizing your academic journey by adding your first
									semester. You can track classes, assignments, and your GPA for
									each semester.
								</p>
								<Button
									onClick={() => setShowCreateModal(true)}
									className="bg-blue-600 hover:bg-blue-700"
								>
									<HiPlus className="mr-2 h-4 w-4" />
									Add Your First Semester
								</Button>
							</div>
						</Card>
					) : (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{college.semesters
								.sort((a, b) => {
									if (a.year !== b.year) return b.year - a.year;
									const typeOrder = {
										spring: 1,
										summer: 2,
										fall: 3,
										winter: 4,
									};
									return typeOrder[b.type] - typeOrder[a.type];
								})
								.map((semester) => (
									<Card
										key={semester.id}
										className="transition-shadow hover:shadow-lg"
									>
										<div className="mb-4 flex items-start justify-between">
											<div className="flex-1">
												<h5 className="text-lg font-semibold text-gray-900 dark:text-white">
													{semester.name}
												</h5>
												<div className="mt-1 flex items-center space-x-2">
													<Badge
														color={getStatusBadgeColor(semester.status)}
														size="sm"
													>
														{semester.status.replace("_", " ")}
													</Badge>
													<span className="text-sm text-gray-500">
														{semester.type} {semester.year}
													</span>
												</div>
											</div>
											<div className="flex space-x-1">
												<Button
													size="xs"
													color="gray"
													onClick={() => handleEditSemester(semester)}
												>
													<HiPencil className="h-3 w-3" />
												</Button>
												<Button
													size="xs"
													color="red"
													onClick={() => handleDeleteSemester(semester)}
												>
													<HiTrash className="h-3 w-3" />
												</Button>
											</div>
										</div>

										<div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
											<div className="flex justify-between">
												<span>Duration:</span>
												<span>
													{new Date(
														semester.startDate
													).toLocaleDateString()}{" "}
													-{" "}
													{new Date(
														semester.endDate
													).toLocaleDateString()}
												</span>
											</div>
											<div className="flex justify-between">
												<span>Classes:</span>
												<span>{semester.classes.length}</span>
											</div>
											<div className="flex justify-between">
												<span>Credits:</span>
												<span>{semester.totalCredits}</span>
											</div>
											{semester.gpa && (
												<div className="flex justify-between">
													<span>GPA:</span>
													<Badge color="green">
														{semester.gpa.toFixed(2)}
													</Badge>
												</div>
											)}
											{semester.targetGPA && (
												<div className="flex justify-between">
													<span>Target GPA:</span>
													<Badge color="blue">
														{semester.targetGPA.toFixed(2)}
													</Badge>
												</div>
											)}
										</div>

										<div className="mt-4">
											<Button
												size="sm"
												outline
												className="w-full"
												onClick={() =>
													router.push(
														`/college/${collegeId}/semester/${semester.id}`
													)
												}
											>
												View Classes & Assignments
											</Button>
										</div>
									</Card>
								))}
						</div>
					)}
				</div>
			</div>

			<SemesterFormModal
				isOpen={showCreateModal}
				onClose={closeCreateModal}
				onSubmit={handleCreateSemester}
				collegeId={collegeId}
				isLoading={isLoading}
			/>

			<SemesterFormModal
				isOpen={showEditModal}
				onClose={closeEditModal}
				onSubmit={handleUpdateSemester}
				editingSemester={editingSemester}
				collegeId={collegeId}
				isLoading={isLoading}
			/>
		</main>
	);
}
