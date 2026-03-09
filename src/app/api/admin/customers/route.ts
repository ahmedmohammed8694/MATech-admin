import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("-password");

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin customers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
