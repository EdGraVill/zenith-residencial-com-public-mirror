import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ChangeEvent } from 'react';

export interface EditableTextState {
  editingValue: string;
  error?: string;
  isEditing: boolean;
  isSyncing: boolean;
  syncedValue: string;
}

export const setEditableTextInitialState = (initialValue: string): EditableTextState => ({
  editingValue: initialValue,
  error: undefined,
  isEditing: false,
  isSyncing: false,
  syncedValue: initialValue,
});

export const { reducer: EditableTextReducer, actions: EditableTextActions } = createSlice({
  initialState: setEditableTextInitialState(''),
  name: 'EditableText',
  reducers: {
    onChangeValue(state, action: PayloadAction<ChangeEvent<HTMLInputElement>>) {
      state.editingValue = action.payload.target.value;
    },
    startEditing(state) {
      state.isEditing = true;
    },
    stopEditing(state) {
      state.isEditing = false;
      state.editingValue = state.syncedValue;
    },
    syncValueFailure(state) {
      state.isSyncing = false;
      state.error = 'No se actualizó';
    },
    syncValuePending(state) {
      state.isSyncing = true;
    },
    syncValueSuccess(state, action: PayloadAction<string>) {
      state.isSyncing = false;
      state.isEditing = false;
      state.syncedValue = action.payload;
      state.editingValue = action.payload;
      state.error = undefined;
    },
  },
});
