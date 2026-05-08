export default function AdminSettings() {
  return (
    <section className="space-y-6">
      <header className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#0f6a2f]">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Platform controls for alerts, publication, and approvals.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Default Publication Rules</h3>
          <p className="mt-2 text-sm text-slate-500">Set default checks before news goes live.</p>
        </article>
        <article className="rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
          <p className="mt-2 text-sm text-slate-500">Configure admin notices and escalation alerts.</p>
        </article>
      </section>
    </section>
  )
}
