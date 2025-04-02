'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, SquareMenu } from 'lucide-react';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createWaterTanker } from '../../actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  description: z.string().nonempty('La descripción es requerida'),
  name: z.string().nonempty('El nombre es requerido'),
});

const NewRow: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      description: '',
      name: '',
    },
    resolver: zodResolver(formSchema),
  });

  const onCancel = () => {
    form.reset({ description: '', name: '' });
  };

  async function onSubmit() {
    setIsLoading(true);
    const result = await form.trigger();

    if (result) {
      const { name, description } = form.getValues();

      await createWaterTanker(name, description);

      form.reset({ description: '', name: '' });
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <TableRow>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <TableCell className="w-[100px]">
              <FormItem>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </TableCell>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <TableCell>
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Descripción" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </TableCell>
          )}
        />
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isLoading} size="xs" variant="outline">
                {isLoading ? <Loader2 className="animate-spin" /> : <SquareMenu />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled={!form.formState.isDirty} onClick={onSubmit}>
                Crear
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!form.formState.isDirty} onClick={onCancel}>
                Cancelar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </Form>
  );
};

export default NewRow;
