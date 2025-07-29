import Link from "next/link";
import { TableHead } from "@/components/ui/table";
import { SortableField } from "./types";
import { getNextSort } from "./constants";

interface SortableHeaderProps {
  field: SortableField;
  currentSortField: string;
  currentSortDir: string;
}

export function SortableHeader({ field, currentSortField, currentSortDir }: SortableHeaderProps) {
  const sortIndicator = () => {
    if (currentSortField !== field.key) return null;
    return currentSortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <TableHead>
      <Link
        href={`?sort=${field.key}&dir=${getNextSort(currentSortField, currentSortDir, field.key)}`}
        className="hover:underline cursor-pointer flex items-center gap-1"
      >
        {field.label}
        <span>{sortIndicator()}</span>
      </Link>
    </TableHead>
  );
} 