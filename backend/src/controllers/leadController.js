const Lead = require('../models/Lead');
const { validateEmail, validatePhone, validateLeadSource, validateStatus } = require('../utils/validators');

// Get all leads with filtering and search
exports.getAllLeads = async (req, res) => {
  try {
    const { status, leadSource, assignedSalesperson, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let query = {};

    // Apply filters
    if (status) {
      query.status = status;
    }

    if (leadSource) {
      query.leadSource = leadSource;
    }

    if (assignedSalesperson) {
      query.assignedSalesperson = assignedSalesperson;
    }

    // Apply search
    if (search) {
      query.$or = [
        { leadName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch leads
    const leads = await Lead.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Lead.countDocuments(query);

    res.status(200).json({
      leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Error fetching leads' });
  }
};

// Get single lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.status(200).json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ message: 'Error fetching lead' });
  }
};

// Create new lead
exports.createLead = async (req, res) => {
  try {
    const { leadName, companyName, email, phone, leadSource, assignedSalesperson, status, dealValue } = req.body;

    // Validation
    if (!leadName || !companyName || !email || !phone || !leadSource || !assignedSalesperson || !dealValue) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ message: 'Invalid phone format' });
    }

    if (!validateLeadSource(leadSource)) {
      return res.status(400).json({ message: 'Invalid lead source' });
    }

    if (status && !validateStatus(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (dealValue < 0) {
      return res.status(400).json({ message: 'Deal value cannot be negative' });
    }

    // Create lead
    const lead = new Lead({
      leadName,
      companyName,
      email,
      phone,
      leadSource,
      assignedSalesperson,
      status: status || 'New',
      dealValue,
      notes: [],
    });

    await lead.save();

    res.status(201).json({
      message: 'Lead created successfully',
      lead,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Error creating lead' });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { leadName, companyName, email, phone, leadSource, assignedSalesperson, status, dealValue } = req.body;

    // Validation if email is being updated
    if (email && !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ message: 'Invalid phone format' });
    }

    if (leadSource && !validateLeadSource(leadSource)) {
      return res.status(400).json({ message: 'Invalid lead source' });
    }

    if (status && !validateStatus(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (dealValue !== undefined && dealValue < 0) {
      return res.status(400).json({ message: 'Deal value cannot be negative' });
    }

    // Update fields
    const updateData = {};
    if (leadName) updateData.leadName = leadName;
    if (companyName) updateData.companyName = companyName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (leadSource) updateData.leadSource = leadSource;
    if (assignedSalesperson) updateData.assignedSalesperson = assignedSalesperson;
    if (status) updateData.status = status;
    if (dealValue !== undefined) updateData.dealValue = dealValue;

    const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.status(200).json({
      message: 'Lead updated successfully',
      lead,
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Error updating lead' });
  }
};

// Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.status(200).json({
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Error deleting lead' });
  }
};

// Add note to lead
exports.addNoteToLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, createdBy } = req.body;

    if (!content || !createdBy) {
      return res.status(400).json({ message: 'Note content and createdBy are required' });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const note = {
      content,
      createdBy,
      createdAt: new Date(),
    };

    lead.notes.push(note);
    await lead.save();

    res.status(201).json({
      message: 'Note added successfully',
      lead,
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Error adding note' });
  }
};
