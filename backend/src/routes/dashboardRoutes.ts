import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.ts';
import { getSummary, getTrends } from '../controllers/dashboardController.ts';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Aggregated financial summaries and trends (requires authentication)
 */

/** All dashboard endpoints require a valid JWT (Bearer header or `token` cookie). */
router.use(authMiddleware);

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial dashboard summary
 *     tags: [Dashboard]
 *     description: >
 *       Returns totals (income, expenses, net balance), category breakdown, and
 *       recent activity. Available to all authenticated roles (**VIEWER**, **ANALYST**, **ADMIN**).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (ISO 8601, e.g. `2025-01-01`)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (ISO 8601, e.g. `2025-12-31`)
 *       - in: query
 *         name: recentLimit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         description: Number of recent transactions to return
 *     responses:
 *       200:
 *         description: Summary data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSummary'
 *             example:
 *               data:
 *                 totals:
 *                   totalIncome: 12000
 *                   totalExpenses: 6500
 *                   netBalance: 5500
 *                   incomeTransactionCount: 5
 *                   expenseTransactionCount: 3
 *                 categoryBreakdown:
 *                   - category: Administration
 *                     income: 12000
 *                     expense: 3500
 *                     net: 8500
 *                   - category: Operations
 *                     income: 0
 *                     expense: 3000
 *                     net: -3000
 *                 recentActivity:
 *                   - id: d7d66b1f-66e0-47b0-b7f7-8a6d8f1964e0
 *                     amount: 5000
 *                     type: INCOME
 *                     category: Administration
 *                     date: '2025-04-01T00:00:00.000Z'
 *                     notes: Created by Anup Kumar
 *                     createdAt: '2025-04-01T09:15:00.000Z'
 *                     createdBy:
 *                       id: 1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2
 *                       fullName: Anup Kumar
 *                       email: anup.kumar.admin@example.com
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Unauthorized
 *               message: Invalid or expired token
 */
router.get('/summary', getSummary);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get financial trends
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (ISO 8601)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (ISO 8601)
 *       - in: query
 *         name: granularity
 *         schema:
 *           type: string
 *           enum: [week, month]
 *           default: month
 *         description: Trend bucket size
 *     responses:
 *       200:
 *         description: Trend series data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardTrendsResponse'
 *             example:
 *               data:
 *                 granularity: month
 *                 series:
 *                   - period: 2025-04
 *                     granularity: month
 *                     income: 12000
 *                     expense: 6500
 *                     net: 5500
 *                     count: 8
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Unauthorized
 *               message: Invalid or expired token
 */
router.get('/trends', getTrends);

export default router;


