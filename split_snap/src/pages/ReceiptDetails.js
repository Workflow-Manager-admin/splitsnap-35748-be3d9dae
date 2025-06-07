import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabase";
import Loader from "../components/Loader";

/**
 * Receipt details page: show OCR data, assignments, totals, etc.
 */
export default function ReceiptDetails() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: rcpt } = await supabase.from("receipts").select("*").eq("id", id).single();
      setReceipt(rcpt);
      const { data: asmt } = await supabase.from("assignments").select("*").eq("receipt_id", id);
      setAssignments(asmt || []);
      const { data: fr } = await supabase.from("friends").select("*");
      setFriends(fr || []);
      setLoading(false);
    }
    loadData();
  }, [id]);

  function getAssignmentsForItem(idx) {
    return assignments.filter(a => a.item_idx === idx).map(a => {
      const f = friends.find(f => f.user_id === a.user_id);
      return f?.display_name || a.user_id;
    }).join(", ");
  }

  if (loading || !receipt)
    return <Loader />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Receipt Details</h2>
      <div className="mb-3">
        <span className="text-sm text-slate-500">{receipt.file_name}</span>
        <span className="ml-2 text-sm text-slate-400">{new Date(receipt.created_at).toLocaleString()}</span>
      </div>
      <div className="overflow-x-auto max-w-lg mb-6">
        <table className="min-w-full bg-white border rounded text-xs mb-3">
          <thead>
            <tr>
              <th className="px-2 py-1 border-b">Item</th>
              <th className="px-2 py-1 border-b">Price</th>
              <th className="px-2 py-1 border-b">Assigned</th>
            </tr>
          </thead>
          <tbody>
            {(receipt.items || []).map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 py-1">{item.name}</td>
                <td className="px-2 py-1">${item.price?.toFixed(2)}</td>
                <td className="px-2 py-1">{getAssignmentsForItem(idx) || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between max-w-xs mx-auto mt-3">
          <span className="font-medium">Subtotal</span>
          <span>${receipt.subtotal?.toFixed(2) || "-"}</span>
        </div>
        <div className="flex justify-between max-w-xs mx-auto">
          <span className="font-medium">Tax</span>
          <span>${receipt.tax?.toFixed(2) || "-"}</span>
        </div>
        {receipt.tip && (
          <div className="flex justify-between max-w-xs mx-auto">
            <span className="font-medium">Tip</span>
            <span>${receipt.tip?.toFixed(2) || "-"}</span>
          </div>
        )}
        <div className="flex justify-between max-w-xs mx-auto border-t mt-2 pt-2">
          <span className="font-medium">Total</span>
          <span>${receipt.total?.toFixed(2) || "-"}</span>
        </div>
      </div>
      <div>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://your-supabase-url.supabase.co/storage/v1/object/public/${receipt.storage_path}`}
          className="btn bg-blue-500 text-white hover:bg-blue-700 mr-2"
        >
          Download Receipt
        </a>
        <button
          className="btn bg-amber-500 text-white hover:bg-amber-600"
          onClick={() => window.print()}
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
}
