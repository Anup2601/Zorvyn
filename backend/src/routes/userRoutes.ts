import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.ts';
import { requireRoles } from '../middlewares/rbacMiddleware.ts';
import { ROLES } from '../constants/roles.ts';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.ts';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management — **ADMIN** role required for all endpoints
 */

router.use(authMiddleware);
router.use(requireRoles(ROLES.ADMIN));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (paginated)
 *     tags: [Users]
 *     description: >
 *       Returns a paginated list of all users.
 *       **Required role:** `ADMIN` only.
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
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *             example:
 *               data:
 *                 - id: 1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2
 *                   email: anup.kumar.admin@example.com
 *                   fullName: Anup Kumar
 *                   phone: '+919876543210'
 *                   role: ADMIN
 *                   status: ACTIVE
 *                   createdAt: '2025-04-01T09:00:00.000Z'
 *                   updatedAt: '2025-04-01T09:30:00.000Z'
 *               meta:
 *                 page: 1
 *                 limit: 20
 *                 total: 1
 *                 totalPages: 1
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
router.get('/', listUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
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
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetailResponse'
 *             example:
 *               data:
 *                 id: 1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2
 *                 email: anup.kumar.admin@example.com
 *                 fullName: Anup Kumar
 *                 phone: '+919876543210'
 *                 role: ADMIN
 *                 status: ACTIVE
 *                 createdAt: '2025-04-01T09:00:00.000Z'
 *                 updatedAt: '2025-04-01T09:30:00.000Z'
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Not found
 *               message: User not found
 */
router.get('/:id', getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: >
 *       Creates a new user with the specified role and status.
 *       **Required role:** `ADMIN` only.
 *       Password is hashed before storage.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *           example:
 *             fullName: Anup Kumar
 *             email: anup.kumar.admin@example.com
 *             phone: '+919876543210'
 *             password: Anup@12345
 *             role: ADMIN
 *             status: ACTIVE
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMutationResponse'
 *             example:
 *               message: User created
 *               data:
 *                 id: 1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2
 *                 email: anup.kumar.admin@example.com
 *                 fullName: Anup Kumar
 *                 phone: '+919876543210'
 *                 role: ADMIN
 *                 status: ACTIVE
 *                 createdAt: '2025-04-01T09:00:00.000Z'
 *                 updatedAt: '2025-04-01T09:30:00.000Z'
 *       400:
 *         description: Validation failed — missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Validation failed
 *               message: role must be one of: VIEWER, ANALYST, ADMIN
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
 *       409:
 *         description: Conflict — email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Conflict
 *               message: Email already in use
 */
router.post('/', createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Anup Kumar
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: '+919876543210'
 *               role:
 *                 type: string
 *                 enum: [VIEWER, ANALYST, ADMIN]
 *                 example: ADMIN
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Anup@12345
 *           example:
 *             fullName: Anup Kumar
 *             phone: '+919876543210'
 *             role: ADMIN
 *             status: ACTIVE
 *             password: Anup@12345
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMutationResponse'
 *             example:
 *               message: User updated
 *               data:
 *                 id: 1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2
 *                 email: anup.kumar.admin@example.com
 *                 fullName: Anup Kumar
 *                 phone: '+919876543210'
 *                 role: ADMIN
 *                 status: ACTIVE
 *                 createdAt: '2025-04-01T09:00:00.000Z'
 *                 updatedAt: '2025-04-01T09:30:00.000Z'
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Not found
 *               message: User not found
 */
router.patch('/:id', updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Bad request
 *               message: Cannot delete your own account
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Not found
 *               message: User not found
 */
router.delete('/:id', deleteUser);

export default router;


