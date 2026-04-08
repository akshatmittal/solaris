import { ConnectButton } from "solariskit";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Solaris Example</p>
        <h1>Next 💖 SolarisKit</h1>
        <p className="lede">
          Set <code>NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID</code> to test WalletConnect flows.
        </p>
        <div className="actions">
          <ConnectButton />
        </div>
      </section>
    </main>
  );
}
