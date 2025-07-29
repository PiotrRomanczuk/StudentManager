import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Profile } from "./types";
import { SORTABLE_FIELDS } from "./constants";
import { SortableHeader } from "./SortableHeader";
import { StudentRow } from "./StudentRow";

interface StudentsTableProps {
  data: Profile[];
  sortField: string;
  sortDir: string;
  onEditUser?: (user: Profile) => void;
  onToggleActive?: (user: Profile) => void;
}

export function StudentsTable({ data, sortField, sortDir, onEditUser, onToggleActive }: StudentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {SORTABLE_FIELDS.map((field) => (
            <SortableHeader
              key={field.key}
              field={field}
              currentSortField={sortField}
              currentSortDir={sortDir}
            />
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <StudentRow 
            key={user.id} 
            user={user} 
            onEdit={onEditUser}
            onToggleActive={onToggleActive}
          />
        ))}
      </TableBody>
    </Table>
  );
} 