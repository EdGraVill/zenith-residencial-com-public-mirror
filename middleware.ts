import { ipAddress } from '@vercel/functions';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse, userAgent } from 'next/server';

import { db } from '@/db';
import { hiddenAccessHRTable } from '@/db/hiddenSchema';
import { secret } from '@/lib/secret';

export const config = {
  matcher: '/pipas',
};

export async function middleware(request: NextRequest) {
  const ua = userAgent(request);
  const ip = ipAddress(request);
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;
  let phone: string | undefined;
  let userId: number | undefined;

  if (jwt) {
    const { payload } = await jwtVerify(jwt, secret);

    phone = Reflect.get(payload, 'phone') as string;
    userId = parseInt(Reflect.get(payload, 'userId') as string, 10) || undefined;
  }

  db.insert(hiddenAccessHRTable).values({
    clientUserAgent: ua,
    ip,
    phone,
    userId,
  });

  return NextResponse.next();
}
