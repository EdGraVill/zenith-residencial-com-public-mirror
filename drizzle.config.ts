import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  dialect: 'postgresql',
  out: './supabase/migrations',
  schema: [
    './src/db/publicSchema.ts',
    './src/db/privateSchema.ts',
    './src/db/privateViews.ts',
    './src/db/hiddenSchema.ts',
  ],
});
