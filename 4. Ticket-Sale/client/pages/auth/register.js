import React, { useState } from 'react';
import Router from 'next/router';

import { useRequestHook } from '../../hooks/use-request';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { executeRequest, errors } = useRequestHook({
    url: '/api/users/register',
    method: 'post',
    body: { email, password },
    onSuccess: () => {
      // callback function
      Router.push('/');
    },
  });

  const emailHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  const submitHandler = async () => {
    event.preventDefault(); // so that form does not submit itself to browser

    await executeRequest();

    // await executeRequest();
    // Router.push('/');

    setEmail('');
    setPassword('');
  };

  return (
    <form onSubmit={submitHandler}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          className="form-control"
          // type="email"
          value={email}
          onChange={emailHandler}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={passwordHandler}
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default Register;
