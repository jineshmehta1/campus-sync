import { PrismaClient, UserRole, Stage } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10)

  // 👑 ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aravali.com' },
    update: {},
    create: {
      name: 'Admin Aravali',
      email: 'admin@aravali.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      stage: Stage.EXPERT,
    },
  })

  // 👨‍🏫 COACH
  const coach = await prisma.user.upsert({
    where: { email: 'coach@aravali.com' },
    update: {},
    create: {
      name: 'Coach Aravali',
      email: 'coach@aravali.com',
      password: hashedPassword,
      role: UserRole.COACH,
      stage: Stage.EXPERT,
    },
  })

  // 🎓 STUDENT (linked to coach)
  const student = await prisma.user.upsert({
    where: { email: 'student@aravali.com' },
    update: {},
    create: {
      name: 'Student Aravali',
      email: 'student@aravali.com',
      password: hashedPassword,
      role: UserRole.STUDENT,
      coachId: coach.id, // 🔥 important relation
      stage: Stage.BEGINNER,
      parentName: 'Parent Name',
      parentPhone: '9999999999',
    },
  })

  console.log('✅ Seeded Successfully:', { admin, coach, student })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })