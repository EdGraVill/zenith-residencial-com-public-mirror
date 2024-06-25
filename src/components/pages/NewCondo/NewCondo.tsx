'use client';

import TextInput from '@/components/UI/inputs/TextInput';
import { useRouter } from 'next/navigation';
import { useEffect, type FC } from 'react';
import { createCondo } from './actions';
import { useFormState } from 'react-dom';
import FormSubmitButton from '@/components/UI/inputs/FormSubmitButton';

const NewCondoPage: FC = () => {
  const [state, formAction] = useFormState(createCondo, {});
  const { push } = useRouter();

  useEffect(() => {
    if (state.condoId) {
      push(`/app/admin/condo/${state.condoId}`);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <h1>Nuevo condominio</h1>
      <TextInput labelText="Nombre" name="name" required={true} />
      <TextInput labelText="Descripción" name="description" />
      <h2>Medios de Contacto</h2>
      <TextInput labelText="Correo Electrónico" name="email" required={true} />
      <TextInput labelText="Teléfono" name="phone" required={true} />
      <TextInput labelText="Sitio web" name="website" />
      <h2>Contacto</h2>
      <TextInput labelText="Nombre" name="contactName" required={true} />
      <TextInput labelText="Correo Electrónico" name="contactEmail" required={true} />
      <TextInput labelText="Teléfono" name="contactPhone" required={true} />
      <h2>Servicios</h2>
      <TextInput labelText="Servicio" name="service" />
      <TextInput labelText="Servicio" name="service" />
      <TextInput labelText="Servicio" name="service" />
      {/* <h2>Entrada</h2>
      <TextInput labelText="" name="hasEntranceCoordinates" />
      <TextInput labelText="" name="entranceLat" />
      <TextInput labelText="" name="entranceLng" /> */}
      <h2>Dirección</h2>
      <TextInput labelText="Calle y número" name="address" required={true} />
      <TextInput labelText="Ciudad" name="city" required={true} />
      <TextInput labelText="Estado" name="state" required={true} />
      <TextInput labelText="País" name="country" required={true} />
      <TextInput labelText="Código Postal" name="postalCode" required={true} />
      <h2>Redes Sociales</h2>
      <TextInput labelText="Facebook" name="facebook" />
      <TextInput labelText="Instagram" name="instagram" />
      <TextInput labelText="LinkedIn" name="linkedin" />
      <TextInput labelText="X (Twitter)" name="twitter" />
      <FormSubmitButton />
      {state.errorMessage && <p>{state.errorMessage}</p>}
    </form>
  );
};

export default NewCondoPage;
