export async function POST(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;
    // Simulate sending a reset password email
    return new Response(
      JSON.stringify({
        message: `Password reset email sent to user ${user_id}`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return new Response("Error resetting password", { status: 500 });
  }
}
