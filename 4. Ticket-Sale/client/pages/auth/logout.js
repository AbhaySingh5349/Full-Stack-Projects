import { useEffect } from 'react';
import Router from 'next/router';

import { useRequestHook } from '../../hooks/use-request';

const Logout = () => {
  const { executeRequest } = useRequestHook({
    url: '/api/users/logout',
    method: 'post',
    body: {},
    onSuccess: () => {
      // callback function
      Router.push('/');
    },
  });

  useEffect(() => {
    executeRequest();
  }, []);

  return <div>Logging-Out...</div>;
};

export default Logout;
