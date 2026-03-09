import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Admin tickets error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
