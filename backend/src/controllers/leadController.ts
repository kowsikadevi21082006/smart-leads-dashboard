import { Request, Response } from "express";
import Lead from "../models/Lead";

type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
type LeadSource = "Website" | "Instagram" | "Referral";

export const createLead = async (req: Request, res: Response) => {
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

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status,
      source,
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Error creating lead." });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const { status, source, search, sort } = req.query;

    let query: any = {};

    if (status) query.status = status;
    if (source) query.source = source;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let sortOption: any = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const total = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      data: leads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads." });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found." });

    res.json(lead);
  } catch {
    res.status(500).json({ message: "Error fetching lead." });
  }
};

export const updateLead = async (req: Request, res: Response) => {
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

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
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

export const deleteLead = async (req: Request, res: Response) => {
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
