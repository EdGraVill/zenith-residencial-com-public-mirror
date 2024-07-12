'use client';

import { useState, type FC } from 'react';

interface Props {
  initialValue: string;
  intent(newValue: string): Promise<string>;
}

const EditableText: FC<Props> = ({ initialValue, intent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previousValue, setPreviousValue] = useState(initialValue);
  const [editingValue, setEditingValue] = useState(initialValue);
  const [displayValue, setDisplayValue] = useState(initialValue);

  const onCancel = () => {
    setEditingValue(previousValue);
    setDisplayValue(previousValue);
    setIsEditing(false);
  };

  const onAccept = async () => {
    setIsLoading(true);

    try {
      setDisplayValue(editingValue);
      const newValue = await intent(editingValue);
      setPreviousValue(newValue);
      setDisplayValue(newValue);
      setEditingValue(newValue);
    } catch (error) {
      setEditingValue(previousValue);
      setDisplayValue(previousValue);
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return <span onDoubleClick={() => setIsEditing((prev) => !prev)}>{displayValue}</span>;
  }

  return (
    <label>
      <input onChange={(event) => setEditingValue(event.target.value)} value={editingValue} />
      <button disabled={isLoading} onClick={onAccept}>
        ✅
      </button>
      <button disabled={isLoading} onClick={onCancel}>
        ❌
      </button>
    </label>
  );
};

export default EditableText;
