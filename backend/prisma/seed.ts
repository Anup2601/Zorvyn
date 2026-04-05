import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma, disconnectDB } from '../src/config/db.ts';

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'owner@zorvyn.local';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Zorvyn@2026';

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      fullName: 'Zorvyn Owner',
      password: hash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    update: {
      fullName: 'Zorvyn Owner',
      role: 'ADMIN',
      status: 'ACTIVE',
      password: hash,
    },
  });

  console.log(`Seed OK — admin user: ${email} (set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD to override)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });

