import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;
    const { email, phone, address, name } = await request.json();
    const data = {
      ...(email && { email }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(name && { name }),
    };
    await prisma.user.update({
      where: { id: user_id },
      data,
    });
    return new Response(
      JSON.stringify({
        message: `User ${user_id} info updated`,
        updated: data,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user info:", error);
    return new Response("Error updating user info", { status: 500 });
  }
}
