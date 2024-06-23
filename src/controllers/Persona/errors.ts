import CommonError from '@/CommonError';
import type { PersonaType } from '@/db/Persona.model';

export class PersonaNotFound extends CommonError {
  constructor(personaId: PersonaType['id']) {
    super('Persona not found');

    this.name = 'PersonaNotFound';

    this.log(`Persona with id ${personaId} not found`, this);
  }
}

export class PersonaEmailNotFound extends CommonError {
  constructor(personaEmail: PersonaType['emailAddresses'][number]) {
    super('Persona not found');

    this.name = 'PersonaEmailNotFound';

    this.log(`Persona with email ${personaEmail} not found`, this);
  }
}

export class SessionNotFound extends CommonError {
  constructor() {
    super('Session not found');

    this.name = 'SessionNotFound';

    this.log(`Session not found`, this);
  }
}
