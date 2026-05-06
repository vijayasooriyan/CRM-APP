const Lead = require('../models/Lead');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total leads
    const totalLeads = await Lead.countDocuments();

    // New leads
    const newLeads = await Lead.countDocuments({ status: 'New' });

    // Qualified leads
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });

    // Won leads
    const wonLeads = await Lead.countDocuments({ status: 'Won' });

    // Lost leads
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });

    // Total deal value
    const totalDealValueResult = await Lead.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$dealValue' },
        },
      },
    ]);
    const totalDealValue = totalDealValueResult[0]?.totalValue || 0;

    // Won deal value
    const wonDealValueResult = await Lead.aggregate([
      {
        $match: { status: 'Won' },
      },
      {
        $group: {
          _id: null,
          totalWonValue: { $sum: '$dealValue' },
        },
      },
    ]);
    const totalWonValue = wonDealValueResult[0]?.totalWonValue || 0;

    // Leads by source
    const leadsBySource = await Lead.aggregate([
      {
        $group: {
          _id: '$leadSource',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Leads by status
    const leadsByStatus = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,
      totalDealValue,
      totalWonValue,
      leadsBySource,
      leadsByStatus,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};
