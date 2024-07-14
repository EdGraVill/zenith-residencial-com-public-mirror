'use client';

import { useEffect, useId, useState, type Dispatch, type FC } from 'react';
import type { EditableTextState } from './reducer';
import { EditableTextActions } from './reducer';
import type { UnknownAction } from '@reduxjs/toolkit';
import IconButton from '../IconButton';
import { CheckIcon, ClipboardIcon, CrossIcon, WarningTriangleIcon, WriteIcon } from '../../feedback/Icons';
import { CircleLoading } from '../../feedback/Loadings';
import { Tooltip } from 'react-tooltip';

interface Props {
  dispatch: Dispatch<UnknownAction>;
  onAccept(): void;
  onCanceled?(): void;
  state: EditableTextState;
}

const Controls: FC<Props> = ({ dispatch, onAccept, onCanceled, state }) => {
  const errorTooltipId = useId();
  const copyTooltipId = useId();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  const startEditing = () => {
    dispatch(EditableTextActions.startEditing());
  };

  const stopEditing = () => {
    onCanceled?.();
    dispatch(EditableTextActions.stopEditing());
  };

  const onCopyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(state.syncedValue);
      setCopied(true);
    }
  };

  if (state.isEditing) {
    return (
      <div className="flex flex-1 flex-row items-center gap-x-2">
        <IconButton disabled={state.isSyncing} key="accept" onClick={onAccept} title="Aceptar">
          <CheckIcon />
        </IconButton>
        <IconButton disabled={state.isSyncing} key="cancel" onClick={stopEditing} title="Cancelar">
          <CrossIcon />
        </IconButton>
        {state.isSyncing && <CircleLoading className="aspect-square h-8" />}
        {state.error && (
          <WarningTriangleIcon
            className="aspect-square h-8 stroke-red-400 text-red-400"
            data-tooltip-id={errorTooltipId}
          />
        )}
        {state.error && (
          <Tooltip id={errorTooltipId} place="bottom">
            {state.error}
          </Tooltip>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-row items-center gap-x-2">
      <IconButton key="edit" onClick={startEditing} title="Editar">
        <WriteIcon />
      </IconButton>
      <IconButton
        className="stroke-1"
        data-tooltip-id={copyTooltipId}
        key="copy"
        onClick={onCopyText}
        title="Copiar al portapapeles"
      >
        <ClipboardIcon />
      </IconButton>
      <Tooltip id={copyTooltipId} isOpen={copied} place="bottom">
        Copiado
      </Tooltip>
    </div>
  );
};

export default Controls;
