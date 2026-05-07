/**
 * Log an activity entry on a lead document.
 * @param {Object} lead - Mongoose lead document
 * @param {String} action - Action type (e.g. 'status_change', 'edit', 'note', 'created')
 * @param {String} detail - Human-readable description
 * @param {String} userName - Who performed the action
 */
const logActivity = (lead, action, detail, userName) => {
  if (!lead.activity) {
    lead.activity = [];
  }
  lead.activity.push({
    action,
    detail,
    performedBy: userName || 'System',
    createdAt: new Date(),
  });
};

module.exports = { logActivity };
