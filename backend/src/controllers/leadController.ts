import { Request, Response } from "express";
import Lead from "../models/Lead";

export const createLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Error creating lead" });
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
    res.status(500).json({ message: "Error fetching leads" });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Not found" });

    res.json(lead);
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(lead);
  } catch {
    res.status(500).json({ message: "Error updating" });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting" });
  }
};