import express, { Request, Response } from 'express';

import {
  requireAuth,
  validateTicketInput,
  NotFoundError,
  UnauthorizedError,
} from '@abticketsale/common';
import { Ticket } from '../models/ticket-model';

const router = express.Router();

router
  .route('/api/tickets/:ticketId')
  .put(
    requireAuth,
    validateTicketInput,
    async (req: Request, res: Response) => {
      const ticket = await Ticket.findById(req.params.ticketId);
      if (!ticket) throw new NotFoundError();

      if (ticket.userId !== req?.currentUser?.id) throw new UnauthorizedError();

      ticket.set({ title: req.body.title, price: req.body.price });
      await ticket.save();

      return res.status(200).send(ticket);
    }
  );

export { router as updateTicketByIdRouter };
