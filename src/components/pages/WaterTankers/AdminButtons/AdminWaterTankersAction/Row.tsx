'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, SquareMenu } from 'lucide-react';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { removeWaterTanker, updateWaterTanker } from '../../actions';
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
import type { waterTankerSchema } from '@/lib/schemas';

const formSchema = z.object({
  description: z.string().nonempty('La descripción es requerida'),
  name: z.string().nonempty('El nombre es requerido'),
});

interface Props {
  waterTanker: z.infer<typeof waterTankerSchema>;
}

const Row: FC<Props> = ({ waterTanker }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      description: waterTanker.description,
      name: waterTanker.name,
    },
    resolver: zodResolver(formSchema),
  });

  const onEdit = () => {
    form.reset({ description: waterTanker.description, name: waterTanker.name });
    setIsEditing(true);
  };

  const onCancel = () => {
    form.reset({ description: waterTanker.description, name: waterTanker.name });
    setIsEditing(false);
  };

  const onRemove = () => {
    setIsLoading(true);
    const response = confirm(
      '¿Estás seguro de que deseas eliminar la pipa? Esta acción no se puede deshacer. Además de que se eliminarán todas las solicitudes de prueba asociadas a esta pipa.',
    );

    if (!response) {
      setIsLoading(false);
      return;
    } else {
      removeWaterTanker(waterTanker.id);
    }
  };

  async function onSubmit() {
    setIsLoading(true);
    const result = await form.trigger();

    if (result) {
      const { name, description } = form.getValues();

      const newWaterTanker = await updateWaterTanker(waterTanker.id, name, description);

      if (newWaterTanker) {
        form.reset({ description: newWaterTanker.description, name: newWaterTanker.name });
      }
    }

    setIsLoading(false);
    setIsEditing(false);
  }

  if (isEditing) {
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
                  Guardar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCancel}>Cancelar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </Form>
    );
  }

  return (
    <TableRow>
      <TableCell>{waterTanker.name}</TableCell>
      <TableCell className="w-[227px]">
        <span className="text-balance">{waterTanker.description}</span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isLoading} size="xs" variant="outline">
              {isLoading ? <Loader2 className="animate-spin" /> : <SquareMenu />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={onRemove} variant="destructive">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default Row;
