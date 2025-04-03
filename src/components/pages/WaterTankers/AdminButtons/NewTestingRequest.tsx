'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { addTestingRequest } from '../actions';
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
import type { List, waterTankersSchema } from '@/lib/schemas';

const formSchema = z.object({
  house: z.preprocess(
    (val) => parseInt(val as string, 10) || 0,
    z.number().min(1, 'La casa es requerida').max(171, 'La casa no puede ser mayor a 171'),
  ),
  list: z.enum(['1', '2', '3', '4', '5', '6', '7'], {
    invalid_type_error: 'Lista requerida',
    required_error: 'Lista requerida',
  }),
  waterTankerId: z.number({ required_error: 'La pipa es requerida' }),
});

interface Props {
  isAdmin: boolean;
  waterTankers: z.infer<typeof waterTankersSchema>;
}

const NewTestingRequest: FC<Props> = ({ isAdmin, waterTankers }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({ house: '' as unknown as number, list: '' as List, waterTankerId: '' as unknown as number });
  }, [isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addTestingRequest(values.house, values.waterTankerId, values.list);
      setIsOpen(false);
    } catch (error) {
      form.setError('house', { message: 'La casa ya está en una pipa' });
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
      <DialogContent className="sm:max-w-[425px] max-h-[100vh] overflow-y-auto">
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
                name="waterTankerId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Pipa</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} value={`${field.value}`}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una pipa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(waterTankers).map((waterTankerName) => (
                          <SelectItem key={waterTankerName} value={`${waterTankers[waterTankerName].id}`}>
                            {waterTankerName}
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
                name="list"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Lista</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
            <FormMessage />
            <DialogFooter className="mt-6 flex justify-end">
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? (
                  <>
                    Anotando <Loader2 className="animate-spin" />
                  </>
                ) : (
                  'Anotar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTestingRequest;
