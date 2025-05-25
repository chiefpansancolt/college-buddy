import CollegeDetailPage from "./CollegeDetailPage";

interface CollegePageProps {
  params: Promise<{ id: string }>;
}

export default async function CollegePage({ params }: CollegePageProps) {
  const { id } = await params;
  return <CollegeDetailPage collegeId={id} />;
}
