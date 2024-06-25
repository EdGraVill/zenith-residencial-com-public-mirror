'use client';

import type { FC } from 'react';
import { useFormStatus } from 'react-dom';

const FormSubmitButton: FC = () => {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      Enviar
    </button>
  );
};

export default FormSubmitButton;
