import { Publisher } from '@abticketsale/common';
import { TicketCreatedEvent } from '@abticketsale/common';
import { Channels } from '@abticketsale/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly channel = Channels.TicketCreated;
}
