"use client";

import { useMemo, useState } from "react";
import { Download, Grid2X2, List, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDetailPanel } from "@/components/admin/media/FileDetailPanel";
import { MediaGrid } from "@/components/admin/media/MediaGrid";
import { MediaListItem } from "@/components/admin/media/MediaListItem";
import { StorageUsageBar } from "@/components/admin/media/StorageUsageBar";
import { mediaFiles, type MediaFile } from "@/constants/admin-media";

type Sort = "newest" | "oldest" | "largest" | "smallest";
type Filter = "all" | "pdf" | "image";

export function MediaBrowser() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<Sort>("newest");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<MediaFile | null>(null);

  const files = useMemo(() => {
    return mediaFiles
      .filter((file) => filter === "all" || file.type === filter)
      .sort((a, b) => {
        if (sort === "oldest") return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        if (sort === "largest") return b.sizeBytes - a.sizeBytes;
        if (sort === "smallest") return a.sizeBytes - b.sizeBytes;
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      });
  }, [filter, sort]);

  const toggle = (id: string) => setSelected((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <StorageUsageBar />
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant={view === "grid" ? "default" : "outline"} onClick={() => setView("grid")}><Grid2X2 className="size-4" />Grid</Button>
          <Button type="button" size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}><List className="size-4" />List</Button>
          <Select value={sort} onValueChange={(value) => setSort((value ?? "newest") as Sort)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest</SelectItem><SelectItem value="oldest">Oldest</SelectItem><SelectItem value="largest">Largest</SelectItem><SelectItem value="smallest">Smallest</SelectItem></SelectContent></Select>
          <Select value={filter} onValueChange={(value) => setFilter((value ?? "all") as Filter)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pdf">PDF</SelectItem><SelectItem value="image">Images</SelectItem></SelectContent></Select>
        </div>
      </div>
      {selected.length ? <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3"><p className="mr-auto text-sm font-medium">{selected.length} files selected</p><Button size="sm" variant="destructive"><Trash2 className="size-4" />Delete selected</Button><Button size="sm" variant="outline"><Download className="size-4" />Download selected</Button></div> : null}
      {view === "grid" ? (
        <MediaGrid files={files} selected={selected} onToggle={toggle} onOpen={setActiveFile} />
      ) : (
        <div className="rounded-lg border bg-card"><Table><TableHeader><TableRow><TableHead className="w-10" /><TableHead>Filename</TableHead><TableHead>Size</TableHead><TableHead>Board</TableHead><TableHead>Subject</TableHead><TableHead>Year</TableHead><TableHead>Uploaded</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{files.map((file) => <MediaListItem key={file.id} file={file} selected={selected.includes(file.id)} onToggle={() => toggle(file.id)} onOpen={() => setActiveFile(file)} />)}</TableBody></Table></div>
      )}
      <FileDetailPanel file={activeFile} onOpenChange={(open) => !open && setActiveFile(null)} />
    </div>
  );
}
