'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, SquareMenu } from 'lucide-react';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createNotice } from '../../actions';
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

const formSchema = z.object({
  noticeContent: z.string().nonempty('El aviso es requerido'),
});

const NewRow: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      noticeContent: '',
    },
    resolver: zodResolver(formSchema),
  });

  const onCancel = () => {
    form.reset({ noticeContent: '' });
  };

  async function onSubmit() {
    setIsLoading(true);
    const result = await form.trigger();

    if (result) {
      const { noticeContent } = form.getValues();

      await createNotice(noticeContent);

      form.reset({ noticeContent: '' });
    }

    setIsLoading(false);
  }

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
