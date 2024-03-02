import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const LOGIN_MUTATION = gql`
mutation AuthService($email: String!) {
    authService(email: $email) {
      email
      expiration
      token
    }
  }
`;

const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate()

  const [authenticate, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
    errorPolicy: 'all',
    variables:{
            email: email
    }
  });

  const handleAuthentication = async () => {
    try {
      const result = await authenticate({ variables: { email } });
      
      Cookies.set('token', result.data.authService.token, {expires: (result.data.authService.expiration * 10)  / (60 * 60 * 24)})
      navigate(`/user/${result.data.authService.token}/${result.data.authService.email}`)
      return result
    } catch (error) {
      console.error('Authentication Failed', error.message);
    }
  };
  console.log(data)

  return (
    <div className='p-6 bg-white flex flex-col justify-center items-center border border-stone-950 rounded-md shadow-md'>
  <label className='mb-4'>
    <input
      className='w-full p-2 border border-stone-950 rounded'
      placeholder="Enter your email"
      name="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </label>
  <button
    className='bg-stone-950 text-white py-2 px-4 rounded focus:outline-none hover:bg-stone-600 hover:text-yellow-400'
    onClick={handleAuthentication}
    disabled={loading}
  >
    {loading ? 'Loading...' : 'Authenticate'}
  </button>

  {data && (
    <div className='mt-4'>
      <p>Email: {data.authService.email}</p>
    </div>
  )}

  {error && (
    <div className='mt-4'>
      <p className='text-red-600'>Error: {error.message}</p>
    </div>
  )}
</div>

  );
};

export default AuthComponent;
