'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createList } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  description: z.string().nonempty('La descripción es requerida'),
  name: z.string().nonempty('El nombre es requerido'),
});

interface Props {
  isAdmin: boolean;
}

const NewListAction: FC<Props> = ({ isAdmin }) => {
  const [isLoading, setLoadingState] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      description: '',
      name: '',
    },
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingState(true);
    createList(values.name, values.description).finally(() => {
      form.reset({ description: '', name: '' });
      setLoadingState(false);
    });
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Crear lista</CardTitle>
        <CardDescription>Diferente proveedor de Pipa</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
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
              Crear {isLoading && <Loader2 className="animate-spin" />}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default NewListAction;
