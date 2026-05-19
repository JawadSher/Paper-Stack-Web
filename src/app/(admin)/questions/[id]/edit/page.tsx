import { notFound } from "next/navigation";
import { QuestionForm } from "@/components/admin/questions/QuestionForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { adminQuestions } from "@/constants/admin-questions";

export type EditQuestionPageProps = { params: Promise<{ id: string }> };

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id } = await params;
  const question = adminQuestions.find((item) => item.id === id);
  if (!question) notFound();
  return <div className="space-y-6"><PageHeader title="Edit question" subtitle={question.prompt} breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Questions", href: "/questions" }, { label: "Edit", href: `/questions/${id}/edit` }]} /><QuestionForm mode="edit" initialQuestion={question} /></div>;
}
