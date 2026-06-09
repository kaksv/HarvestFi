import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Header } from "./components/Header";
import { ForwardContractCard } from "./components/ForwardContractCard";
import { RegisterPage } from "./components/RegisterPage";
import { useContracts } from "./hooks/useContracts";

type Tab = "invest" | "register";

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
        <FlowStep emoji="🧑🌾" label="Cooperative"   sub="Registers harvest & proof-of-farm" />
        <div className="mt-5 text-gray-300 text-xl">→</div>
        <FlowStep emoji="🪙"  label="hTOKEN Minted" sub="Forward contract tokenised on Base" />
        <div className="mt-5 text-gray-300 text-xl">→</div>
        <FlowStep emoji="💰"  label="Investor"       sub="Buys tokens with USDC — farmer gets capital now" />
        <div className="mt-5 text-gray-300 text-xl">→</div>
        <FlowStep emoji="🚚"  label="Delivery"       sub="Off-taker pays USDC after crop delivery" />
        <div className="mt-5 text-gray-300 text-xl">→</div>
        <FlowStep emoji="💸"  label="Redemption"     sub="Token holders receive USDC pro-rata" />
      </div>
    </div>
  );
}

function Tabs({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
      {([ 
        { id: "invest",   label: "💰 Invest",           },
        { id: "register", label: "🧑🌾 Register Harvest" },
      ] as { id: Tab; label: string }[]).map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition
            ${active === t.id
              ? "bg-white text-harvest-green shadow-sm"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const { authenticated } = usePrivy();
  const { contracts, isLoading } = useContracts();
  const [tab, setTab] = useState<Tab>("invest");

  const active  = contracts.filter((c) => c.status === 0);
  const settled = contracts.filter((c) => c.status === 1);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <FlowDiagram />

        {!authenticated ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🌾</p>
            <p className="text-lg font-medium">Connect your wallet to get started</p>
            <p className="text-sm mt-1">No seed phrase needed — login with email or passkey via Privy</p>
          </div>
        ) : (
          <>
            <Tabs active={tab} onChange={setTab} />

            {/* ── Invest tab ── */}
            {tab === "invest" && (
              <>
                <section className="mb-10">
                  <h2 className="text-lg font-bold text-harvest-brown mb-4">
                    🟢 Active Funding Rounds ({active.length})
                  </h2>
                  {isLoading ? (
                    <p className="text-gray-400 text-sm">Loading contracts…</p>
                  ) : active.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      No active rounds yet.{" "}
                      <button onClick={() => setTab("register")} className="text-harvest-green underline">
                        Register the first harvest →
                      </button>
                    </p>
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

            {/* ── Register tab ── */}
            {tab === "register" && <RegisterPage />}
          </>
        )}
      </main>
    </div>
  );
}
