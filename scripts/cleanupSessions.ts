import "dotenv/config";
import prisma from "@/lib/prisma";

async function run() {
  const days = parseInt(process.env.SESSION_RETENTION_DAYS || "30", 10);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  await prisma.chatSession.deleteMany({
    where: {
      endedAt: { lt: cutoff },
    },
  });
}

run()
  .catch((err) => {
    console.error("Cleanup failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
