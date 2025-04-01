'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { auth } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  phone: z.string().min(10, 'El número de teléfono debe tener al menos 10 dígitos'),
});

const Auth: FC = () => {
  const { refresh } = useRouter();
  const [isLoading, setLoadingState] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      phone: '',
    },
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingState(true);
    auth(values.phone)
      .then((user) => {
        if (!user) {
          form.setError('phone', { message: 'El teléfono no está asociado a ninguna casa' });
        } else {
          refresh();
        }
      })
      .finally(() => setLoadingState(false));
  }

  return (
    <Card className="w-[350px] mx-auto my-20">
      <CardHeader>
        <CardTitle>Ingresar</CardTitle>
        <CardDescription>Para acceder, ingresa tu número de teléfono</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
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
            <FormMessage />
          </CardContent>
          <CardFooter className="mt-6 flex justify-end">
            <Button disabled={isLoading} type="submit">
              Ingresar {isLoading && <Loader2 className="animate-spin" />}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default Auth;
