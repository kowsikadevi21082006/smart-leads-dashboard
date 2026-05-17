import { Response } from "express";
import Lead from "../models/Lead";
import { AuthenticatedRequest, UserRole } from "../types/auth";

type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
type LeadSource = "Website" | "Instagram" | "Referral";
type LeadQuery = {
  _id?: string;
  createdBy?: string;
  status?: LeadStatus;
  source?: LeadSource;
  $or?: Array<
    | { name: { $regex: string; $options: "i" } }
    | { email: { $regex: string; $options: "i" } }
  >;
};

const PAGE_SIZE = 10;

const getRouteParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const applyRoleScope = (
  query: LeadQuery,
  user?: { id: string; role: UserRole }
): LeadQuery => {
  if (user?.role === "sales") {
    return {
      ...query,
      createdBy: user.id,
    };
  }

  return query;
};

const buildLeadQuery = (req: AuthenticatedRequest): LeadQuery => {
  const { status, source, search } = req.query;
  const query: LeadQuery = {};

  if (
    typeof status === "string" &&
    ["New", "Contacted", "Qualified", "Lost"].includes(status)
  ) {
    query.status = status as LeadStatus;
  }

  if (
    typeof source === "string" &&
    ["Website", "Instagram", "Referral"].includes(source)
  ) {
    query.source = source as LeadSource;
  }

  if (typeof search === "string" && search.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { email: { $regex: search.trim(), $options: "i" } },
    ];
  }

  return applyRoleScope(query, req.user);
};

const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;

const formatLeadCsv = (
  leads: Array<{
    name: string;
    email: string;
    status: string;
    source: string;
    createdAt: Date;
  }>
) => {
  const headers = ["Name", "Email", "Status", "Source", "Created At"];
  const rows = leads.map((lead) =>
    [
      lead.name,
      lead.email,
      lead.status,
      lead.source,
      lead.createdAt.toISOString(),
    ]
      .map((value) => escapeCsvValue(value))
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
};

export const createLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, status, source } = req.body as {
      name?: string;
      email?: string;
      status?: LeadStatus;
      source?: LeadSource;
    };

    if (!name?.trim() || !email?.trim() || !source?.trim()) {
      return res.status(400).json({ message: "Name, email, and source are required." });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status,
      source,
      createdBy: req.user.id,
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Error creating lead." });
  }
};

export const getLeads = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sort } = req.query;
    const query = buildLeadQuery(req);

    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * PAGE_SIZE;

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const total = await Lead.countDocuments(
      query as Parameters<typeof Lead.countDocuments>[0]
    );

    const leads = await Lead.find(query as Parameters<typeof Lead.find>[0])
      .sort(sortOption)
      .skip(skip)
      .limit(PAGE_SIZE);

    res.json({
      data: leads,
      total,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads." });
  }
};

export const exportLeads = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = buildLeadQuery(req);
    const leads = await Lead.find(query as Parameters<typeof Lead.find>[0])
      .sort({ createdAt: -1 })
      .lean();
    const csv = formatLeadCsv(leads);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=\"leads-${timestamp}.csv\"`);
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: "Error exporting leads." });
  }
};

export const getLeadById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leadId = getRouteParam(req.params.id);

    if (!leadId) {
      return res.status(400).json({ message: "Lead id is required." });
    }

    const query = applyRoleScope({ _id: leadId }, req.user);
    const lead = await Lead.findOne(query as Parameters<typeof Lead.findOne>[0]);
    if (!lead) return res.status(404).json({ message: "Lead not found." });

    res.json(lead);
  } catch {
    res.status(500).json({ message: "Error fetching lead." });
  }
};

export const updateLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, status, source } = req.body as {
      name?: string;
      email?: string;
      status?: LeadStatus;
      source?: LeadSource;
    };

    if (!name?.trim() || !email?.trim() || !source?.trim()) {
      return res.status(400).json({ message: "Name, email, and source are required." });
    }

    const leadId = getRouteParam(req.params.id);

    if (!leadId) {
      return res.status(400).json({ message: "Lead id is required." });
    }

    const query = applyRoleScope({ _id: leadId }, req.user);

    const lead = await Lead.findOneAndUpdate(
      query as Parameters<typeof Lead.findOneAndUpdate>[0],
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        status,
        source,
      },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.json(lead);
  } catch {
    res.status(500).json({ message: "Error updating lead." });
  }
};

export const deleteLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.json({ message: "Deleted successfully." });
  } catch {
    res.status(500).json({ message: "Error deleting lead." });
  }
};
