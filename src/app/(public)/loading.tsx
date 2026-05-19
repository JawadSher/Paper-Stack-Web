import { SkeletonCard } from "@/components/shared/SkeletonCard";

export default function PublicLoading() {
  return <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>;
}
