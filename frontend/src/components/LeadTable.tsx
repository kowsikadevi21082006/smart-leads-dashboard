import { Lead } from "../types";
import Badge, { getSourceTone, getStatusTone } from "./Badge";
import Button from "./Button";
import Card from "./Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  isBusy?: boolean;
  busyLeadId?: string | null;
}

const LeadTable = ({
  leads,
  onEdit,
  onDelete,
  isBusy = false,
  busyLeadId = null,
}: LeadTableProps) => {
  if (!leads.length) {
    return (
      <Card className="border-dashed py-10 text-center" hoverable>
        <h3 className="text-xl font-semibold text-text-primary">No leads found</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Try changing your filters or create a new lead to get started.
        </p>
      </Card>
    );
  }

  return (
    <Table className="border-separate border-spacing-y-2">
      <TableHead>
        <tr>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Source</TableHeader>
          <TableHeader>Created</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </tr>
      </TableHead>
      <TableBody>
        {leads.map((lead) => (
          <TableRow
            key={lead._id}
            className="rounded-xl border border-transparent bg-[#151515] hover:border-accent/25 hover:bg-[#1B1B1B]"
          >
            <TableCell className="rounded-l-xl">
              <p className="font-semibold text-text-primary">{lead.name}</p>
            </TableCell>
            <TableCell>{lead.email}</TableCell>
            <TableCell>
              <Badge tone={getStatusTone(lead.status)}>{lead.status}</Badge>
            </TableCell>
            <TableCell>
              <Badge tone={getSourceTone(lead.source)}>{lead.source}</Badge>
            </TableCell>
            <TableCell>
              <span className="text-text-secondary">
                {new Date(lead.createdAt).toLocaleDateString()}
              </span>
            </TableCell>
            <TableCell className="w-[1%] whitespace-nowrap rounded-r-xl">
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onEdit(lead)}
                  disabled={isBusy}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(lead)}
                  loading={busyLeadId === lead._id}
                  disabled={isBusy && busyLeadId !== lead._id}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeadTable;
