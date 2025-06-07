import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReceipts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("created_at", { ascending: false });
      setReceipts(data || []);
      setLoading(false);
    }
    fetchReceipts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Dashboard</h1>
      <div className="mb-6">
        <button
          className="btn bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => navigate("/upload")}
        >
          + Upload Receipt
        </button>
      </div>
      {loading ? <Loader /> :
        receipts.length === 0 ? (
          <div className="text-slate-600 text-center py-12">
            No receipts found. Let's upload your first one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Receipt</th>
                  <th className="px-4 py-2 border-b">Total</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((rcpt) => (
                  <tr key={rcpt.id} className="hover:bg-blue-50">
                    <td className="px-4 py-2">{new Date(rcpt.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2 truncate max-w-xs">{rcpt.file_name}</td>
                    <td className="px-4 py-2">${rcpt.total?.toFixed(2) || "-"}</td>
                    <td className="px-4 py-2">{rcpt.status || "Pending"}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        className="btn btn-blue text-xs px-3 py-1"
                        onClick={() => navigate(`/receipt/${rcpt.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="ml-1 btn bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1"
                        onClick={() => navigate(`/assign/${rcpt.id}`)}
                      >
                        Split
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
