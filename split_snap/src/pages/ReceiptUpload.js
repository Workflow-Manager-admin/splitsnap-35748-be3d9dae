import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { parseReceipt } from "../services/ocr";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

/**
 * Receipt Upload and OCR page for SplitSnap.
 */
export default function ReceiptUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!file) return setErr("Please select a receipt file to upload.");
    setLoading(true);
    try {
      // Upload to Supabase Storage
      const uploadRes = await supabase.storage
        .from("receipts")
        .upload(`public/${Date.now()}_${file.name}`, file);
      if (uploadRes.error) throw uploadRes.error;

      // Parse OCR data
      const ocrData = await parseReceipt(file);

      // Insert receipt metadata to DB
      const { data, error } = await supabase
        .from("receipts")
        .insert([{
          file_name: file.name,
          storage_path: uploadRes.data.path,
          ...ocrData
        }]);
      if (error) throw error;
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message || "Upload failed");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-2">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Upload a Receipt</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={e => setFile(e.target.files[0])}
          className="block w-full mb-2"
          disabled={loading}
        />
        {err && <div className="text-red-600 text-xs">{err}</div>}
        <button
          type="submit"
          className="btn btn-blue w-full"
          disabled={loading}>
          {loading ? <Loader /> : "Upload & Extract"}
        </button>
      </form>
    </div>
  );
}
