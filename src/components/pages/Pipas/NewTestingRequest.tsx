'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { addTestingRequest } from './actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Group, listsSchema } from '@/lib/schemas';

const formSchema = z.object({
  group: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G'], {
    invalid_type_error: 'Grupo requerido',
    required_error: 'Grupo requerido',
  }),
  house: z.preprocess(
    (val) => parseInt(val as string, 10) || 0,
    z.number().min(1, 'La casa es requerida').max(171, 'La casa no puede ser mayor a 171'),
  ),
  listId: z.number({ required_error: 'La lista es requerida' }),
});

interface Props {
  isAdmin: boolean;
  lists: z.infer<typeof listsSchema>;
}

const NewTestingRequest: FC<Props> = ({ isAdmin, lists }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({ group: '' as Group, house: '' as unknown as number, listId: '' as unknown as number });
  }, [isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addTestingRequest(values.house, values.listId, values.group);
      setIsOpen(false);
    } catch (error) {
      form.setError('house', { message: 'La casa ya está en una lista' });
    }
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Agregar prueba</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar solicitud de prueba</DialogTitle>
          <DialogDescription>Crear una solicitud de prueba en nombre de otra casa</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-row gap-4 items-start">
              <FormField
                control={form.control}
                name="house"
                render={({ field }) => (
                  <FormItem className="max-w-[80px]">
                    <FormLabel>UP</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="listId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Lista</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} value={`${field.value}`}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una lista" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(lists).map((listName) => (
                          <SelectItem key={listName} value={`${lists[listName].id}`}>
                            {listName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Grupo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
            <FormMessage />
            <DialogFooter className="mt-6 flex justify-end">
              <Button disabled={form.formState.isSubmitting} type="submit">
                Anotar {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTestingRequest;
