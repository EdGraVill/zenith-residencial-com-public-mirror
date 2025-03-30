import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow, subHours } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { addComment } from '../actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { requestSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';

const forbiddenWords = [
  'pinche',
  'pendejo',
  'pendeja',
  'pendejos',
  'pendejas',
  'pendejito',
  'pendejita',
  'puto',
  'puta',
  'chingaderas',
  'chingada',
];

const commentFormSchema = z.object({
  comment: z.string().nonempty('El comentario es requerido'),
});

interface Props {
  currentUserId: number;
  isOpen: boolean;
  request: z.infer<typeof requestSchema>;
  setOpenState: Dispatch<SetStateAction<boolean>>;
}

export const Comments: FC<Props> = ({ currentUserId, isOpen, request, setOpenState }) => {
  const form = useForm<z.infer<typeof commentFormSchema>>({
    defaultValues: {
      comment: '',
    },
    resolver: zodResolver(commentFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof commentFormSchema>) => {
    await addComment(values.comment, request.uuid);
    form.reset({ comment: '' });
  };

  return (
    <Dialog onOpenChange={setOpenState} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comentarios sobre la casa {request.house}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 my-8">
          {request.comments
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            .map(({ author, comment, createdAt, id }) => (
              <div
                className={cn('flex flex-row gap-2 items-start', {
                  'self-end pl-16': currentUserId === author,
                  'self-start pr-16': currentUserId !== author,
                })}
                key={id}
              >
                {currentUserId !== author && <span className="text-xs text-muted-foreground">{author}:</span>}
                <span className="text-sm bg-accent py-2 px-4">
                  {comment.replace(new RegExp(`${forbiddenWords.join('|')}`, 'g'), '🤬')}
                  <span className="block w-full text-end text-[8px]">
                    {formatDistanceToNow(subHours(createdAt, 6), { addSuffix: true, locale: es })}
                  </span>
                </span>
                {currentUserId === author && <span className="text-xs text-muted-foreground">:Tú</span>}
              </div>
            ))}
        </div>
        <DialogFooter>
          <Form {...form}>
            <form className="w-full flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Escribe tu comentario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="self-end" disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Comments;
