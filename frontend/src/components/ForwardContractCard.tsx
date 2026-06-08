import { useState } from "react";
import { formatUnits } from "viem";
import type { ForwardContract } from "../hooks/useContracts";
import { useInvest } from "../hooks/useInvest";

const STATUS = ["Funding", "Settled", "Cancelled"];
const STATUS_COLOR = ["text-harvest-green", "text-harvest-amber", "text-red-500"];

type Props = { fc: ForwardContract };

export function ForwardContractCard({ fc }: Props) {
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { invest, isWriting } = useInvest();

  const pct = fc.targetAmount > 0n
    ? Number((fc.raisedAmount * 100n) / fc.targetAmount)
    : 0;

  const deadline = new Date(Number(fc.deadline) * 1000).toLocaleDateString("en-UG", {
    day: "numeric", month: "short", year: "numeric",
  });

  async function handleInvest() {
    setError(null);
    try {
      const amountUsdc = BigInt(Math.round(parseFloat(amount) * 1e6));
      const { investTx } = await invest(fc.id, amountUsdc);
      setTxHash(investTx);
      setAmount("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 border border-harvest-cream">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-400 font-mono">Contract #{String(fc.id)}</p>
          <p className="text-sm text-gray-500 truncate max-w-[160px]" title={fc.metadataCID}>
            📄 {fc.metadataCID.slice(0, 24)}…
          </p>
        </div>
        <span className={`text-xs font-semibold uppercase ${STATUS_COLOR[fc.status]}`}>
          {STATUS[fc.status]}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>${formatUnits(fc.raisedAmount, 6)} raised</span>
          <span>${formatUnits(fc.targetAmount, 6)} goal</span>
        </div>
        <div className="h-2 bg-harvest-cream rounded-full overflow-hidden">
          <div
            className="h-full bg-harvest-green transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{pct}% funded · Deadline {deadline}</p>
      </div>

      {/* Invest form (only when Funding) */}
      {fc.status === 0 && (
        <div className="flex gap-2 items-center mt-auto">
          <input
            type="number"
            min="1"
            placeholder="USDC amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-harvest-green"
          />
          <button
            onClick={handleInvest}
            disabled={isWriting || !amount}
            className="bg-harvest-green text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-opacity-90 transition"
          >
            {isWriting ? "Confirming…" : "Invest"}
          </button>
        </div>
      )}

      {txHash && (
        <a
          href={`https://sepolia.basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-harvest-green underline truncate"
        >
          ✅ Tx confirmed → {txHash.slice(0, 18)}…
        </a>
      )}
      {error && <p className="text-xs text-red-500 break-words">{error}</p>}
    </div>
  );
}
