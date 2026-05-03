const DashboardService = require('../services/dashboard.service');

const getUserId = (req) => {
  return req.query.userId || req.headers['x-user-id'] || req.user?.id || 'demo-user';
};

/**
 * GET /api/dashboard/dieta
 * Retrieve diet dashboard data
 */
exports.getDietaDashboard = async (req, res) => {
  try {
    const userId = getUserId(req);
    const data = await DashboardService.getDietaDashboard(userId);
    res.json(data);
  } catch (error) {
    console.error('GET dieta error:', error);
    res.status(404).json({ error: error.message || 'Dashboard not found' });
  }
};

/**
 * GET /api/dashboard/deporte
 * Retrieve sport dashboard data
 */
exports.getDeporteDashboard = async (req, res) => {
  try {
    const userId = getUserId(req);
    const data = await DashboardService.getDeporteDashboard(userId);
    res.json(data);
  } catch (error) {
    console.error('GET deporte error:', error);
    res.status(404).json({ error: error.message || 'Dashboard not found' });
  }
};

/**
 * POST /api/dashboard/upsert
 * Create or update dashboard data
 */
exports.upsertDashboard = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { dieta, deporte } = req.body;

    const data = await DashboardService.upsertDashboard(userId, {
      ...(dieta && { dieta }),
      ...(deporte && { deporte }),
    });

    res.json({ message: 'Dashboard updated successfully', data });
  } catch (error) {
    console.error('POST upsert error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};