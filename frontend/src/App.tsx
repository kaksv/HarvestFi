import { usePrivy } from "@privy-io/react-auth";
import { Header } from "./components/Header";
import { ForwardContractCard } from "./components/ForwardContractCard";
import { useContracts } from "./hooks/useContracts";

function FlowStep({ emoji, label, sub }: { emoji: string; label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="text-3xl">{emoji}</div>
      <p className="text-sm font-semibold text-harvest-green">{label}</p>
      <p className="text-xs text-gray-500 text-center">{sub}</p>
    </div>
  );
}

function FlowDiagram() {
  return (
    <div className="bg-harvest-cream rounded-2xl p-6 mb-8">
      <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        How it works
      </h2>
      <div className="flex items-start gap-2">
        <FlowStep emoji="🧑‍🌾" label="Cooperative" sub="Registers harvest & uploads proof-of-farm to IPFS" />
        <div className="mt-5 text-gray-300 text-xl">→</div>
        <FlowStep emoji="🪙" label="hTOKEN Minted" sub="Forward contract tokenised on Base" />
        <div className="mt-5 text-gray-300 text-xl">→</div>
        <FlowStep emoji="💰" label="Investor" sub="Buys tokens with USDC — farmer gets capital now" />
        <div className="mt-5 text-gray-300 text-xl">→</div>
        <FlowStep emoji="🚚" label="Delivery" sub="Off-taker pays USDC after physical crop delivery" />
        <div className="mt-5 text-gray-300 text-xl">→</div>
        <FlowStep emoji="💸" label="Redemption" sub="Token holders burn tokens, receive USDC pro-rata" />
      </div>
    </div>
  );
}

export default function App() {
  const { authenticated } = usePrivy();
  const { contracts, isLoading } = useContracts();

  const active   = contracts.filter((c) => c.status === 0);
  const settled  = contracts.filter((c) => c.status === 1);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <FlowDiagram />

        {!authenticated && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🌾</p>
            <p className="text-lg font-medium">Connect your wallet to start investing</p>
            <p className="text-sm mt-1">No seed phrase needed — login with email or passkey via Privy</p>
          </div>
        )}

        {authenticated && (
          <>
            <section className="mb-10">
              <h2 className="text-lg font-bold text-harvest-brown mb-4">
                🟢 Active Funding Rounds ({active.length})
              </h2>
              {isLoading ? (
                <p className="text-gray-400 text-sm">Loading contracts…</p>
              ) : active.length === 0 ? (
                <p className="text-gray-400 text-sm">No active rounds right now.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {active.map((fc) => <ForwardContractCard key={String(fc.id)} fc={fc} />)}
                </div>
              )}
            </section>

            {settled.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-harvest-brown mb-4">
                  ✅ Settled Contracts ({settled.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {settled.map((fc) => <ForwardContractCard key={String(fc.id)} fc={fc} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
