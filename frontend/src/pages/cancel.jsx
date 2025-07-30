import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 py-10">
      <div className="max-w-md w-full bg-red-100 border border-red-300 rounded-2xl p-8 shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-4">❌ Payment Cancelled</h1>
        <p className="text-gray-700 text-lg mb-6">
          The payment was not completed. You can try again from the contracts page.
        </p>
        <Link
          to="/contracts"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
        >
          Back to Contracts
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
