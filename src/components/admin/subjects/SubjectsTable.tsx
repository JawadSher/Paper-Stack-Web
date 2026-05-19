"use client";

import Link from "next/link";
import { GripVertical, Save, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubjectIcon } from "@/components/shared/SubjectIcon";
import { boards } from "@/constants/boards";
import { mockPapers } from "@/constants/papers";
import type { AdminSubject } from "@/constants/admin-subjects";

export type SubjectsTableProps = {
  subjects: AdminSubject[];
};

export function SubjectsTable({ subjects }: SubjectsTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => toast.success("Subject order saved")}>
          <Save className="size-4" />
          Save order
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Subject name</TableHead>
              <TableHead>Icon preview</TableHead>
              <TableHead>Classes</TableHead>
              <TableHead>Board count</TableHead>
              <TableHead>Paper count</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell><GripVertical className="size-4 text-muted-foreground" /></TableCell>
                <TableCell className="font-medium">
                  {subject.name}
                  {subject.isCompulsory ? <Badge variant="secondary" className="ml-2">Core</Badge> : null}
                </TableCell>
                <TableCell><SubjectIcon subjectName={subject.name} /></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {subject.classes.map((classLevel) => <Badge key={classLevel} variant="outline">{classLevel}</Badge>)}
                  </div>
                </TableCell>
                <TableCell>{boards.length}</TableCell>
                <TableCell>{mockPapers.filter((paper) => paper.subjectId.includes(subject.name.toLowerCase().split(" ").join("-"))).length}</TableCell>
                <TableCell><Input type="number" defaultValue={subject.displayOrder} className="w-20" /></TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button type="button" size="icon-sm" variant="ghost">
                      <Link href={`/subjects/${subject.id}/edit`}><Edit className="size-4" /></Link>
                    </Button>
                    <Button type="button" size="icon-sm" variant="ghost" onClick={() => toast.success("Subject delete queued")}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
