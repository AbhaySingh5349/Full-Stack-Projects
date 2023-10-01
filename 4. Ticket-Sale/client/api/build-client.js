import axios from 'axios';

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on server (req should be made to http://SERVICE_NAME.NAMESPACE.svc.cluster.local/{endpoint})

    // console.log('client cookie: ', req.headers.cookie);
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // we are on browser (req can be made on '{endpoint}', browser itself prepend domain for us)

    return axios.create({ baseURL: '/' });
  }
};
