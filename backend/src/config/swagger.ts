import swaggerJsdoc from 'swagger-jsdoc';

const localSwaggerServerUrl = process.env.SWAGGER_SERVER_URL ?? `http://localhost:${process.env.PORT ?? 5000}`;
const swaggerServers = [
  {
    url: localSwaggerServerUrl,
    description: 'Local server'
  }
];

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zorvyn Finance API',
      version: '1.1.1',
      description:
        'RESTful API for managing financial records with role-based access control (RBAC). ' +
        'Roles: **ADMIN** (full access), **ANALYST** (read records/dashboard), **VIEWER** (dashboard only).',
    },
    servers: swaggerServers,
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Enter the JWT token returned from `/api/auth/login` or `/api/auth/register`. ' +
            'The token is also set as an HTTP-only cookie named `token`.',
        },
      },
      schemas: {
        // ---------- Auth ----------
        RegisterRequest: {
          type: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            fullName: { type: 'string', example: 'Anup Kumar' },
            email: { type: 'string', format: 'email', example: 'anup.kumar.admin@example.com' },
            phone: { type: 'string', example: '+919876543210', nullable: true },
            password: { type: 'string', format: 'password', example: 'Anup@12345' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'anup.kumar.admin@example.com' },
            password: { type: 'string', format: 'password', example: 'Anup@12345' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: '1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2' },
                fullName: { type: 'string', example: 'Anup Kumar' },
                email: { type: 'string', format: 'email', example: 'anup.kumar.admin@example.com' },
                phone: { type: 'string', nullable: true, example: '+919876543210' },
                role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'], example: 'ADMIN' },
                status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
              },
            },
            token: { type: 'string', description: 'JWT token (also set as HTTP-only cookie)', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },

        // ---------- Financial Record ----------
        CreateRecordRequest: {
          type: 'object',
          required: ['amount', 'type', 'category', 'date'],
          properties: {
            amount: { type: 'number', example: 5000 },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' },
            category: { type: 'string', example: 'Administration' },
            date: { type: 'string', format: 'date', example: '2025-04-01' },
            notes: { type: 'string', nullable: true, example: 'Created by Anup Kumar' },
          },
        },
        UpdateRecordRequest: {
          type: 'object',
          properties: {
            amount: { type: 'number', example: 6000 },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'EXPENSE' },
            category: { type: 'string', example: 'Operations' },
            date: { type: 'string', format: 'date', example: '2025-04-15' },
            notes: { type: 'string', nullable: true, example: 'Updated by Anup Kumar' },
          },
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'd7d66b1f-66e0-47b0-b7f7-8a6d8f1964e0' },
            amount: { type: 'number', example: 5000 },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' },
            category: { type: 'string', example: 'Administration' },
            date: { type: 'string', format: 'date-time', example: '2025-04-01T00:00:00.000Z' },
            notes: { type: 'string', nullable: true, example: 'Created by Anup Kumar' },
            deletedAt: { type: 'string', format: 'date-time', nullable: true, example: null },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-01T09:15:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-04-01T09:15:00.000Z' },
            createdBy: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', example: '1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2' },
                fullName: { type: 'string', example: 'Anup Kumar' },
                email: { type: 'string', format: 'email', example: 'anup.kumar.admin@example.com' },
              },
            },
          },
        },

        // ---------- User ----------
        CreateUserRequest: {
          type: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            fullName: { type: 'string', example: 'Anup Kumar' },
            email: { type: 'string', format: 'email', example: 'anup.kumar.admin@example.com' },
            phone: { type: 'string', nullable: true, example: '+919876543210' },
            password: { type: 'string', format: 'password', example: 'Anup@12345' },
            role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'], default: 'ADMIN', example: 'ADMIN' },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', example: 'ACTIVE' },
          },
        },
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '1e4a43a7-9f48-4d27-8f3f-5cd5f8eb7dc2' },
            email: { type: 'string', format: 'email', example: 'anup.kumar.admin@example.com' },
            fullName: { type: 'string', example: 'Anup Kumar' },
            phone: { type: 'string', nullable: true, example: '+919876543210' },
            role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'], example: 'ADMIN' },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-04-01T09:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-04-01T09:30:00.000Z' },
          },
        },

        // ---------- Dashboard ----------
        DashboardSummary: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                totals: {
                  type: 'object',
                  properties: {
                    totalIncome: { type: 'number' },
                    totalExpenses: { type: 'number' },
                    netBalance: { type: 'number' },
                    incomeTransactionCount: { type: 'integer' },
                    expenseTransactionCount: { type: 'integer' },
                  },
                },
                categoryBreakdown: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      category: { type: 'string' },
                      income: { type: 'number' },
                      expense: { type: 'number' },
                      net: { type: 'number' },
                    },
                  },
                },
                recentActivity: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/FinancialRecord' },
                },
              },
            },
          },
        },
        DashboardTrendsResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                granularity: { type: 'string', example: 'month' },
                series: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      period: { type: 'string', example: '2025-04' },
                      granularity: { type: 'string', example: 'month' },
                      income: { type: 'number', example: 12000 },
                      expense: { type: 'number', example: 6500 },
                      net: { type: 'number', example: 5500 },
                      count: { type: 'integer', example: 8 },
                    },
                  },
                },
              },
            },
          },
        },

        // ---------- Common Responses ----------
        LogoutResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Logged out successfully' },
          },
        },
        UserProfileResponse: {
          type: 'object',
          properties: {
            data: { $ref: '#/components/schemas/UserPublic' },
          },
        },
        UserListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/UserPublic' },
            },
            meta: { $ref: '#/components/schemas/PaginationMeta' },
          },
        },
        UserDetailResponse: {
          type: 'object',
          properties: {
            data: { $ref: '#/components/schemas/UserPublic' },
          },
        },
        UserMutationResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User updated' },
            data: { $ref: '#/components/schemas/UserPublic' },
          },
        },
        RecordListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/FinancialRecord' },
            },
            meta: { $ref: '#/components/schemas/PaginationMeta' },
          },
        },
        RecordDetailResponse: {
          type: 'object',
          properties: {
            data: { $ref: '#/components/schemas/FinancialRecord' },
          },
        },
        RecordMutationResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Record updated' },
            data: { $ref: '#/components/schemas/FinancialRecord' },
          },
        },

        // ---------- Shared ----------
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 42 },
            totalPages: { type: 'integer', example: 3 },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Validation failed' },
            message: { type: 'string', example: 'email and password are required' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

