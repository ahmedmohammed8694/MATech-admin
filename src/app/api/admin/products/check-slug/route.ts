import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await req.json();
    
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    await dbConnect();
    const existing = await Product.findOne({ slug });

    return NextResponse.json({ 
      available: !existing,
      message: existing ? "Product ID already initialized in matrix" : "ID available for deployment"
    });
  } catch (error) {
    console.error("Slug check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
