import { NextRequest, NextResponse } from 'next/server';
import User from '../../models/user';
import connectDB from '../../config/db';
import { SignJWT } from 'jose';

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
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: user._id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
