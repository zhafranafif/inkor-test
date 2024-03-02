import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const USER_MUTATION = gql`
mutation UserService($email: String!, $tokenId: String!) {
    userService(email: $email, tokenId: $tokenId) {
      email
      id
      memberNo
      name
      token
    }
  }
`
const PAYMENT_MUTATION = gql`
mutation PostService($memberNo: Int!) {
    postService(memberNo: $memberNo) {
      amount
      memberNo
    }
  }
`

const UserComponent = () => {
    const { tokenId, email} = useParams();
    const [memberNo, setMemberNo] = useState(0)
    const [amountData, setAmountData] = useState('');
    
    const [getUser, { loading, error, data }] = useMutation(USER_MUTATION);
    const [totalAmount,{paymentLoading, paymentError, paymentData}] = useMutation(PAYMENT_MUTATION)
    useEffect(() => {
  getUser({
    variables: { email, tokenId }
  })
    }, [getUser, email, tokenId])

    const handleGetAmount = async() => {
        try{
            const result = await totalAmount({variables: {memberNo: parseInt(memberNo, 10)}})
            const getAmount = result.data.postService
            setAmountData(getAmount)
        } catch(error){
            console.error('Failed to get amount', error.message)
        }
    }
  
    if (loading || paymentLoading) return <p>Loading...</p>;
    if (error || paymentError) return <p>Error: {error.message}</p>;


const rupiah = (number)=>{
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
  }
  
    return (
        <>
      <div className="p-6 bg-white border-stone-950 rounded-md shadow-md w-full max-w-md mx-auto mt-8 flex flex-col justify-center items-center">
  <blockquote className="text-stone-800 mb-4">
    Please input the Member Number to find out the amount you have to pay!
  </blockquote>
  <label className="mb-4">
    <input
      className="w-full p-2 border border-stone-950 rounded focus:outline-none"
      placeholder="Enter Member Number"
      onChange={(e) => setMemberNo(e.target.value)}
      value={memberNo}
    />
  </label>
  <button
    className="bg-stone-950 text-white py-2 px-4 rounded focus:outline-none hover:bg-stone-600 hover:text-yellow-400"
    onClick={handleGetAmount}
  >
    {loading ? 'Loading...' : 'Submit'}
  </button>
</div>
<div className="p-6 bg-white border-stone-950 rounded-md shadow-md w-full max-w-md mx-auto mt-8 flex flex-col justify-center items-center">
            <h1 className='text-red-700'>{rupiah(amountData.amount)}</h1>
</div>
        </>
    );
  };

export default UserComponent