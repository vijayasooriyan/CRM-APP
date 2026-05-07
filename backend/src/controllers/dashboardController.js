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

    // Active leads (Open Deals) - anything that is NOT Won or Lost
    const activeLeads = await Lead.countDocuments({ status: { $nin: ['Won', 'Lost'] } });

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

    // Top 5 leads by score
    const topLeadsByScore = await Lead.find()
      .sort({ leadScore: -1 })
      .limit(5)
      .select('leadName companyName leadScore status dealValue');

    // Stale leads count (updated > 14 days ago AND not Won/Lost)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const staleLeads = await Lead.countDocuments({
      updatedAt: { $lt: fourteenDaysAgo },
      status: { $nin: ['Won', 'Lost'] },
    });

    // Follow-ups due today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const followUpsDueToday = await Lead.countDocuments({
      followUpDate: { $gte: todayStart, $lte: todayEnd },
    });

    // Overdue follow-ups (followUpDate before today)
    const overdueFollowUps = await Lead.countDocuments({
      followUpDate: { $lt: todayStart, $ne: null },
      status: { $nin: ['Won', 'Lost'] },
    });

    res.status(200).json({
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,
      activeLeads,
      totalDealValue,
      totalWonValue,
      leadsBySource,
      leadsByStatus,
      topLeadsByScore,
      staleLeads,
      followUpsDueToday,
      overdueFollowUps,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};
