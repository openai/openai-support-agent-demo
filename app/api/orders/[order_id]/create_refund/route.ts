export async function POST(
  request: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  try {
    const { order_id } = await params;
    const { amount, reason } = await request.json();
    // Simulate refund creation
    return new Response(
      JSON.stringify({
        message: `Refund of $${amount} for order ${order_id} is processing`,
        reason,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating refund:", error);
    return new Response("Error creating refund", { status: 500 });
  }
}
