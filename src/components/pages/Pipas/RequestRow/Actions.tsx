import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquareText } from 'lucide-react';
import { Fragment, useState } from 'react';
import type { FC, ReactNode } from 'react';
import type { z } from 'zod';

import { cancelRequest, completeRequest, moveRequest } from '../actions';
import Comments from './Comments';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { listsSchema, requestSchema } from '@/lib/schemas';

interface Action {
  action: () => void;
  bottomSeparator?: boolean;
  label: string;
  shortcut?: ReactNode;
  topSeparator?: boolean;
}

interface GroupedActions {
  actions: Action[];
  label: string;
}

type Actions = Array<Action | GroupedActions>;

interface Props {
  currentUserId: number;
  isAdmin: boolean;
  lists: z.infer<typeof listsSchema>;
  request: z.infer<typeof requestSchema>;
}

const Actions: FC<Props> = ({ currentUserId, isAdmin, lists, request }) => {
  const [isCommentsOpen, setCommentsOpenStatus] = useState(false);
  const listNames = Object.keys(lists);
  const actions: Actions = [];

  if (request.requestStatus === 'pending' && (isAdmin || request.house === currentUserId)) {
    actions.push({
      action: () => completeRequest(request.uuid),
      label: '✅ Completar',
    });
  }

  if (request.requestStatus === 'pending' && (isAdmin || request.house === currentUserId)) {
    actions.push({
      action: () => cancelRequest(request.uuid),
      label: '❌ Cancelar',
    });
  }

  actions.push({
    action: () => setCommentsOpenStatus(true),
    label: 'Ver comentarios',
    shortcut: (
      <span className="flex flex-row text-sm items-center">
        {request.comments.filter(({ author }) => author).length} <MessageSquareText />
      </span>
    ),
    topSeparator: true,
  });

  if (request.requestStatus === 'pending' && request.house === currentUserId) {
    actions.push({
      actions: listNames.map((name) => ({
        action: () => moveRequest(lists[name].id),
        label: name,
      })),
      label: 'Mover a',
      topSeparator: true,
    } as GroupedActions);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={request.requestStatus === 'pending' ? 'default' : 'xs'} variant="outline">
          Acciones
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {request.requestStatus !== 'pending' && (
          <>
            <DropdownMenuLabel className="text-[10px]">
              {request.requestStatus === 'cancelled' ? 'Cancelado' : 'Completado'} hace{' '}
              {formatDistanceToNow(request.updatedAt, { locale: es })}
            </DropdownMenuLabel>
          </>
        )}
        {actions.map((action, ix) =>
          'actions' in action ? (
            <DropdownMenuSub key={ix}>
              <DropdownMenuSubTrigger>{action.label}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {action.actions.map((subAction, sIx) => (
                    <Fragment key={sIx}>
                      {subAction.topSeparator && <DropdownMenuSeparator />}
                      <DropdownMenuItem onClick={subAction.action}>
                        {subAction.label}
                        {subAction.shortcut && <DropdownMenuShortcut>{subAction.shortcut}</DropdownMenuShortcut>}
                      </DropdownMenuItem>
                      {subAction.bottomSeparator && <DropdownMenuSeparator />}
                    </Fragment>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ) : (
            <Fragment key={ix}>
              {action.topSeparator && <DropdownMenuSeparator />}
              <DropdownMenuItem onClick={action.action}>
                {action.label}
                {action.shortcut && <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>}
              </DropdownMenuItem>
              {action.bottomSeparator && <DropdownMenuSeparator />}
            </Fragment>
          ),
        )}
      </DropdownMenuContent>

      <Comments
        currentUserId={currentUserId}
        isOpen={isCommentsOpen}
        request={request}
        setOpenState={setCommentsOpenStatus}
      />
    </DropdownMenu>
  );
};

export default Actions;
