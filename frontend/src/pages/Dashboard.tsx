import { useCallback, useEffect, useRef, useState } from "react";
import {
  createLeadRequest,
  deleteLeadRequest,
  getLeadsRequest,
  updateLeadRequest,
} from "../api/leads";
import Button from "../components/Button";
import Card from "../components/Card";
import FilterBar from "../components/FilterBar";
import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import StatusMessage from "../components/StatusMessage";
import { Lead, LeadFilters, LeadFormValues, LeadSource, LeadStatus } from "../types";

const initialFilters: LeadFilters = {
  page: 1,
  status: "",
  source: "",
  search: "",
};

const matchesFilters = (lead: Lead, activeFilters: LeadFilters) => {
  const searchTerm = activeFilters.search.trim().toLowerCase();
  const matchesSearch =
    !searchTerm ||
    lead.name.toLowerCase().includes(searchTerm) ||
    lead.email.toLowerCase().includes(searchTerm);

  const matchesStatus = !activeFilters.status || lead.status === activeFilters.status;
  const matchesSource = !activeFilters.source || lead.source === activeFilters.source;

  return matchesSearch && matchesStatus && matchesSource;
};

const getTotalPages = (total: number, pageSize: number) =>
  Math.max(Math.ceil(total / Math.max(pageSize, 1)), 1);

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);
  const [searchInput, setSearchInput] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const latestRequestRef = useRef(0);
  const messageTimeoutRef = useRef<number | null>(null);

  const clearMessages = useCallback(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);

    if (messageTimeoutRef.current) {
      window.clearTimeout(messageTimeoutRef.current);
    }

    messageTimeoutRef.current = window.setTimeout(() => {
      setSuccessMessage("");
    }, 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        window.clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextSearch = searchInput.trim();

      setFilters((current) => ({
        ...current,
        page: current.search === nextSearch ? current.page : 1,
        search: nextSearch,
      }));
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const fetchLeads = useCallback(async (activeFilters: LeadFilters, showLoader = true) => {
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    if (showLoader) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError("");

    try {
      const response = await getLeadsRequest(activeFilters);

      if (requestId !== latestRequestRef.current) {
        return;
      }

      setLeads(response.data);
      setTotalPages(Math.max(response.totalPages || 1, 1));
      setTotalRecords(response.total);
    } catch (fetchError) {
      if (requestId !== latestRequestRef.current) {
        return;
      }

      const message =
        fetchError instanceof Error ? fetchError.message : "Failed to fetch leads.";
      setError(message);
    } finally {
      if (requestId !== latestRequestRef.current) {
        return;
      }

      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeads(filters);
  }, [fetchLeads, filters]);

  const handleOpenCreate = () => {
    setSelectedLead(null);
    clearMessages();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setSelectedLead(lead);
    clearMessages();
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedLead(null);
  };

  const handleSubmitLead = async (values: LeadFormValues) => {
    setSubmitting(true);
    clearMessages();

    try {
      if (selectedLead) {
        const updatedLead = await updateLeadRequest(selectedLead._id, values);
        const shouldRemainVisible = matchesFilters(updatedLead, filters);

        setLeads((current) => {
          if (!shouldRemainVisible) {
            return current.filter((lead) => lead._id !== updatedLead._id);
          }

          return current.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead));
        });
        showSuccess("Lead updated successfully.");
      } else {
        const createdLead = await createLeadRequest(values);
        const shouldAppearOnCurrentPage = filters.page === 1 && matchesFilters(createdLead, filters);

        if (shouldAppearOnCurrentPage) {
          setLeads((current) => [createdLead, ...current]);
        }

        setTotalRecords((current) => {
          const nextTotal = current + 1;
          setTotalPages((existingPages) =>
            getTotalPages(nextTotal, shouldAppearOnCurrentPage ? Math.max(leads.length + 1, 1) : Math.max(leads.length, 1))
          );
          return nextTotal;
        });
        showSuccess("Lead created successfully.");

        if (!shouldAppearOnCurrentPage) {
          void fetchLeads(filters, false);
        }
      }

      handleCloseForm();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to save lead.";
      setError(message);
      throw submitError;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLead = async (lead: Lead) => {
    const confirmed = window.confirm(`Delete ${lead.name} from your leads list?`);

    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    setPendingDeleteId(lead._id);
    clearMessages();

    try {
      await deleteLeadRequest(lead._id);

      const nextPage =
        leads.length === 1 && filters.page > 1 ? filters.page - 1 : filters.page;

      setLeads((current) => current.filter((item) => item._id !== lead._id));
      setTotalRecords((current) => {
        const nextTotal = Math.max(current - 1, 0);
        const nextPageSize = Math.max(leads.length - 1, 1);
        setTotalPages(getTotalPages(nextTotal, nextPageSize));
        return nextTotal;
      });
      showSuccess("Lead deleted successfully.");

      if (nextPage !== filters.page) {
        setFilters((current) => ({
          ...current,
          page: nextPage,
        }));
      }
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Failed to delete lead.";
      setError(message);
    } finally {
      setSubmitting(false);
      setPendingDeleteId(null);
    }
  };

  const handleStatusChange = (status: "" | LeadStatus) => {
    setSuccessMessage("");
    setFilters((current) =>
      current.status === status ? current : { ...current, status, page: 1 }
    );
  };

  const handleSourceChange = (source: "" | LeadSource) => {
    setSuccessMessage("");
    setFilters((current) =>
      current.source === source ? current : { ...current, source, page: 1 }
    );
  };

  const handleResetFilters = () => {
    setSuccessMessage("");
    setSearchInput("");
    setFilters(initialFilters);
  };

  const activeFilterCount = [filters.search, filters.status, filters.source].filter(Boolean).length;
  const qualifiedLeads = leads.filter((lead) => lead.status === "Qualified").length;
  const contactedLeads = leads.filter((lead) => lead.status === "Contacted").length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;

  return (
    <div className="app-shell">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-4">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_320px]">
          <Card
            className="bg-[radial-gradient(circle_at_top_left,rgba(212,255,0,0.12),transparent_22%),linear-gradient(180deg,#171717_0%,#111111_100%)]"
            hoverable
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                    Dashboard Overview
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-text-primary sm:text-2xl">
                    Keep the pipeline readable and ready for action.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Review lead volume, filter quickly, and update records without wasting
                    space or losing context.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {isRefreshing ? (
                    <span className="rounded-lg border border-accent/25 bg-[#171d00] px-3 py-2 text-sm font-medium text-accent">
                      Updating leads...
                    </span>
                  ) : null}
                  <Button size="md" onClick={handleOpenCreate} disabled={submitting}>
                    Add Lead
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border bg-[#151515] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-text-secondary">
                    Total Leads
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-text-primary">{totalRecords}</p>
                </div>
                <div className="rounded-2xl border border-border bg-[#151515] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-text-secondary">New</p>
                  <p className="mt-2 text-2xl font-semibold text-text-primary">{newLeads}</p>
                </div>
                <div className="rounded-2xl border border-border bg-[#151515] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-text-secondary">
                    Contacted
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-text-primary">{contactedLeads}</p>
                </div>
                <div className="rounded-2xl border border-border bg-[#151515] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-text-secondary">
                    Qualified
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-text-primary">{qualifiedLeads}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card hoverable>
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-2xl border border-border bg-[#151515] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                  Current Page
                </p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">{filters.page}</p>
              </div>
              <div className="rounded-2xl border border-border bg-[#151515] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                  Total Pages
                </p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">{totalPages}</p>
              </div>
              <div className="rounded-2xl border border-border bg-[#151515] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                  Active Filters
                </p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">
                  {activeFilterCount}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <FilterBar
            searchValue={searchInput}
            statusValue={filters.status}
            sourceValue={filters.source}
            onSearchChange={setSearchInput}
            onStatusChange={handleStatusChange}
            onSourceChange={handleSourceChange}
            onReset={handleResetFilters}
          />

          {successMessage ? <StatusMessage tone="success">{successMessage}</StatusMessage> : null}
          {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

          <Card className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Leads</h3>
                <p className="text-sm text-text-secondary">
                  {totalRecords} total record{totalRecords === 1 ? "" : "s"} in your pipeline
                </p>
              </div>
              <Button size="sm" onClick={handleOpenCreate} disabled={submitting}>
                Add Lead
              </Button>
            </div>

            {loading ? (
              <Loader label="Loading leads..." />
            ) : (
              <>
                <LeadTable
                  leads={leads}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteLead}
                  isBusy={submitting}
                  busyLeadId={pendingDeleteId}
                />
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPrevious={() =>
                    setFilters((current) => ({
                      ...current,
                      page: Math.max(current.page - 1, 1),
                    }))
                  }
                  onNext={() =>
                    setFilters((current) => ({
                      ...current,
                      page: Math.min(current.page + 1, totalPages),
                    }))
                  }
                />
              </>
            )}
          </Card>
        </section>
      </main>

      <LeadForm
        isOpen={isFormOpen}
        initialLead={selectedLead}
        isSubmitting={submitting}
        onClose={handleCloseForm}
        onSubmit={handleSubmitLead}
      />
    </div>
  );
};

export default Dashboard;
