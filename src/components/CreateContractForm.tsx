import { useState } from "react";
import type { FormEvent } from "react";
import type { CreateContractInput } from "../types/contract";

interface CreateContractFormProps {
  onSubmit: (input: CreateContractInput) => Promise<void>;
  isLoading: boolean;
  userAddress: string;
}

function CreateContractForm({ onSubmit, isLoading, userAddress }: CreateContractFormProps) {
  const [formData, setFormData] = useState<CreateContractInput>({
    farmerAddress: userAddress,
    oracleAddress: "",
    cropName: "",
    quantity: 0,
    agreedPrice: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "agreedPrice" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.oracleAddress || !formData.oracleAddress.match(/^[A-Z2-7]{58}$/)) {
      setError("Invalid oracle address. It should be a 58-character Algorand address.");
      return;
    }
    if (!formData.cropName.trim()) {
      setError("Crop name is required.");
      return;
    }
    if (formData.quantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }
    if (formData.agreedPrice <= 0) {
      setError("Agreed price must be greater than 0.");
      return;
    }

    try {
      await onSubmit(formData);
      setSuccess(true);
      setFormData({
        farmerAddress: userAddress,
        oracleAddress: "",
        cropName: "",
        quantity: 0,
        agreedPrice: 0,
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="fs-card max-w-4xl rounded-2xl p-6 sm:p-8">
      <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Create Forward Contract</h2>
      <p className="mt-2 text-sm text-slate-600">Define crop details and lock your preferred price.</p>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
          Contract created successfully. Buyers can now accept it from the contract list.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <label className="fs-label">Your Farmer Address</label>
          <input
            type="text"
            value={formData.farmerAddress}
            disabled
            className="fs-input font-mono text-xs"
          />
        </div>

        <div>
          <label className="fs-label">Crop Name</label>
          <input
            type="text"
            name="cropName"
            value={formData.cropName}
            onChange={handleChange}
            placeholder="Wheat, Corn, Rice, Soybean"
            className="fs-input"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="fs-label">Quantity (units)</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="100"
              className="fs-input"
            />
          </div>
          <div>
            <label className="fs-label">Price per unit (ALGO)</label>
            <input
              type="number"
              name="agreedPrice"
              value={formData.agreedPrice}
              onChange={handleChange}
              step="0.01"
              placeholder="50"
              className="fs-input"
            />
          </div>
        </div>

        {formData.quantity > 0 && formData.agreedPrice > 0 && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Total Contract Value
            </p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-900">
              {(formData.quantity * formData.agreedPrice).toLocaleString()} ALGO
            </p>
          </div>
        )}

        <div>
          <label className="fs-label">Oracle Address</label>
          <input
            type="text"
            name="oracleAddress"
            value={formData.oracleAddress}
            onChange={handleChange}
            placeholder="58-character Algorand oracle address"
            className="fs-input font-mono text-xs"
          />
        </div>

        <button type="submit" disabled={isLoading} className="fs-btn fs-btn-primary w-full px-5 py-3.5">
          {isLoading ? "Creating Contract..." : "Create Contract"}
        </button>
      </form>
    </div>
  );
}

export default CreateContractForm;
