const Lead = require('../models/Lead');
const { validateEmail, validatePhone, validateLeadSource, validateStatus } = require('../utils/validators');
const { calculateLeadScore } = require('../utils/scoreCalculator');
const { logActivity } = require('../utils/activityLogger');

// Get all leads with filtering and search
exports.getAllLeads = async (req, res) => {
  try {
    const { status, leadSource, assignedSalesperson, search, stale, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

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

    // Stale filter: updated > 14 days ago AND not Won/Lost
    if (stale === 'true') {
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      query.updatedAt = { $lt: fourteenDaysAgo };
      query.status = { $nin: ['Won', 'Lost'] };
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
    const { leadName, companyName, email, phone, leadSource, assignedSalesperson, status, dealValue, followUpDate } = req.body;

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
      followUpDate: followUpDate || null,
      notes: [],
      activity: [],
    });

    // Log creation activity
    const userName = req.user?.email || 'System';
    logActivity(lead, 'created', `Lead created with status "${lead.status}" and deal value $${Number(dealValue).toLocaleString()}`, userName);

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
    const { leadName, companyName, email, phone, leadSource, assignedSalesperson, status, dealValue, followUpDate } = req.body;

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

    // Fetch existing lead to log changes
    const existingLead = await Lead.findById(id);
    if (!existingLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const userName = req.user?.email || 'System';

    // Log specific changes
    if (status && status !== existingLead.status) {
      logActivity(existingLead, 'status_change', `Status changed from "${existingLead.status}" to "${status}"`, userName);
    }
    if (dealValue !== undefined && dealValue !== existingLead.dealValue) {
      logActivity(existingLead, 'edit', `Deal value updated from $${existingLead.dealValue.toLocaleString()} to $${Number(dealValue).toLocaleString()}`, userName);
    }
    if (leadName && leadName !== existingLead.leadName) {
      logActivity(existingLead, 'edit', `Lead name updated from "${existingLead.leadName}" to "${leadName}"`, userName);
    }
    if (companyName && companyName !== existingLead.companyName) {
      logActivity(existingLead, 'edit', `Company name updated from "${existingLead.companyName}" to "${companyName}"`, userName);
    }
    if (followUpDate !== undefined && String(followUpDate) !== String(existingLead.followUpDate)) {
      const dateStr = followUpDate ? new Date(followUpDate).toLocaleDateString() : 'none';
      logActivity(existingLead, 'edit', `Follow-up date set to ${dateStr}`, userName);
    }

    // Apply updates to the existing document
    if (leadName) existingLead.leadName = leadName;
    if (companyName) existingLead.companyName = companyName;
    if (email) existingLead.email = email;
    if (phone) existingLead.phone = phone;
    if (leadSource) existingLead.leadSource = leadSource;
    if (assignedSalesperson) existingLead.assignedSalesperson = assignedSalesperson;
    if (status) existingLead.status = status;
    if (dealValue !== undefined) existingLead.dealValue = dealValue;
    if (followUpDate !== undefined) existingLead.followUpDate = followUpDate || null;

    // Recalculate score
    existingLead.leadScore = calculateLeadScore(existingLead);

    await existingLead.save();

    res.status(200).json({
      message: 'Lead updated successfully',
      lead: existingLead,
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

    // Log activity for note
    logActivity(lead, 'note', `Note added: "${content.substring(0, 80)}${content.length > 80 ? '...' : ''}"`, createdBy);

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

// Summarize notes using Grok AI
exports.summarizeNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (!lead.notes || lead.notes.length === 0) {
      return res.status(400).json({ message: 'No notes to summarize' });
    }

    const allNotes = lead.notes.map(n => n.content).join('\n');
    const prompt = `You are a CRM assistant. Summarize the following sales notes for lead ${lead.leadName} at ${lead.companyName} into exactly 2 sentences: first sentence covers what has happened so far, second sentence suggests the best next action for the sales rep. Be concise and specific. Notes: ${allNotes}`;

    console.log(`Summarizing notes for lead: ${lead.leadName} using Groq`);
    
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      console.error('GROQ_API_KEY is missing or not set in backend .env');
      return res.status(500).json({ message: 'AI Service (Groq) not configured' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a helpful CRM assistant that provides concise note summaries.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', JSON.stringify(errorData, null, 2));
      return res.status(response.status).json({ message: errorData.error?.message || 'Failed to generate AI summary' });
    }

    const data = await response.json();
    res.status(200).json({ summary: data.choices[0].message.content });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ message: 'Internal server error during summarization' });
  }
};
