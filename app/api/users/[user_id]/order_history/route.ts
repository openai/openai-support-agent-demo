import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;
    const orders = await prisma.order.findMany({ where: { userId: user_id } });
    return new Response(JSON.stringify(orders), {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving order history:", error);
    return new Response("Error retrieving order history", { status: 500 });
  }
}
