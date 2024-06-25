import type { PersonaType } from '@/db/Persona.model';
import { AccessTypeEnum, LoginTypeEnum, PersonaSharableInfoEnum, getPersonaModel } from '@/db/Persona.model';
import { CommonController } from '../CommonControllers';
import type { CommonDocumentType } from '@/db/commonSchemas';
import { PersonaEmailNotFound, PersonaNotFound, SessionNotFound } from './errors';
import { getServerSession, type User } from 'next-auth';
import type { AccountGoogleType, ProfileGoogleType } from '@/utils/authOptions';
import authOptions from '@/utils/authOptions';
import { isOneOf } from '@/utils/is';
import { redirect } from 'next/navigation';
import assert from '@/utils/assert';

export type PersonaDocumentType = CommonDocumentType<PersonaType>;

export default class Persona extends CommonController<PersonaType> {
  private static readonly model = getPersonaModel();

  public static async getById(id: PersonaType['id']) {
    const persona = await this.dbManipulation(() => this.model.findById<PersonaDocumentType>(id));

    assert(persona, () => new PersonaNotFound(id));

    return new Persona(persona);
  }

  public static async getByEmail(email: PersonaType['emailAddresses'][number]) {
    const persona = await this.dbManipulation(() =>
      this.model.findOne<PersonaDocumentType>({
        $or: [
          {
            emailAddresses: email,
          },
          {
            'oAuthConnection.google.emailAddressAssociated': email,
          },
        ],
      }),
    );

    assert(persona, () => new PersonaEmailNotFound(email));

    return new Persona(persona);
  }

  public static async getWithCurrentSession(): Promise<Persona>;
  public static async getWithCurrentSession(fail: true): Promise<Persona>;
  public static async getWithCurrentSession(fail: false): Promise<Persona | null>;
  public static async getWithCurrentSession(fail = true) {
    const session = await getServerSession(authOptions);

    if (fail) {
      assert(session?.user?.email, () => new SessionNotFound());

      return this.getByEmail(session.user.email);
    }

    if (!session?.user?.email) {
      return null;
    }

    return this.getByEmail(session.user.email);
  }

  public static async getWithCurrentSessionOrSignIn(currentUrl: string) {
    const persona = await this.getWithCurrentSession(false);

    if (persona) {
      return persona;
    }

    redirect(`/api/auth/signin/google?callbackUrl=${currentUrl}`);
  }

  public static async signInWithGoogle(user: User, account: AccountGoogleType, profile: ProfileGoogleType) {
    const persona = await this.dbManipulation(() =>
      this.model.findOne<PersonaDocumentType>({
        $or: [
          {
            emailAddresses: user.email,
          },
          {
            'oAuthConnection.google.emailAddressAssociated': user.email,
          },
        ],
      }),
    );

    if (!persona) {
      // TODO: const avatar = await proceseAvatarFromGoogle(profile.picture);

      const newPersona = await this.dbManipulation(() =>
        this.model.create({
          accessType: AccessTypeEnum.ON_HOLD,
          emailAddresses: [user.email],
          firstName: profile.given_name,
          lastName: profile.family_name,
          // TODO: images: [avatar],
          oAuthConnection: {
            google: {
              emailAddressAssociated: user.email,
              expirationDate: new Date(account.expires_at * 1000),
              token: `${account.token_type} ${account.id_token}`,
            },
          },
          primaryAuthMethod: LoginTypeEnum.OAUTH,
          primaryEmailAddress: user.email,
          // TODO: profilePictureId: avatar.id,
          sharedInfo: [
            PersonaSharableInfoEnum.FIRST_NAME,
            PersonaSharableInfoEnum.LAST_NAME,
            PersonaSharableInfoEnum.PRIMARY_EMAIL_ADDRESS,
          ],
        }),
      );

      return new Persona(newPersona as unknown as PersonaDocumentType);
    }

    return new Persona(persona);
  }

  public hasAccessOrRedirect(accessTypes: AccessTypeEnum[] | readonly AccessTypeEnum[], redirectUrl = '..') {
    if (isOneOf(this.document.accessType, accessTypes)) {
      return;
    }

    redirect(redirectUrl);
  }
}
