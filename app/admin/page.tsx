import { StatCard } from "@/components/admin/AdminShell";
import { GrowthCharts } from "@/components/admin/GrowthCharts";
import { computeAdminStats } from "@/lib/admin-stats";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const s = await computeAdminStats();
  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>Overview</h2>
      <p style={{ color: "var(--calm-ink-70)", marginBottom: 32 }}>
        Live state from the in-memory MVP store. Numbers reset on server restart until Prisma is wired up.
      </p>

      <GrowthCharts />

      <Section title="Acquisition">
        <Grid>
          <StatCard label="Total signups" value={s.signups.total} hint={`${s.signups.last7d} in last 7d · ${s.signups.last30d} in 30d`} />
          <StatCard label="Total leads (popup)" value={s.leads.total} hint={`${s.leads.last7d} in last 7d`} />
          <StatCard label="Lead → signup" value={`${s.conversion.leadsToSignups}%`} />
          <StatCard label="Signup → Pro" value={`${s.conversion.signupsToPro}%`} />
        </Grid>
      </Section>

      <Section title="Engagement">
        <Grid>
          <StatCard label="Live users (5 min)" value={s.liveUsers} hint="Active API events in the last 5 minutes" />
          <StatCard label="Recurring users" value={s.recurringUsers} hint="Older than 7d, still active" />
          <StatCard label="Claude requests" value={s.api.claudeRequests} hint={`${s.api.totalTokensIn.toLocaleString()} in / ${s.api.totalTokensOut.toLocaleString()} out`} />
          <StatCard label="Voice sessions" value={s.api.voiceRequests} />
        </Grid>
      </Section>

      <Section title="Revenue">
        <Grid>
          <StatCard label="Pro accounts" value={s.paid.proCount} />
          <StatCard label="MRR (USD)" value={`$${s.paid.mrrUsd.toLocaleString()}`} hint="At $19/mo per Pro" />
          <StatCard label="ARR (USD)" value={`$${s.paid.arrUsd.toLocaleString()}`} />
          <StatCard label="Estimated API spend" value={`$${s.api.totalCostUsd.toFixed(2)}`} hint="Claude + voice estimate" />
        </Grid>
      </Section>

      <Section title="Feedback">
        <Grid>
          <StatCard label="Total feedback" value={s.feedback.total} />
          <StatCard label="Average rating" value={s.feedback.average || "—"} hint="Across all sessions" />
          <StatCard label="Positive (4★+)" value={s.feedback.positive} />
          <StatCard label="Needs attention (<3★)" value={s.feedback.needsAttention} hint="Visible in Feedback tab" />
        </Grid>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 12 }}>{title}</p>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}
