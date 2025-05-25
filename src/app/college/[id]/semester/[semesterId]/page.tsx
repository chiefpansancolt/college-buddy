import { Card, Button, Breadcrumb, BreadcrumbItem } from "flowbite-react";
import { HiAcademicCap, HiCalendar, HiArrowLeft } from "react-icons/hi";
import Link from "next/link";

interface SemesterPageProps {
  params: Promise<{ id: string; semesterId: string }>;
}

export default async function SemesterPage({ params }: SemesterPageProps) {
  const { id, semesterId } = await params;

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
              <BreadcrumbItem href={`/college/${id}`}>College</BreadcrumbItem>
              <BreadcrumbItem>Semester</BreadcrumbItem>
            </Breadcrumb>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg bg-blue-600 p-2">
                  <HiCalendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Semester Details
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Classes and assignments management
                  </p>
                </div>
              </div>
              <Link href={`/college/${id}`}>
                <Button color="gray">
                  <HiArrowLeft className="mr-2 h-4 w-4" />
                  Back to College
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="py-12 text-center">
          <div className="flex flex-col items-center">
            <HiCalendar className="mb-4 h-16 w-16 text-gray-400" />
            <h4 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Semester Detail Page Coming Soon
            </h4>
            <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
              This page will allow you to manage classes and assignments for
              this semester.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              College ID: {id}
              <br />
              Semester ID: {semesterId}
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
