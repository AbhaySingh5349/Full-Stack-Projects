import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';

import { buildClient } from '../api/build-client';
import { Header } from '../components/header';

// defining custom app component (for global css and common components for all pages)
// whenever we will navigate to distinct page with next.js, next will import component from that .js file
// pageProps are set of components that we have been intending to pass to that .js file
const AppComponent = ({ Component, pageProps, user }) => {
  return (
    <div>
      <Header user={user} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('api/users/current-user');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    // to handle multile GetInitialProps
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log('AppComponent getInitialProps: ', pageProps);
  return { pageProps, user: data?.user }; // prop for component
};

export default AppComponent;
