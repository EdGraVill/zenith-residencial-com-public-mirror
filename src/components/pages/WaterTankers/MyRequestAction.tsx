'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cancelRequest, completeRequest, createRequest } from './actions';
import { getBestList } from './utils';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { privateWaterTankerRequestView } from '@/db/privateViews';
import type { List, waterTankersSchema } from '@/lib/schemas';

const formSchema = z.object({
  list: z.enum(['1', '2', '3', '4', '5', '6', '7'], {
    invalid_type_error: 'Lista requerida',
    required_error: 'Lista requerida',
  }),
  waterTankerName: z.string({ required_error: 'Pipa requerida' }),
});

interface Props {
  openRequest: typeof privateWaterTankerRequestView.$inferSelect | null;
  waterTankers: z.infer<typeof waterTankersSchema>;
}

const MyRequestAction: FC<Props> = ({ openRequest, waterTankers }) => {
  const [isRemoving, setRemovingState] = useState(false);
  const [isCompleting, setCompletingState] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      list: openRequest?.list as List,
      waterTankerName: openRequest?.waterTankerName,
    },
    disabled: !!openRequest,
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!openRequest) {
      form.reset({ list: '' as List, waterTankerName: '' });
    }
  }, [openRequest]);

  useEffect(() => {
    setRemovingState(false);
    setCompletingState(false);
  }, [waterTankers]);

  useEffect(() => {
    const waterTankerName = form.watch('waterTankerName');

    if (waterTankerName) {
      form.setValue('list', getBestList(waterTankers, waterTankerName));
    }
  }, [form.watch('waterTankerName')]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createRequest(waterTankers[values.waterTankerName].id, values.list);
  }

  function onRemove() {
    if (openRequest) {
      setRemovingState(true);
      cancelRequest(openRequest.uuid).finally(() => form.reset({ list: '' as List, waterTankerName: '' }));
    }
  }

  function onComplete() {
    if (openRequest) {
      setCompletingState(true);
      completeRequest(openRequest.uuid).finally(() => form.reset({ list: '' as List, waterTankerName: '' }));
    }
  }

  function onScrollToRequest() {
    if (openRequest) {
      const requestRow = document.getElementById(openRequest.uuid);

      if (requestRow) {
        window.scrollTo({
          behavior: 'smooth',
          top: requestRow.getBoundingClientRect().top + window.scrollY - 166,
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
              <CardDescription className="flex">en la pipa:</CardDescription>
            </div>
            <div className="flex flex-col items-end">
              <FormField
                control={form.control}
                name="waterTankerName"
                render={({ field }) => (
                  <FormItem>
                    <Select disabled={!!openRequest} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una pipa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(waterTankers).map((waterTankerName) => (
                          <SelectItem key={waterTankerName} value={waterTankerName}>
                            {waterTankerName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center gap-x-3">
                <span className="text-xs">en la lista</span>
                <FormField
                  control={form.control}
                  name="list"
                  render={({ field }) => (
                    <FormItem>
                      <Select disabled={!!openRequest} onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Lista" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['1', '2', '3', '4', '5', '6', '7'].map((list) => (
                            <SelectItem key={list} value={list}>
                              {list}
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
            <Button disabled={isCompleting || isRemoving} onClick={onRemove} variant="destructive">
              {isRemoving ? (
                <>
                  Quitándome <Loader2 className="animate-spin" />
                </>
              ) : (
                'Quitarme'
              )}
            </Button>
          </CardAction>
          <CardAction>
            <Button disabled={isCompleting || isRemoving} onClick={onScrollToRequest} variant="outline">
              Ver solicitud
            </Button>
          </CardAction>
          <CardAction>
            <Button
              className="bg-teal-400 text-teal-950 hover:bg-teal-300"
              disabled={isCompleting || isRemoving}
              onClick={onComplete}
            >
              {isCompleting ? (
                <>
                  Completando <Loader2 className="animate-spin" />
                </>
              ) : (
                'Completar'
              )}
            </Button>
          </CardAction>
        </CardFooter>
      )}
    </Card>
  );
};

export default MyRequestAction;
