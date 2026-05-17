import { FormEvent, useEffect, useState } from "react";
import {
  Lead,
  LeadFormValues,
  leadSources,
  leadStatuses,
  LeadSource,
  LeadStatus,
} from "../types";
import Button from "./Button";
import Card from "./Card";
import Input from "./Input";
import StatusMessage from "./StatusMessage";

interface LeadFormProps {
  isOpen: boolean;
  initialLead?: Lead | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => Promise<void>;
}

const defaultFormValues: LeadFormValues = {
  name: "",
  email: "",
  status: "New",
  source: "Website",
};

const LeadForm = ({
  isOpen,
  initialLead,
  isSubmitting,
  onClose,
  onSubmit,
}: LeadFormProps) => {
  const [formValues, setFormValues] = useState<LeadFormValues>(defaultFormValues);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialLead) {
      setFormValues({
        name: initialLead.name,
        email: initialLead.email,
        status: initialLead.status,
        source: initialLead.source,
      });
      return;
    }

    setFormValues(defaultFormValues);
    setError("");
  }, [initialLead, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!formValues.name.trim() || !formValues.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      await onSubmit({
        ...formValues,
        name: formValues.name.trim(),
        email: formValues.email.trim(),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save lead.");
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              {initialLead ? "Update Lead" : "Create Lead"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-text-primary">
              {initialLead ? "Edit lead details" : "Add a new lead"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Keep the pipeline accurate with quick, structured updates.
            </p>
          </div>

          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Close
          </Button>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input
            label="Lead Name"
            type="text"
            value={formValues.name}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Enter full name"
          />

          <Input
            label="Lead Email"
            type="email"
            value={formValues.email}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="lead@example.com"
          />

          <Input
            as="select"
            label="Status"
            value={formValues.status}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                status: event.target.value as LeadStatus,
              }))
            }
          >
            {leadStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Input>

          <Input
            as="select"
            label="Source"
            value={formValues.source}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                source: event.target.value as LeadSource,
              }))
            }
          >
            {leadSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </Input>

          {error ? <StatusMessage className="md:col-span-2" tone="error">{error}</StatusMessage> : null}

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Saving..." : initialLead ? "Update Lead" : "Create Lead"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LeadForm;
