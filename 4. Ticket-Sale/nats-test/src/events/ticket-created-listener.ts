import { Message } from 'node-nats-streaming';

import { Listener } from '../../../common/src/events/base-listener';
import { TicketCreatedEvent } from '@abticketsale/common';
import { Channels } from '@abticketsale/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  //   channelName: Channels.TicketCreated = Channels.TicketCreated;
  readonly channelName = Channels.TicketCreated;
  queueGroupName = 'payments-service'; // joining queue grp with other services & whenever msg comes in, it will be distributed to 1 of listeners in queue group

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('TicketCreatedListener data: ', data);

    // if service is down, listener will send req to other instance of service in Queue group
    msg.ack();
  }
}
