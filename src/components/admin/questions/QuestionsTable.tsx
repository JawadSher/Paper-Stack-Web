"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FrequencyBar } from "@/components/shared/FrequencyBar";
import { YearDots } from "@/components/shared/YearDots";
import { boards } from "@/constants/boards";
import { subjects } from "@/constants/subjects";
import type { AdminQuestion } from "@/constants/admin-questions";

export type QuestionsTableProps = {
  questions: AdminQuestion[];
};

export function QuestionsTable({ questions }: QuestionsTableProps) {
  const [expandedId, setExpandedId] = useState<string>();
  const [selected, setSelected] = useState<string[]>([]);
  const selectedQuestions = useMemo(() => questions.filter((q) => selected.includes(q.id)), [questions, selected]);

  function toggle(id: string) {
    setSelected((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  }

  function exportCsv() {
    const csv = selectedQuestions.map((q) => `"${q.prompt.replaceAll('"', '""')}",${q.chapter},${q.yearsAppeared.length}`).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "paperstack-questions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      {selected.length ? (
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium">{selected.length} questions selected</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="destructive" onClick={() => { toast.success("Questions delete queued"); setSelected([]); }}>
              <Trash2 className="size-4" /> Delete selected
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={exportCsv}>
              <Download className="size-4" /> Export CSV
            </Button>
          </div>
        </div>
      ) : null}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Question text</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Board</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Years appeared</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => {
              const subject = subjects.find((item) => item.id === question.subjectId);
              const firstBoard = boards.find((board) => board.id === question.boardIds[0]);
              return (
                <>
                  <TableRow key={question.id} className="cursor-pointer" onClick={() => setExpandedId(expandedId === question.id ? undefined : question.id)}>
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <input type="checkbox" className="size-4 accent-ps-coral" checked={selected.includes(question.id)} onChange={() => toggle(question.id)} />
                    </TableCell>
                    <TableCell>{question.prompt.length > 60 ? `${question.prompt.slice(0, 60)}...` : question.prompt}</TableCell>
                    <TableCell>{subject?.name ?? "Unknown"}</TableCell>
                    <TableCell>{firstBoard?.shortName ?? "Multiple"}</TableCell>
                    <TableCell>Class {question.classLevel}</TableCell>
                    <TableCell>{question.chapter}</TableCell>
                    <TableCell><YearDots yearsAppeared={question.yearsAppeared} /></TableCell>
                    <TableCell><FrequencyBar frequency={question.yearsAppeared.length} totalYears={6} showLabel={false} /></TableCell>
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <Button type="button" size="icon-sm" variant="ghost"><Link href={`/questions/${question.id}/edit`}><Edit className="size-4" /></Link></Button>
                        <Button type="button" size="icon-sm" variant="ghost" onClick={() => toast.success("Question delete queued")}><Trash2 className="size-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === question.id ? (
                    <TableRow key={`${question.id}-details`}>
                      <TableCell colSpan={9} className="bg-secondary/40">
                        <p className="font-medium">{question.prompt}</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Chapter ID: {question.chapterId} | Marks: {question.marks ?? "N/A"} | Section: {question.sectionType}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
