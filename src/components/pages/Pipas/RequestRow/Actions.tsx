import { Loader2, MessageSquareText } from 'lucide-react';
import { Fragment, useState } from 'react';
import type { FC, ReactNode } from 'react';
import type { z } from 'zod';

import { cancelRequest, completeRequest, moveRequestToList, moveRequestToWaterTanker } from '../actions';
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
import type { List, requestSchema, waterTankersSchema } from '@/lib/schemas';

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
  request: z.infer<typeof requestSchema>;
  waterTankers: z.infer<typeof waterTankersSchema>;
}

const Actions: FC<Props> = ({ currentUserId, isAdmin, waterTankers, request }) => {
  const [isLoading, setLoadingState] = useState(false);
  const [isCommentsOpen, setCommentsOpenStatus] = useState(false);
  const waterTankerNames = Object.keys(waterTankers);
  const actions: Actions = [];

  if (request.status === 'pending' && (isAdmin || request.house === currentUserId)) {
    actions.push({
      action: async () => {
        setLoadingState(true);
        await completeRequest(request.uuid);
        setLoadingState(false);
      },
      label: '✅ Completar',
    });
  }

  if (request.status === 'pending' && (isAdmin || request.house === currentUserId)) {
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

  if (request.isTesting || (request.status === 'pending' && request.house === currentUserId)) {
    actions.push({
      actions: waterTankerNames
        .filter((waterTankerName) => request.waterTankerName !== waterTankerName)
        .map((waterTankerName) => ({
          action: async () => {
            setLoadingState(true);
            await moveRequestToWaterTanker(waterTankers[waterTankerName].id, isAdmin ? request.uuid : undefined);
            setLoadingState(false);
          },
          label: waterTankerName,
        })),
      label: 'Mover a la pipa',
      topSeparator: true,
    } as GroupedActions);
  }

  if (request.status === 'pending' && (isAdmin || request.house === currentUserId)) {
    actions.push({
      actions: ['1', '2', '3', '4', '5', '6', '7']
        .filter((list) => list !== request.list)
        .map((list) => ({
          action: async () => {
            setLoadingState(true);
            await moveRequestToList(list as List, request.uuid);
            setLoadingState(false);
          },
          label: list,
          shortcut: `${waterTankers[request.waterTankerName].requests.filter((request) => request.list === list).length}`,
        })),
      label: 'Mover a la lista',
      topSeparator: true,
    } as GroupedActions);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-[90px]"
          disabled={isLoading}
          size={request.status === 'pending' ? 'default' : 'xs'}
          variant="outline"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Acciones'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {request.status !== 'pending' && (
          <>
            <DropdownMenuLabel className="text-[10px]">
              {request.status === 'cancelled' ? 'Cancelado' : 'Completado'} hace{' '}
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
