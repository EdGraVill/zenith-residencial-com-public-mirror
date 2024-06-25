import { useId, type DetailedHTMLProps, type FC, type InputHTMLAttributes } from 'react';

interface Props
  extends Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'type' | 'id'> {
  labelText: string;
  name: string;
}

const TextInput: FC<Props> = ({ labelText, name, ...inputProps }) => {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{labelText}</label>
      <input {...inputProps} id={id} name={name} type="text" />
    </div>
  );
};

export default TextInput;
