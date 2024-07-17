import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET),
};

export const isAuthenticated = async (req: NextRequest): Promise<boolean> => {
  let token =
    req.headers.get('authorization') || req.headers.get('Authorization');

  if (!token) {
    return false;
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    const { payload } = await jwtVerify(token, jwtConfig.secret);

    if (payload && payload.id) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('isAuthenticated error: ', error);
    return false;
  }
};
