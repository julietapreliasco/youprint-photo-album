import { NextRequest, NextResponse } from 'next/server';
import { ObjectSchema } from 'joi';

const validateRequest = (schema: ObjectSchema) => {
  return async (req: NextRequest) => {
    const body = await req.json();
    const { error } = schema.validate(body);

    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }
    return NextResponse.next();
  };
};

export default validateRequest;
