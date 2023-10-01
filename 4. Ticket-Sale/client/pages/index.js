import React from 'react';
import { buildClient } from '../api/build-client';

const LandingPage = ({ user }) => {
  console.log('LandingPage component: ', user);

  return user ? (
    <h3>You are signed in {user.email}</h3>
  ) : (
    <h3>You are not signed in</h3>
  );
};

// next.js calls this func on server to fetch data as "props" which component needs for server side rendering
// in SSR process, we are not allowed to fetch data from component
// since 'getInitialProps' is a function and not a component, so we cannot use 'useRequestHook'
LandingPage.getInitialProps = async (context) => {
  console.log('LandingPage getInitialProps');

  const client = buildClient(context);
  const { data } = await client.get('api/users/current-user');

  return data; // prop for component
};

export default LandingPage;
