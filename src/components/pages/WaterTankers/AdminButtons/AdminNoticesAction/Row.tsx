'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, SquareMenu } from 'lucide-react';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { removeNotice, updateNotice } from '../../actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { TableCell, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import type { privateNoticesTable } from '@/db/privateSchema';

const formSchema = z.object({
  noticeContent: z.string().nonempty('El aviso es requerido'),
});

interface Props {
  notice: Omit<typeof privateNoticesTable.$inferSelect, 'userId'>;
}

const Row: FC<Props> = ({ notice }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      noticeContent: notice.notice,
    },
    resolver: zodResolver(formSchema),
  });

  const onEdit = () => {
    form.reset({ noticeContent: notice.notice });
    setIsEditing(true);
  };

  const onCancel = () => {
    form.reset({ noticeContent: notice.notice });
    setIsEditing(false);
  };

  const onRemove = () => {
    setIsLoading(true);
    const response = confirm('¿Estás seguro de que deseas eliminar el aviso?');

    if (!response) {
      setIsLoading(false);
      return;
    } else {
      removeNotice(notice.id);
    }
  };

  async function onSubmit() {
    setIsLoading(true);
    const result = await form.trigger();

    if (result) {
      const { noticeContent } = form.getValues();

      const newWaterTanker = await updateNotice(notice.id, noticeContent);

      if (newWaterTanker) {
        form.reset({ noticeContent: notice.notice });
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
            name="noticeContent"
            render={({ field }) => (
              <TableCell>
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Aviso" {...field} />
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
      <TableCell>{notice.notice}</TableCell>
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
