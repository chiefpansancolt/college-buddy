import SemesterDetailPage from "./SemesterDetailPage";

interface SemesterPageProps {
	params: Promise<{ id: string; semesterId: string }>;
}

export default async function SemesterPage({ params }: SemesterPageProps) {
	const { id, semesterId } = await params;
	return <SemesterDetailPage collegeId={id} semesterId={semesterId} />;
}
