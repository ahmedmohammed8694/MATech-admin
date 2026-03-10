import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    // Basic validation
    if (!body.name || !body.slug || !body.price || !body.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await Product.create(body);

    return NextResponse.json({ 
      message: "Product entity initialized in global matrix", 
      product 
    }, { status: 201 });
  } catch (error: any) {
    console.error("Admin product creation error:", error);
    
    // Improved MongoDB unique constraint error handling
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({ 
        error: `Matrix Collision: ${field === 'slug' ? 'Product ID (Slug)' : 'Field'} already exists.`,
        code: "DUPLICATE_ENTITY"
      }, { status: 400 });
    }

    return NextResponse.json({ error: "Matrix initialization failure" }, { status: 500 });
  }
}
