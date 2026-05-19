import { QuestionForm } from "@/components/admin/questions/QuestionForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewQuestionPage() {
  return <div className="space-y-6"><PageHeader title="Add question" subtitle="Tag a repeated exam question" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Questions", href: "/questions" }, { label: "New", href: "/questions/new" }]} /><QuestionForm mode="create" /></div>;
}
