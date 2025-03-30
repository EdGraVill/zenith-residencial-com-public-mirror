'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { registerUser } from './actions';
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

const formSchema = z.object({
  house: z.preprocess(
    (val) => parseInt(val as string, 10) || 0,
    z.number().min(1, 'La casa es requerida').max(171, 'La casa no puede ser mayor a 171'),
  ),
  phone: z
    .string()
    .min(10, 'El número de teléfono debe tener al menos 10 dígitos')
    .max(10, 'El número de teléfono no puede tener más de 10 dígitos'),
});

interface Props {
  isAdmin: boolean;
}

const NewUserAction: FC<Props> = ({ isAdmin }) => {
  const [isLoading, setLoadingState] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({ house: '' as unknown as number, phone: '' });
  }, [isOpen]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingState(true);
    registerUser(values.phone, values.house).finally(() => {
      setLoadingState(false);
      setIsOpen(false);
    });
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Agregar usuario</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar usuario</DialogTitle>
          <DialogDescription>Asociar teléfono con casa</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-row gap-4">
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
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormMessage />
            <DialogFooter className="mt-6 flex justify-end">
              <Button disabled={isLoading} type="submit">
                Registrar {isLoading && <Loader2 className="animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserAction;
