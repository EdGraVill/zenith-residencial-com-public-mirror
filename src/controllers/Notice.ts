import { asc, eq } from 'drizzle-orm';

import type User from './User';
import { db } from '@/db';
import { privateNoticesTable } from '@/db/privateSchema';

export default class Notice {
  public static async getNotices(): Promise<Omit<typeof privateNoticesTable.$inferSelect, 'userId'>[]> {
    const notices = await db
      .select()
      .from(privateNoticesTable)
      .where(eq(privateNoticesTable.isActive, true))
      .orderBy(asc(privateNoticesTable.createdAt));

    notices.forEach((notice) => {
      Reflect.deleteProperty(notice, 'userId');
    });

    return notices;
  }

  constructor(public readonly user: User) {}

  public async isAdmin() {
    return this.user.canBypass();
  }

  public async createNotice(notice: string) {
    const isAdmin = await this.isAdmin();

    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    const noticesTable = await db
      .insert(privateNoticesTable)
      .values({
        notice,
        userId: this.user.id,
      })
      .returning();

    return noticesTable[0];
  }

  public async updateNotice(id: number, notice: string) {
    const isAdmin = await this.isAdmin();

    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    const noticesTable = await db
      .update(privateNoticesTable)
      .set({
        notice,
        userId: this.user.id,
      })
      .where(eq(privateNoticesTable.id, id))
      .returning();

    return noticesTable[0];
  }

  public async removeNotice(id: number) {
    const isAdmin = await this.isAdmin();

    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    const noticesTable = await db
      .update(privateNoticesTable)
      .set({
        isActive: false,
      })
      .where(eq(privateNoticesTable.id, id))
      .returning();

    return noticesTable[0];
  }
}
