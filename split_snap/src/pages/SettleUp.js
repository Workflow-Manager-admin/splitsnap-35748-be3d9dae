import React from "react";

/**
 * SettleUp page allows users to send/request payments via Venmo/PayPal.
 * (Demo placeholder: would integrate with real APIs.)
 */
export default function SettleUp() {
  // PUBLIC_INTERFACE
  function handlePay(service) {
    // In real app, would launch Venmo/PayPal payment link with transaction details
    alert(`Pay with ${service}: This will redirect to ${service} payment flow!`);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Settle Up</h2>
      <div className="bg-white rounded shadow-md p-6 max-w-lg mx-auto">
        <p className="mb-4">To settle up, select a person and send/receive payment:</p>
        <div className="flex gap-5 justify-center mb-5">
          <button
            className="btn bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2"
            onClick={() => handlePay("Venmo")}
          >
            <span className="material-icons">payments</span>
            Pay via Venmo
          </button>
          <button
            className="btn bg-blue-800 hover:bg-blue-900 text-white flex items-center gap-2"
            onClick={() => handlePay("PayPal")}
          >
            <span className="material-icons">account_balance_wallet</span>
            Pay via PayPal
          </button>
        </div>
        <div className="text-slate-600 text-sm mt-4">
          (Demo only: Actual payment integration requires backend API/proxy.)
        </div>
      </div>
    </div>
  );
}
