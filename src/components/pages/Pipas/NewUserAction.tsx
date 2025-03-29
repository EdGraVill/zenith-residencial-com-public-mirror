'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { registerUser } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  house: z.preprocess(
    (val) => parseInt(val as string, 10),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingState(true);
    registerUser(values.phone, values.house).finally(() => {
      form.reset({ house: '' as unknown as number, phone: '' });
      setLoadingState(false);
    });
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Agregar usuario</CardTitle>
        <CardDescription>Asociar teléfono con casa</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="house"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UP</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormMessage />
          </CardContent>
          <CardFooter className="mt-6 flex justify-end">
            <Button disabled={isLoading} type="submit">
              Registrar {isLoading && <Loader2 className="animate-spin" />}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default NewUserAction;
