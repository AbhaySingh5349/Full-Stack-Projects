import React, { useState } from 'react';
import axios from 'axios';

// handle request & errors
export const useRequestHook = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const executeRequest = async () => {
    try {
      setErrors(null);
      const res = await axios[method](url, body);

      // check if onSuccess callback was provided
      if (onSuccess) onSuccess(res.data);

      return res.data;
    } catch (err) {
      console.log('register error: ', err.response.data.errors);
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops !!</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
      //   throw err; // so that components where function is called are aware about the error and handle it
    }
  };
  return { executeRequest, errors };
};
