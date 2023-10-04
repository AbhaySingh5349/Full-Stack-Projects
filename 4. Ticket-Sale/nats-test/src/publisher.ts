import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedPublisher } from './events/ticket-created-publisher';

// import {Tick} from '@abticketsale/common';

console.clear();

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

// "npm run publish" will throw err (as we are trying to access program running inside pod of cluster)

// to access something inside cluster, we have options:

/* (outside_world <--> Ingres-Nginx <--> nats-clusterip-srv <--> NATS pod)
   1. as we have created "nats-clusterip-srv" to govern access to pod, so we can modify our "ingress-srv.yaml"
   and add "route" to expose ClusterIP service to outside world, hence we can tell "publisher" to directly
   communicate with ingress-nginx 
*/

// what happens if publisher or listener programs suddenly looses connection with NATS streaming pod,
// so we need to break that link and quicklt toggle it back on

/* (outside_world <--> nats-nodeport-srv <--> NATS pod)
   2. creating NodePort service to expose NATS pod directly to outside of kubernetes cluster (need to write config)
*/

/* (outside_world <--> nats-nodeport-srv <--> NATS pod)
   3. we can run command that tells kubernetes cluster to port forward port of specific pod inside cluster.
      After running "port forwarding", it will cause cluster to behave as it has "NodePort" service running inside it
      by exposing "NATS pod" (specific port on it) to outside_world and allows connection from local machine

      kubectl get pods
      kubectl port-forward <nats-depl-pod> <port>:<port>
*/

// after client has successfully connected with nats server
client.on('connect', async () => {
  console.log('publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(client);
  try {
    await publisher.publish({
      id: '1',
      title: 'cricket',
      price: 20,
      userId: 'abc',
    });
  } catch (err) {
    console.log(`publisher error: `, err);
  }
});
