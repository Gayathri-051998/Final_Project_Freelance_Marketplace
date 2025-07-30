import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 py-10">
      <div className="max-w-md w-full bg-green-100 border border-green-300 rounded-2xl p-8 shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">✅ Payment Successful!</h1>
        <p className="text-gray-700 text-lg mb-6">
          Thank you for your payment. Your contract has been successfully processed.
        </p>
        <Link
          to="/contracts"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
        >
          Go to Contracts
        </Link>
      </div>
    </div>
  );
};

export default Success;
