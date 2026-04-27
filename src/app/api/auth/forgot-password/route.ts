import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success even if user doesn't exist (security)
    if (!user) {
      return NextResponse.json({ success: true, message: "If email exists, reset link sent" });
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: `password-reset:${user.id}`,
        token: resetToken,
        expires,
      },
    });

    // In production, send email with reset link
    // For now, just log it
    console.log(`🔑 Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset URL: ${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`);

    return NextResponse.json({ 
      success: true, 
      message: "If email exists, reset link sent",
      // Remove this in production
      debugToken: resetToken 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
