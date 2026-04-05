import type { UserRole, UserStatus } from '../../generated/prisma/enums.ts';

declare global {
  namespace Express {
    interface RequestUser {
      id: string;
      email: string;
      fullName: string;
      phone: string | null;
      role: UserRole;
      status: UserStatus;
      createdAt: Date;
      updatedAt: Date;
    }

    interface Request {
      user?: RequestUser;
    }
  }
}

export {};
