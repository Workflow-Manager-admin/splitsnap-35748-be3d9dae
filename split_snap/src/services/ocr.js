/**
 * Sends a receipt image to a backend endpoint that wraps Google Cloud Vision API.
 * @param {File} file Receipt file (PNG, JPG, PDF)
 * @returns {Promise<Object>} parsed receipt data (items, subtotal, tax, total)
 */
export async function parseReceipt(file) {
  const formData = new FormData();
  formData.append("receipt", file);

  const response = await fetch(
    process.env.REACT_APP_OCR_API_URL || "/api/ocr",
    { method: "POST", body: formData }
  );
  if (!response.ok) throw new Error("OCR API processing failed");
  return response.json();
}
