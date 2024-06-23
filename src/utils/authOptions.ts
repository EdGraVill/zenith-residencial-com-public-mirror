import Persona from '@/controllers/Persona/Persona.controller';
import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export interface AccountGoogleType {
  access_token: string;
  expires_at: number;
  id_token: string;
  provider: 'google';
  providerAccountId: string; // Unix timestamp in seconds
  scope: string;
  token_type: string;
  type: 'oauth';
}

export interface ProfileGoogleType {
  at_hash: string;
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: 'https://accounts.google.com';
  name: string;
  picture: string;
  sub: string;
}

export default {
  callbacks: {
    async signIn({ user, account, profile }) {
      await Persona.signInWithGoogle(user, account as AccountGoogleType, profile as ProfileGoogleType);

      return true;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
} as AuthOptions;
