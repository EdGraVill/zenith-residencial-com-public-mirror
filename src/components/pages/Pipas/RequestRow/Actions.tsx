import { Loader2, MessageSquareText } from 'lucide-react';
import { Fragment, useState } from 'react';
import type { FC, ReactNode } from 'react';
import type { z } from 'zod';

import { cancelRequest, completeRequest, moveRequest, moveRequestToGroup } from '../actions';
import Comments from './Comments';
import RelativeTimeToNow from '@/components/common/RelativeTimeToNow';
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
  bottomSeparator?: boolean;
  label: string;

  topSeparator?: boolean;
}

type Actions = Array<Action | GroupedActions>;

interface Props {
  currentUserId: number;
  isAdmin: boolean;
  lists: z.infer<typeof listsSchema>;
  request: z.infer<typeof requestSchema>;
}

const Actions: FC<Props> = ({ currentUserId, isAdmin, lists, request }) => {
  const [isLoading, setLoadingState] = useState(false);
  const [isCommentsOpen, setCommentsOpenStatus] = useState(false);
  const listNames = Object.keys(lists);
  const actions: Actions = [];

  if (request.requestStatus === 'pending' && (isAdmin || request.house === currentUserId)) {
    actions.push({
      action: async () => {
        setLoadingState(true);
        await completeRequest(request.uuid);
        setLoadingState(false);
      },
      label: '✅ Completar',
    });
  }

  if (request.requestStatus === 'pending' && (isAdmin || request.house === currentUserId)) {
    actions.push({
      action: async () => {
        setLoadingState(true);
        await cancelRequest(request.uuid);
        setLoadingState(false);
      },
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

  if (request.isTesting || (request.requestStatus === 'pending' && request.house === currentUserId)) {
    actions.push({
      actions: listNames
        .filter((listName) => request.list !== listName)
        .map((name) => ({
          action: async () => {
            setLoadingState(true);
            await moveRequest(lists[name].id, isAdmin ? request.uuid : undefined);
            setLoadingState(false);
          },
          label: name,
        })),
      label: 'Mover a la lista',
      topSeparator: true,
    } as GroupedActions);
  }

  if (request.requestStatus === 'pending' && (isAdmin || request.house === currentUserId)) {
    actions.push({
      actions: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        .filter((group) => group !== request.group)
        .map((letter) => ({
          action: async () => {
            setLoadingState(true);
            await moveRequestToGroup(letter, request.uuid);
            setLoadingState(false);
          },
          label: letter,
          shortcut: `(${lists[request.list].list.filter(({ group }) => group === letter).length})`,
        })),
      label: 'Mover al grupo',
      topSeparator: true,
    } as GroupedActions);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-[90px]"
          disabled={isLoading}
          size={request.requestStatus === 'pending' ? 'default' : 'xs'}
          variant="outline"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Acciones'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {request.requestStatus !== 'pending' && (
          <>
            <DropdownMenuLabel className="text-[10px]">
              {request.requestStatus === 'cancelled' ? 'Cancelado' : 'Completado'} hace{' '}
              {<RelativeTimeToNow date={request.updatedAt} />}
            </DropdownMenuLabel>
          </>
        )}
        {actions.map((action, ix) =>
          'actions' in action ? (
            <Fragment key={ix}>
              {action.topSeparator && <DropdownMenuSeparator />}
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
              {action.bottomSeparator && <DropdownMenuSeparator />}
            </Fragment>
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
