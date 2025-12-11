import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date();
    end.setUTCHours(23, 59, 59, 999);

    const count = await prisma.ticket.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const today = start.toISOString().split("T")[0];
    const index = count + 1;
    const ticket_id = `#${index}/${today}`;

    await prisma.ticket.create({
      data: {
        ticket: ticket_id,
      },
    });

    return new Response(JSON.stringify({ ticket_id }), { status: 200 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return new Response(
      JSON.stringify({ error: "Error creating ticket" }),
      { status: 500 }
    );
  }
}
