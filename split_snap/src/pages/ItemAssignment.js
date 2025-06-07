import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import Loader from "../components/Loader";

/**
 * Item Assignment page: assign each item to users and see shares update.
 * Drag-and-drop or checkboxes for assignment, with real-time split.
 */
export default function ItemAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [receipt, setReceipt] = useState(null);
  const [friends, setFriends] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      // Get the chosen receipt
      const { data: rcpt, error } = await supabase
        .from("receipts")
        .select("*")
        .eq("id", id)
        .single();
      setReceipt(rcpt);

      // Get user friends list
      const { data: fr } = await supabase
        .from("friends")
        .select("*");
      setFriends(fr || []);

      // Load existing assignments
      const { data: asmt } = await supabase
        .from("assignments")
        .select("*")
        .eq("receipt_id", id);
      const initAssign = {};
      asmt?.forEach(a => {
        initAssign[a.item_idx] = a.user_id;
      });
      setAssignments(initAssign);

      setLoading(false);
    }
    loadData();
  }, [id]);

  // PUBLIC_INTERFACE
  function handleAssign(itemIdx, userId) {
    setAssignments(prev => ({ ...prev, [itemIdx]: userId }));
  }

  // Sum up the share for each user
  function getSplit() {
    const split = {};
    if (!receipt?.items) return split;
    receipt.items.forEach((item, idx) => {
      const assigned = assignments[idx];
      if (!assigned) return;
      split[assigned] = (split[assigned] || 0) + (item.price || 0);
    });
    // Add tax/tip split (split evenly if everybody has at least one item)
    const totalShare = Object.keys(split).length;
    if (totalShare > 0) {
      const extras = (Number(receipt.tax || 0) + Number(receipt.tip || 0)) / totalShare;
      Object.keys(split).forEach(uid => {
        split[uid] += extras;
      });
    }
    return split;
  }

  // PUBLIC_INTERFACE
  async function handleSave() {
    // Save assignments to DB
    setLoading(true);
    const rows = Object.keys(assignments).map(idx => ({
      receipt_id: id,
      item_idx: Number(idx),
      user_id: assignments[idx]
    }));
    // Remove previous assignments for receipt
    await supabase.from("assignments").delete().eq("receipt_id", id);
    if (rows.length > 0) {
      await supabase.from("assignments").insert(rows);
    }
    setLoading(false);
    navigate(`/receipt/${id}`);
  }

  if (loading || !receipt) return <Loader />;
  const split = getSplit();

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-700 mb-3">Assign Items</h2>
      <div className="overflow-x-auto max-w-lg mb-6">
        <table className="min-w-full bg-white border rounded text-xs">
          <thead>
            <tr>
              <th className="px-2 py-1 border-b">Item</th>
              <th className="px-2 py-1 border-b">Price</th>
              <th className="px-2 py-1 border-b">Assign To</th>
            </tr>
          </thead>
          <tbody>
            {(receipt.items || []).map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 py-1">{item.name}</td>
                <td className="px-2 py-1">${item.price?.toFixed(2)}</td>
                <td className="px-2 py-1">
                  <select
                    value={assignments[idx] || ''}
                    onChange={e => handleAssign(idx, e.target.value)}
                    className="border p-1 rounded text-xs min-w-[90px]"
                  >
                    <option value="">Unassigned</option>
                    {friends.map(friend => (
                      <option key={friend.id} value={friend.user_id}>
                        {friend.display_name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="font-medium text-lg text-slate-600 mt-2 mb-1">Split Summary</h3>
      <div className="bg-blue-50 border border-blue-100 text-sm p-3 rounded max-w-md">
        {Object.keys(split).length === 0 ? (
          <span>No assignments yet.</span>
        ) : (
          <ul>
            {Object.entries(split).map(([uid, amount]) => {
              const f = friends.find(f => f.user_id === uid);
              return (
                <li key={uid}>
                  <span className="font-medium">{f?.display_name || uid}</span>: ${amount.toFixed(2)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <button
        className="mt-4 btn bg-blue-600 text-white hover:bg-blue-800"
        onClick={handleSave}
        disabled={loading}
      >
        Save Assignments
      </button>
    </div>
  );
}
