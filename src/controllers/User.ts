import { eq } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

import { db } from '@/db';
import { privateAdminsTable, privateContactInformationTable } from '@/db/privateSchema';
import { publicUsersTable } from '@/db/publicSchema';
import { secret } from '@/lib/secret';

export default class User {
  public static async getUserByPhone(phoneP: string) {
    const [phone, passphrase] = phoneP.split(':');

    const contactInformationTable = await db
      .select()
      .from(privateContactInformationTable)
      .where(eq(privateContactInformationTable.phone, phone))
      .limit(1);

    if (contactInformationTable.length === 0) {
      throw new Error('User not found');
    }

    const usersTable = await db
      .select()
      .from(publicUsersTable)
      .where(eq(publicUsersTable.id, contactInformationTable[0].userId))
      .limit(1);

    if (usersTable.length === 0) {
      throw new Error('User not found');
    }
    const payload = {
      phone,
      userId: usersTable[0].id,
    };

    if (passphrase) {
      Reflect.set(payload, 'passphrase', passphrase);
    }

    const jwt = await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).sign(secret);

    const cookiesStorage = await cookies();

    cookiesStorage.set('jwt', jwt);

    return new User(usersTable[0].id, passphrase);
  }

  public static async getUserByCookies() {
    const cookiesStorage = await cookies();
    const jwt = cookiesStorage.get('jwt');

    if (!jwt?.value) {
      return null;
    }

    const { payload } = await jwtVerify(jwt.value, secret);

    const userId = Reflect.get(payload, 'userId') as number;
    const passphrase = (Reflect.get(payload, 'passphrase') as string) || undefined;

    if (!userId) {
      return null;
    }

    return new User(userId, passphrase);
  }

  // Temporary method to register user
  public static async register(phone: string, house: number) {
    await db.insert(privateContactInformationTable).values({ phone, userId: house });

    return new User(house);
  }

  constructor(
    public readonly id: number,
    private readonly passphrase?: string,
  ) {}

  public async myHouse() {
    const usersTable = await db.select().from(publicUsersTable).where(eq(publicUsersTable.id, this.id)).limit(1);

    if (usersTable.length === 0) {
      throw new Error('User not found');
    }

    const user = usersTable[0];

    return user.house;
  }

  // Temporary method to bypass
  public async canBypass() {
    const adminsTable = await db
      .select()
      .from(privateAdminsTable)
      .where(eq(privateAdminsTable.userId, this.id))
      .limit(1);

    if (!adminsTable.length) {
      return false;
    }

    if (adminsTable[0].userId === this.id && this.passphrase === 'z3nth') {
      return true;
    }

    return false;
  }
}
