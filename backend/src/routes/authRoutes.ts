import { Router } from 'express';
import { register, login, logout, me } from '../controllers/authController.ts';
import authMiddleware from '../middlewares/authMiddleware.ts';
import { authLimiter } from '../middlewares/rateLimiter.ts';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication — register, login, logout, and profile
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: >
 *       Creates a new user account with the **VIEWER** role.
 *       Returns a JWT token in both the response body and an HTTP-only cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               message: User registered successfully
 *               data:
 *                 id: 1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2
 *                 fullName: Anup Kumar
 *                 email: anup.kumar.admin@example.com
 *                 phone: '+919876543210'
 *                 role: ADMIN
 *                 status: ACTIVE
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation failed — missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Validation failed
 *               message: fullName, email, and password are required
 *       409:
 *         description: Conflict — email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Conflict
 *               message: User already exists
 *       429:
 *         description: Too many requests — rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Too many requests
 *               message: Too many authentication attempts. Please try again after 15 minutes.
 */
router.post('/register', authLimiter, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     description: >
 *       Authenticates a user and returns a JWT token (valid for 7 days).
 *       The token is also set as an HTTP-only cookie named `token`.
 *       Use this token in the **Authorize** dialog (🔒) to access protected endpoints.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               message: Login successful
 *               data:
 *                 id: 1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2
 *                 fullName: Anup Kumar
 *                 email: anup.kumar.admin@example.com
 *                 phone: '+919876543210'
 *                 role: ADMIN
 *                 status: ACTIVE
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation failed — missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Validation failed
 *               message: email and password are required
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Unauthorized
 *               message: Invalid credentials
 *       403:
 *         description: Account inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Forbidden
 *               message: Account is inactive. Contact an administrator.
 *       429:
 *         description: Too many requests — rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Too many requests
 *               message: Too many authentication attempts. Please try again after 15 minutes.
 */
router.post('/login', authLimiter, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *             example:
 *               message: Logged out successfully
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the current user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
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
 */
router.get('/me', authMiddleware, me);

export default router;


