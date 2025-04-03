'use client';

import { useState } from 'react';
import type { FC } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { privateNoticesTable } from '@/db/privateSchema';

interface Props {
  notices: Omit<typeof privateNoticesTable.$inferSelect, 'userId'>[];
}

const Notices: FC<Props> = ({ notices }) => {
  const [shouldShow, setShouldShow] = useState(true);

  const hide = () => {
    setShouldShow(false);
  };

  if (!shouldShow || notices.length === 0) {
    return null;
  }

  return (
    <aside className="my-8 flex flex-row gap-4 flex-wrap justify-center">
      <Card className="w-[405px] bg-orange-50 shadow-orange-200 border-orange-50 gap-y-0">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <Button className="invisible" onClick={hide} size="sm" variant="ghost">
              Ocultar
            </Button>
            <h2 className="text-center text-xl font-bold">Avisos</h2>
            <Button onClick={hide} size="sm" variant="ghost">
              Ocultar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="p-4 [&_a]:underline [&_a]:text-blue-500 [&_a]:hover:text-blue-600 text-balance break-words">
            {notices.map((notice) => (
              <li className="text-accent-foreground text-sm list-disc mt-4 first:mt-0" key={notice.id}>
                <Markdown rehypePlugins={[rehypeRaw]}>{notice.notice}</Markdown>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Notices;
