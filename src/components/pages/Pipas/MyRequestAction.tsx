'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cancelRequest, request } from './actions';
import { getBestGroup } from './utils';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { privateWaterTankerRequestView } from '@/db/privateViews';
import type { Group, listsSchema } from '@/lib/schemas';

const formSchema = z.object({
  group: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G'], {
    invalid_type_error: 'Grupo requerido',
    required_error: 'Grupo requerido',
  }),
  list: z.string({ required_error: 'Lista requerida' }),
});

interface Props {
  lists: z.infer<typeof listsSchema>;
  openRequest: typeof privateWaterTankerRequestView.$inferSelect | null;
}

const MyRequestAction: FC<Props> = ({ lists, openRequest }) => {
  const [isRemoving, setRemovingState] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      group: openRequest?.group as Group,
      list: openRequest?.list,
    },
    disabled: !!openRequest,
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!openRequest) {
      form.reset({ group: '' as Group, list: '' });
    }
  }, [openRequest]);

  useEffect(() => {
    setRemovingState(false);
  }, [lists]);

  useEffect(() => {
    const listName = form.watch('list');

    if (listName) {
      form.setValue('group', getBestGroup(lists, listName));
    }
  }, [form.watch('list')]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await request(lists[values.list].id, values.group);
  }

  function onRemove() {
    if (openRequest) {
      setRemovingState(true);
      cancelRequest(openRequest.uuid).finally(() => form.reset({ group: '' as Group, list: '' }));
    }
  }

  function onGoToList() {
    if (openRequest) {
      const listElement = document.querySelector(`[data-list-name="${openRequest.list}"]`);

      if (listElement) {
        window.scrollTo({
          behavior: 'smooth',
          top: listElement.getBoundingClientRect().top + window.scrollY - 100,
        });
      }
    }
  }

  return (
    <Card className="w-[405px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-2">
            <div className="flex flex-col">
              <CardTitle className="flex text-nowrap">{openRequest ? 'Casa anotada' : 'Anotar mi casa'}</CardTitle>
              <CardDescription className="flex">en la lista:</CardDescription>
            </div>
            <div className="flex flex-col items-end">
              <FormField
                control={form.control}
                name="list"
                render={({ field }) => (
                  <FormItem>
                    <Select disabled={!!openRequest} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una lista" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(lists).map((listName) => (
                          <SelectItem key={listName} value={listName}>
                            {listName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center gap-x-3">
                <span className="text-xs">en el grupo</span>
                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem>
                      <Select disabled={!!openRequest} onValueChange={field.onChange} value={form.watch('group')}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Grupo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter) => (
                            <SelectItem key={letter} value={letter}>
                              {letter}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          {!openRequest && (
            <CardFooter className="flex justify-center gap-x-4 mt-6">
              <CardAction>
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? (
                    <>
                      Anotándome <Loader2 className="animate-spin" />
                    </>
                  ) : (
                    'Anotarme'
                  )}
                </Button>
              </CardAction>
            </CardFooter>
          )}
        </form>
      </Form>
      {openRequest && (
        <CardFooter className="flex justify-center gap-x-4">
          <CardAction>
            <Button disabled={isRemoving} onClick={onGoToList} variant="outline">
              Ver lista
            </Button>
          </CardAction>
          <CardAction>
            <Button disabled={isRemoving} onClick={onRemove} variant="destructive">
              {isRemoving ? (
                <>
                  Quitándome <Loader2 className="animate-spin" />
                </>
              ) : (
                'Quitarme'
              )}
            </Button>
          </CardAction>
        </CardFooter>
      )}
    </Card>
  );
};

export default MyRequestAction;
