export async function POST(
  request: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  try {
    const { order_id } = await params;
    const { product_ids } = await request.json();
    // Simulate return initiation
    return new Response(
      JSON.stringify({
        message: `Return initiated for order ${order_id}`,
        product_ids,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating return:", error);
    return new Response("Error creating return", { status: 500 });
  }
}
