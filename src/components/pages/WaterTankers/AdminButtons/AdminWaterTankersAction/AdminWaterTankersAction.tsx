import { type FC } from 'react';
import type { z } from 'zod';

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
import type { waterTankersSchema } from '@/lib/schemas';

interface Props {
  isAdmin: boolean;
  waterTankers: z.infer<typeof waterTankersSchema>;
}

const AdminWaterTankersAction: FC<Props> = ({ isAdmin, waterTankers }) =>
  isAdmin ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Administrar pipas</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Administrar pipas</DialogTitle>
          <DialogDescription>Crear, Editar o Eliminar pipas</DialogDescription>
        </DialogHeader>
        <Table className="border border-t-0">
          <TableHeader className="border border-black">
            <TableRow className="bg-black hover:bg-black">
              <TableHead className="text-center font-semibold text-white">Nombre</TableHead>
              <TableHead className="text-center font-semibold text-white">Descripción</TableHead>
              <TableHead className="text-center font-semibold text-white"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(waterTankers).map((waterTankerName) => (
              <Row key={waterTankers[waterTankerName].id} waterTanker={waterTankers[waterTankerName]} />
            ))}
            <NewRow />
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  ) : null;

export default AdminWaterTankersAction;
