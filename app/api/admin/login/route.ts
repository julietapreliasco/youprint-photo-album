import { NextRequest, NextResponse } from 'next/server';
import User from '../../models/user';
import jwt from 'jsonwebtoken';
import connectDB from '../../config/db';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
