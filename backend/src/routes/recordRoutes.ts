import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.ts';
import { requireRoles } from '../middlewares/rbacMiddleware.ts';
import { ROLES } from '../constants/roles.ts';
import {
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../controllers/recordController.ts';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Financial record management (RBAC-protected)
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: List records
 *     tags: [Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         description: Filter by record type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (ISO 8601)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (ISO 8601)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in notes and category
 *     responses:
 *       200:
 *         description: Paginated list of records
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecordListResponse'
 *             example:
 *               data:
 *                 - id: d7d66b1f-66e0-47b0-b7f7-8a6d8f1964e0
 *                   amount: 5000
 *                   type: INCOME
 *                   category: Administration
 *                   date: '2025-04-01T00:00:00.000Z'
 *                   notes: Created by Anup Kumar
 *                   createdAt: '2025-04-01T09:15:00.000Z'
 *                   updatedAt: '2025-04-01T09:15:00.000Z'
 *                   createdBy:
 *                     id: 1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2
 *                     fullName: Anup Kumar
 *                     email: anup.kumar.admin@example.com
 *               meta:
 *                 page: 1
 *                 limit: 20
 *                 total: 1
 *                 totalPages: 1
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Unauthorized
 *               message: Invalid or expired token
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Forbidden
 *               message: You do not have permission to perform this action.
 */
router.get('/', requireRoles(ROLES.ANALYST, ROLES.ADMIN), listRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a record by ID
 *     tags: [Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Record details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecordDetailResponse'
 *             example:
 *               data:
 *                 id: d7d66b1f-66e0-47b0-b7f7-8a6d8f1964e0
 *                 amount: 5000
 *                 type: INCOME
 *                 category: Administration
 *                 date: '2025-04-01T00:00:00.000Z'
 *                 notes: Created by Anup Kumar
 *                 createdAt: '2025-04-01T09:15:00.000Z'
 *                 updatedAt: '2025-04-01T09:15:00.000Z'
 *                 createdBy:
 *                   id: 1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2
 *                   fullName: Anup Kumar
 *                   email: anup.kumar.admin@example.com
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Unauthorized
 *               message: Invalid or expired token
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Forbidden
 *               message: You do not have permission to perform this action.
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Not found
 *               message: Record not found
 */
router.get('/:id', requireRoles(ROLES.ANALYST, ROLES.ADMIN), getRecord);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Records]
 *     description: >
 *       Creates a new income or expense record.
 *       **Required role:** `ADMIN` only.
 *       The record is automatically linked to the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecordRequest'
 *           example:
 *             amount: 5000
 *             type: INCOME
 *             category: Administration
 *             date: '2025-04-01'
 *             notes: Created by Anup Kumar
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecordMutationResponse'
 *             example:
 *               message: Record created
 *               data:
 *                 id: d7d66b1f-66e0-47b0-b7f7-8a6d8f1964e0
 *                 amount: 5000
 *                 type: INCOME
 *                 category: Administration
 *                 date: '2025-04-01T00:00:00.000Z'
 *                 notes: Created by Anup Kumar
 *                 createdAt: '2025-04-01T09:15:00.000Z'
 *                 updatedAt: '2025-04-01T09:15:00.000Z'
 *                 createdBy:
 *                   id: 1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2
 *                   fullName: Anup Kumar
 *                   email: anup.kumar.admin@example.com
 *       400:
 *         description: Validation failed — missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Validation failed
 *               message: amount must be a positive number
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Unauthorized
 *               message: Invalid or expired token
 *       403:
 *         description: Forbidden — insufficient role (requires ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Forbidden
 *               message: You do not have permission to perform this action.
 */
router.post('/', requireRoles(ROLES.ADMIN), createRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   patch:
 *     summary: Update a financial record
 *     tags: [Records]
 *     description: >
 *       Partially updates an existing financial record (only non-deleted records).
 *       **Required role:** `ADMIN` only.
 *       Send only the fields you want to change.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRecordRequest'
 *           example:
 *             amount: 6000
 *             type: EXPENSE
 *             category: Operations
 *             date: '2025-04-15'
 *             notes: Updated by Anup Kumar
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecordMutationResponse'
 *             example:
 *               message: Record updated
 *               data:
 *                 id: d7d66b1f-66e0-47b0-b7f7-8a6d8f1964e0
 *                 amount: 6000
 *                 type: EXPENSE
 *                 category: Operations
 *                 date: '2025-04-15T00:00:00.000Z'
 *                 notes: Updated by Anup Kumar
 *                 createdAt: '2025-04-01T09:15:00.000Z'
 *                 updatedAt: '2025-04-15T11:00:00.000Z'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Validation failed
 *               message: No valid fields to update
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Unauthorized
 *               message: Invalid or expired token
 *       403:
 *         description: Forbidden — insufficient role (requires ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Forbidden
 *               message: You do not have permission to perform this action.
 *       404:
 *         description: Record not found or already deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Not found
 *               message: Record not found
 */
router.patch('/:id', requireRoles(ROLES.ADMIN), updateRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Delete a record
 *     tags: [Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Bad request
 *               message: Invalid record id
 *       404:
 *         description: Record not found
 */
router.delete('/:id', requireRoles(ROLES.ADMIN), deleteRecord);

export default router;


