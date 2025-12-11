import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: { orders: true },
    });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response("Error fetching user", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, name, phone, address } = await request.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, phone, address },
      create: { email, name, phone, address },
      include: { orders: true },
    });
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response("Error creating user", { status: 500 });
  }
}
