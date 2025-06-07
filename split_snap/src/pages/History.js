import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

/**
 * History page: Shows all past bills, payment status, and export.
 */
export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("created_at", { ascending: false });
      setHistory(data || []);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">History & Export</h2>
      {loading ? <Loader /> :
        history.length === 0 ? (
          <div className="text-center text-slate-500 py-12">No history yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded">
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
                {history.map((rcpt) => (
                  <tr key={rcpt.id} className="hover:bg-blue-50">
                    <td className="px-4 py-2">{new Date(rcpt.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2 truncate max-w-xs">{rcpt.file_name}</td>
                    <td className="px-4 py-2">${rcpt.total?.toFixed(2) || "-"}</td>
                    <td className="px-4 py-2">{rcpt.status || "Draft"}</td>
                    <td className="px-4 py-2 text-right flex gap-2">
                      <button
                        className="btn btn-blue text-xs px-3 py-1"
                        onClick={() => navigate(`/receipt/${rcpt.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="btn bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1"
                        onClick={() => window.open(window.location.origin + `/receipt/${rcpt.id}`, "_blank")}
                      >
                        Export as PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
}
