import User from '../../../models/User';
import connectMongoDB from '../../../lib/mongodb'
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
        
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectMongoDB();
    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email or name already exists' }, { status: 400 });
    }

    await User.create({ name, email, password: hashedPassword });
    console.log("User created successfully");

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
