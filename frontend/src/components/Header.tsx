import { usePrivy } from "@privy-io/react-auth";

export function Header() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  const addr = user?.wallet?.address;
  const short = addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : null;

  return (
    <header className="bg-harvest-green text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌱</span>
        <div>
          <h1 className="text-xl font-bold tracking-tight">HarvestFi</h1>
          <p className="text-xs opacity-75">Tokenised Crop Forward Contracts · Base Sepolia</p>
        </div>
      </div>

      <div>
        {!ready ? null : authenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono bg-white/10 px-3 py-1 rounded-full">{short}</span>
            <button
              onClick={logout}
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full transition"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="text-sm bg-harvest-amber text-harvest-brown font-semibold px-5 py-2 rounded-full hover:opacity-90 transition"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
