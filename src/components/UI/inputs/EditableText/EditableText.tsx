'use client';

import { useReducer, type FC } from 'react';
import { EditableTextActions, EditableTextReducer, setEditableTextInitialState } from './reducer';
import Controls from './Controls';

interface Props {
  children: string;
  onCanceled?(): void;
  onUpdate(newValue: string): Promise<string>;
}

const EditableText: FC<Props> = ({ children, onCanceled, onUpdate }) => {
  const [state, dispatch] = useReducer(EditableTextReducer, setEditableTextInitialState(children));

  const onAccept = async () => {
    if (state.editingValue !== state.syncedValue) {
      dispatch(EditableTextActions.syncValuePending());

      try {
        const newValue = await onUpdate(state.editingValue);
        dispatch(EditableTextActions.syncValueSuccess(newValue));
      } catch (error) {
        dispatch(EditableTextActions.syncValueFailure());
      }
    } else {
      dispatch(EditableTextActions.stopEditing());
    }
  };

  if (!state.isEditing) {
    return (
      <div className="flex flex-row items-center gap-x-2">
        {state.syncedValue}
        <Controls dispatch={dispatch} onAccept={onAccept} onCanceled={onCanceled} state={state} />
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-x-2">
      <input
        autoFocus={true}
        className="overflow-ellipsis border-b border-t border-b-black border-t-transparent bg-zinc-100 px-3 py-1 focus:outline-none"
        onChange={(event) => dispatch(EditableTextActions.onChangeValue(event))}
        value={state.editingValue}
      />
      <Controls dispatch={dispatch} onAccept={onAccept} onCanceled={onCanceled} state={state} />
    </div>
  );
};

export default EditableText;
