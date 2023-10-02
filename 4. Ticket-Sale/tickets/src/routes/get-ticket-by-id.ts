import express, { Request, Response } from 'express';

import { NotFoundError } from '@abticketsale/common';

import { Ticket } from '../models/ticket-model';

const router = express.Router();

router.get('/api/tickets/:ticketId', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.ticketId);
  if (!ticket) throw new NotFoundError();

  return res.status(200).send(ticket);
});

export { router as getTicketByIdRouter };
