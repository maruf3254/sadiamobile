
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, post } from "../../services/api";
import { toast } from "react-hot-toast";
import PageHeader from "../../Components/common/PageHeader.jsx";
import Loading from "../../Components/common/Loading.jsx";

export default function SaleDetails() {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState([]);
  const [reason, setReason] = useState("");

  const fetchSale = async () => {
    try {
      const result = await get(`/sales/${id}`);
      setSale(result.sale);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSale();
  }, [id]);

  const handleReturn = async () => {
    if (!returning.length) return toast.error("Select a phone to return.");

    if (!window.confirm("Confirm return of selected phones?")) return;

    try {
      await post(`/sales/${id}/return`, {
        imeis: returning,
        reason,
      });

      toast.success("Return recorded successfully");
      setReturning([]);
      setReason("");
      fetchSale();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loading />;
  if (!sale) return <p>Sale not found.</p>;

  const returned = new Set(sale.returnedItems.map((item) => item.imei));

  return (
    <div>
      <PageHeader title="Sale Details" description={`Invoice: ${sale.invoiceNumber}`} />

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5 mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">Sale Date</p>
            <strong>{new Date(sale.saleDate).toLocaleDateString()}</strong>
          </div>
          <div>
            <p className="text-xs text-gray-500">Subtotal</p>
            <strong>৳{sale.subtotal.toLocaleString("en-BD")}</strong>
          </div>
          <div>
            <p className="text-xs text-gray-500">Discount</p>
            <strong>৳{sale.discount.toLocaleString("en-BD")}</strong>
          </div>
          <div>
            <p className="text-xs text-gray-500">Refunded</p>
            <strong className="text-red-600">৳{sale.refundedAmount.toLocaleString("en-BD")}</strong>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr className="text-left text-gray-500">
              <th className="p-4">Return</th>
              <th className="p-4">Phone</th>
              <th className="p-4">IMEI</th>
              <th className="p-4">Selling Price</th>
              <th className="p-4">Net Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.imei} className="border-t dark:border-gray-700">
                <td className="p-4">
                  {!returned.has(item.imei) && (
                    <input
                      type="checkbox"
                      checked={returning.includes(item.imei)}
                      onChange={() =>
                        setReturning((prev) =>
                          prev.includes(item.imei)
                            ? prev.filter((v) => v !== item.imei)
                            : [...prev, item.imei]
                        )
                      }
                    />
                  )}
                </td>
                <td className="p-4">{item.brand} {item.model}</td>
                <td className="p-4">{item.imei}</td>
                <td className="p-4">৳{item.sellingPrice.toLocaleString("en-BD")}</td>
                <td className="p-4">৳{item.netAmount.toLocaleString("en-BD")}</td>
                <td className="p-4">{returned.has(item.imei) ? "Returned" : "Sold"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sale.status !== "RETURNED" && (
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-5 mt-5 space-y-3">
          <h3 className="font-semibold">Record Phone Return</h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Return reason..."
            className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-600"
          />
          <button
            onClick={handleReturn}
            disabled={!returning.length}
            className="bg-red-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            Confirm Return ({returning.length})
          </button>
        </div>
      )}
    </div>
  );
}
