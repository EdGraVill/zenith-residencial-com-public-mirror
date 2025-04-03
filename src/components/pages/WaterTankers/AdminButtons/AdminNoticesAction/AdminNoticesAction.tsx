import { type FC } from 'react';

import NewRow from './NewRow';
import Row from './Row';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { privateNoticesTable } from '@/db/privateSchema';

interface Props {
  isAdmin: boolean;
  notices: Omit<typeof privateNoticesTable.$inferSelect, 'userId'>[];
}

const AdminNoticesAction: FC<Props> = ({ isAdmin, notices }) =>
  isAdmin ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Administrar avisos</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Administrar avisos</DialogTitle>
          <DialogDescription>
            Crear, Editar o Eliminar avisos que se van a mostrar en la parte superior
          </DialogDescription>
        </DialogHeader>
        <Table className="border border-t-0">
          <TableHeader className="border border-black">
            <TableRow className="bg-black hover:bg-black">
              <TableHead className="text-center font-semibold text-white w-full">Aviso</TableHead>
              <TableHead className="text-center font-semibold text-white"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice) => (
              <Row key={notice.id} notice={notice} />
            ))}
            <NewRow />
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  ) : null;

export default AdminNoticesAction;
