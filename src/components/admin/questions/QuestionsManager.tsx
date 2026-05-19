"use client";

import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionsTable } from "@/components/admin/questions/QuestionsTable";
import { adminQuestions } from "@/constants/admin-questions";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";

export function QuestionsManager() {
  const [subjectId, setSubjectId] = useState("all");
  const [boardId, setBoardId] = useState("all");
  const [classLevel, setClassLevel] = useState("all");
  const [frequency, setFrequency] = useState("2");
  const filtered = useMemo(() => adminQuestions.filter((q) => (subjectId === "all" || q.subjectId === subjectId) && (boardId === "all" || q.boardIds.includes(boardId)) && (classLevel === "all" || q.classLevel === Number(classLevel)) && q.yearsAppeared.length >= Number(frequency)), [boardId, classLevel, frequency, subjectId]);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4">
        <Select value={subjectId} onValueChange={(v) => setSubjectId(v ?? "all")}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All subjects</SelectItem>{subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} {s.classLevel}</SelectItem>)}</SelectContent></Select>
        <Select value={boardId} onValueChange={(v) => setBoardId(v ?? "all")}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All boards</SelectItem>{boards.map((b) => <SelectItem key={b.id} value={b.id}>{b.shortName}</SelectItem>)}</SelectContent></Select>
        <Select value={classLevel} onValueChange={(v) => setClassLevel(v ?? "all")}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All classes</SelectItem>{[9,10,11,12].map((c) => <SelectItem key={c} value={String(c)}>Class {c}</SelectItem>)}</SelectContent></Select>
        <Select value={frequency} onValueChange={(v) => setFrequency(v ?? "2")}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{[2,3,4,5].map((f) => <SelectItem key={f} value={String(f)}>{f === 5 ? "5/5" : `${f}+`}</SelectItem>)}</SelectContent></Select>
      </div>
      <QuestionsTable questions={filtered} />
    </div>
  );
}
