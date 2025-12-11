import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  try {
    const { order_id } = await params;
    const order = await prisma.order.findUnique({ where: { orderId: order_id } });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Error retrieving order:", error);
    return new Response("Error retrieving order", { status: 500 });
  }
}
