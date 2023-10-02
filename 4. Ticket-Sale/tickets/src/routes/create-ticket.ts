import express, { Request, Response } from 'express';

import { requireAuth, validateTicketInput } from '@abticketsale/common';
import { Ticket } from '../models/ticket-model';

const router = express.Router();

router
  .route('/api/tickets')
  .post(
    requireAuth,
    validateTicketInput,
    async (req: Request, res: Response) => {
      const { title, price } = req.body;

      const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id,
      });
      await ticket.save();

      return res.status(201).send(ticket);
    }
  );

export { router as createTicketRouter };
