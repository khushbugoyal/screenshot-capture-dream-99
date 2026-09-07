import { useMemo, useRef, useState, useEffect } from "react";
import {
  AVATAR_FAMILIES,
  hashName,
  riskMeta,
  subscribers,
  type Subscriber,
} from "@/data/subscribers";

type GroupKey = "rank" | "engagement" | "progress" | "commissions";

const DEFAULT_GROUPS: Record<GroupKey, boolean> = {
  rank: true,
  engagement: true,
  progress: true,
  commissions: true,
};

function FlagIcon({ cls, label }: { cls: string; label: string }) {
  return (
    <svg className={`risk-flag ${cls}`} width="13" height="13" viewBox="0 0 16 16" role="img" aria-label={label}>
      <title>{label}</title>
      <rect x="3" y="1" width="1.6" height="14" rx="0.8" fill="currentColor" />
      <path
        d="M4.6 2 L13 2 L10.4 4.5 L13 7 L4.6 7 Z"
        fill="var(--flag-fill)"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CautionIcon({ label }: { label: string }) {
  return (
    <svg className="caution-icon" width="13" height="13" viewBox="0 0 16 16" role="img" aria-label={label}>
      <title>{label}</title>
      <path d="M8 1.6 L15 14.4 L1 14.4 Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="7.3" y="6" width="1.4" height="4.2" rx="0.7" fill="currentColor" />
      <rect x="7.3" y="11.2" width="1.4" height="1.4" rx="0.7" fill="currentColor" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function money(v: number) {
  return v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function NumCell({ v, group, isMoney }: { v: number; group: string; isMoney?: boolean }) {
  return (
    <td className={`num ${v === 0 ? "zero" : "nonzero"}`} data-group={group}>
      {isMoney ? money(v) : v.toLocaleString()}
    </td>
  );
}

const COLUMNS: { key: keyof Subscriber; label: string; group: string }[] = [
{ key: "emailsReceived", label: "Emails Received", group: "engagement" },
  { key: "smsReceived", label: "SMS Received", group: "engagement" },
  { key: "dashboardVisits", label: "Dashboard Visits", group: "engagement" },
  { key: "shares", label: "Shares", group: "engagement" },
  { key: "points", label: "Points", group: "engagement" },
  { key: "tasks", label: "Tasks", group: "progress" },
  { key: "visitors", label: "Visitors", group: "progress" },
  { key: "pending", label: "Pending", group: "progress" },
  { key: "unconfirmed", label: "Unconfirmed", group: "progress" },
  { key: "confirmed", label: "Confirmed", group: "progress" },
  { key: "revenue", label: "Revenue Generated", group: "progress" },
  { key: "commPending", label: "Pending", group: "commissions" },
  { key: "commPaid", label: "Paid", group: "commissions" },
];

export function SubscribersTable() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState(1);
  const [groups, setGroups] = useState<Record<GroupKey, boolean>>(DEFAULT_GROUPS);
  const [panelOpen, setPanelOpen] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const headerCheckRef = useRef<HTMLInputElement>(null);

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = subscribers.filter(
      (d) =>
        (d.name || "").toLowerCase().includes(q) ||
        (d.email || d.id || "").toLowerCase().includes(q),
    );
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      if (sortKey === "date") {
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * sortDir;
      }
      const av = a[sortKey as keyof Subscriber] as number | string | null;
      const bv = b[sortKey as keyof Subscriber] as number | string | null;
      if (typeof av === "string" || typeof bv === "string") {
        return String(av ?? "").localeCompare(String(bv ?? "")) * sortDir;
      }
      return ((av as number) - (bv as number)) * sortDir;
    });
  }, [query, sortKey, sortDir]);

  const checkedCount = rows.filter((r) => checked[r.rank]).length;
  useEffect(() => {
    if (headerCheckRef.current) {
      headerCheckRef.current.indeterminate = checkedCount > 0 && checkedCount < rows.length;
    }
  }, [checkedCount, rows.length]);

  function sortBy(key: string) {
    if (sortKey === key) setSortDir((d) => d * -1);
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  function reset() {
    setGroups(DEFAULT_GROUPS);
    setQuery("");
    setSortKey(null);
    setSortDir(1);
  }

  const tableCls = [
    "rh-table",
    ...(Object.keys(groups) as GroupKey[]).filter((g) => !groups[g]).map((g) => `hide-${g}`),
  ].join(" ");

  const Th = ({ colKey, label, group, extra }: { colKey: string; label: string; group: string; extra?: string }) => (
    <th
      className={`${extra ?? ""} ${sortKey === colKey ? "sorted" : ""}`}
      data-group={group}
      onClick={() => sortBy(colKey)}
    >
      {label}
      {"\u00A0"}
      <span className="sort-caret">▾</span>
    </th>
  );

  let lastFamilyIdx = -1;

  return (
    <div className="rh-page">
      <div className="app">
        <div className="page-head">
          <div>
            <h1>2,608 Global Subscribers</h1>
            <div className="stat-line">
              <span>2,608 Subscribers</span>
              <span className="sep">|</span>
              <span>0 Unverified</span>
              <span className="sep">|</span>
              <span>68 Active Referred Visitors</span>
            </div>
          </div>
          <div className="head-actions">
            <button className="link-btn muted">🏆 Pick winner</button>
            <span className="sep" />
            <button className="link-btn muted">📣 Promote</button>
            <button className="btn outline">Export</button>
            <button className="btn primary">Add subscriber</button>
          </div>
        </div>

        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search">
              🔍
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, unique identifier or id"
                aria-label="Search subscribers"
              />
            </div>
            <div className="icon-btn" title="Filter by tag, type or risk">
              <svg viewBox="0 0 24 24" fill="none" role="img" aria-label="Filter by tag, type or risk">
                <path d="M5 6h14M5 12h14M5 18h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="9" cy="6" r="2" fill="currentColor" stroke="currentColor" />
                <circle cx="16" cy="12" r="2" fill="currentColor" stroke="currentColor" />
                <circle cx="10" cy="18" r="2" fill="currentColor" stroke="currentColor" />
              </svg>
            </div>
            <div className="icon-btn" title="Filter by join date">
              <svg viewBox="0 0 24 24" fill="none" role="img" aria-label="Filter by join date">
                <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 9.5h16" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <button className="link-btn" onClick={reset}>
              ↺ Reset
            </button>
          </div>
          <div className="toolbar-right">
            <button className="link-btn muted">🗑 Delete</button>
            <button className="link-btn" onClick={() => setPanelOpen(true)}>
              ⚙ Customize Table
            </button>
          </div>
        </div>

        <div className="table-card">
          <div className="table-scroll">
            <table className={tableCls}>
              <thead>
                <tr className="group-row">
                  <th className="sticky-check" data-group="check" />
                  <th className="sticky-rank" data-group="rank" />
                  <th className="sticky-col" data-group="subscriber" />
                  <th data-group="engagement" colSpan={5}>Engagement</th>
                  <th data-group="progress" colSpan={6}>Impact</th>
                  <th data-group="commissions" colSpan={2}>Payouts</th>
                  <th data-group="actions" />
                </tr>
                <tr className="col-row">
                  <th className="sticky-check" data-group="check">
                    <span className="check-fixed-w">
                      <input
                        ref={headerCheckRef}
                        type="checkbox"
                        className="header-check"
                        title="Select all rows"
                        checked={rows.length > 0 && checkedCount === rows.length}
                        onChange={(e) => {
                          const next: Record<number, boolean> = { ...checked };
                          rows.forEach((r) => (next[r.rank] = e.target.checked));
                          setChecked(next);
                        }}
                      />
                    </span>
                  </th>
                  <th
                    className={`sticky-rank ${sortKey === "rank" ? "sorted" : ""}`}
                    data-group="rank"
                    onClick={() => sortBy("rank")}
                  >
                    <span className="rank-fixed-w">
                      Rank{"\u00A0"}
                      <span className="sort-caret">▾</span>
                    </span>
                  </th>
                  <th className="sticky-col" data-group="subscriber">
                    <span className="header-split">
                      <span
                        className={`split-label ${sortKey === "name" ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sortBy("name");
                        }}
                      >
                        Subscriber{"\u00A0"}
                        <span className="sort-caret">▾</span>
                      </span>
                      <span className="split-sep" />
                      <span
                        className={`split-label ${sortKey === "date" ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sortBy("date");
                        }}
                      >
                        Date{"\u00A0"}
                        <span className="sort-caret">▾</span>
                      </span>
                    </span>
                  </th>

                  {COLUMNS.map((c) => (
                    <Th key={`${c.group}-${String(c.key)}`} colKey={String(c.key)} label={c.label} group={c.group} />
                  ))}
                  <th
                    className="actions-col"
                    data-group="actions"
                    title="Customize columns"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPanelOpen(true);
                    }}
                  >
                    ⚙
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => {
                  let family: (typeof AVATAR_FAMILIES)[number] | null = null;
                  if (d.name) {
                    let idx = hashName(d.name);
                    if (idx === lastFamilyIdx) idx = (idx + 1) % AVATAR_FAMILIES.length;
                    lastFamilyIdx = idx;
                    family = AVATAR_FAMILIES[idx] ?? null;
                  }
                  const rm = riskMeta[d.risk];
                  const isReferral = d.type === "Referred";
                  const isExcluded =
                    d.id === "sub_123hg4ghdf6uhd" ||
                    d.id === "gsub_123hg4ghdf2344" ||
                    d.email === "wcbeel@tradier.com" ||
                    d.email === "yuki.tanaka@loopward.co" ||
                    d.email === "t.klein@ferngate.eu" ||
                    d.email === "aaliyah@moonriverco.com";
                  const status = isReferral && d.confirmed > 0
                    ? { label: "Active Customer", cls: "status-active" }
                    : isExcluded
                      ? null
                      : { label: "Signup", cls: "status-signup" };

                  return (
                    <tr key={d.rank}>
                      <td className="sticky-check" data-group="check">
                        <span className="check-fixed-w">
                          <input
                            type="checkbox"
                            className="row-check"
                            aria-label={`Select ${d.name ?? d.id}`}
                            checked={!!checked[d.rank]}
                            onChange={(e) => setChecked((c) => ({ ...c, [d.rank]: e.target.checked }))}
                          />
                        </span>
                      </td>
                      <td className="sticky-rank" data-group="rank">
                        <span className="rank-fixed-w">
                          <span className="rank-num">#{d.rank}</span>
                        </span>
                      </td>
                      <td className="sticky-col" data-group="subscriber">
                        <div className="subscriber-row">
                          <div className="subscriber-cell">
                            {d.name && family ? (
                              <div className="avatar" style={{ background: family.fill, color: family.ink }}>
                                {initials(d.name)}
                              </div>
                            ) : (
                              <div className="avatar no-identity" role="img" aria-label="No name on file" title="No name on file">
                                <span className="noid-head" />
                                <span className="noid-body" />
                              </div>
                            )}
                            <div className="sub-info">
                              {d.name && (
                                <div className="sub-name">
                                  {d.name}
                                  {d.risk !== "low" && (
                                    <span title={rm.label}>
                                      <FlagIcon cls={rm.cls} label={rm.label} />
                                    </span>
                                  )}
                                </div>
                              )}
                              {d.email ? (
                                <div className="sub-email">{d.email}</div>
                              ) : (
                                <div className="sub-email is-missing">
                                  {d.id}
                                  {d.name && <CautionIcon label="No email on file" />}
                                </div>
                              )}
                              <div className="sub-meta">
                                <span>{d.date}</span>
                                {isReferral && (
                                  <>
                                    <span className="dotsep">·</span>
                                    <span className="type-pill">Referral</span>
                                  </>
                                )}
                                {status && (
                                  <>
                                    <span className="dotsep">·</span>
                                    <span className={`status-pill ${status.cls}`}>{status.label}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {d.tags.length > 0 && (
                            <div className="tag-corner">
                              <span className="tag">{d.tags[0]}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <NumCell v={d.emailsReceived} group="engagement" />
                      <NumCell v={d.smsReceived} group="engagement" />
                      <NumCell v={d.dashboardVisits} group="engagement" />
                      <NumCell v={d.shares} group="engagement" />
                      <NumCell v={d.points} group="engagement" />
                      <NumCell v={d.tasks} group="progress" />
                      <NumCell v={d.visitors} group="progress" />
                      <NumCell v={d.pending} group="progress" />
                      <NumCell v={d.unconfirmed} group="progress" />
                      <NumCell v={d.confirmed} group="progress" />
                      <NumCell v={d.revenue} group="progress" isMoney />
                      <NumCell v={d.commPending} group="commissions" isMoney />
                      <NumCell v={d.commPaid} group="commissions" isMoney />
                      <td className="actions-col" data-group="actions">
                        <button className="kebab-btn" title="Row actions">
                          ⋮
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={`panel-overlay ${panelOpen ? "open" : ""}`} onClick={() => setPanelOpen(false)} />
      <div className={`panel ${panelOpen ? "open" : ""}`}>
        <button className="close" onClick={() => setPanelOpen(false)} aria-label="Close">
          ×
        </button>
        <h3>Customize columns</h3>
        <div className="desc">
          Only the metrics worth comparing across rows are columns. Toggle whole groups instead of flipping 16
          individual switches.
        </div>

        {(
          [
            ["rank", "Rank", "Leaderboard position by points earned"],
            ["engagement", "Engagement", "Emails Received, SMS Received, Dashboard Visits, Shares, Points"],
            ["progress", "Impact", "Tasks, Visitors, Pending, Unconfirmed, Confirmed, Revenue Generated"],
            ["commissions", "Payouts", "Payouts Pending, Payouts Paid"],
          ] as [GroupKey, string, string][]
        ).map(([key, name, cols]) => (
          <div className="group-block" key={key}>
            <div className="gh">
              <div>
                <div className="name">{name}</div>
                <div className="cols">{cols}</div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={groups[key]}
                  aria-label={`Show ${name} columns`}
                  onChange={(e) => setGroups((g) => ({ ...g, [key]: e.target.checked }))}
                />
                <span className="slider" />
              </label>
            </div>
          </div>
        ))}

        <div className="locked-note">
          Subscriber (name, avatar, email, join date, tags, type, risk) is pinned and can't be hidden — those are
          attributes of the record, not metrics to compare, so they live in the card instead of taking up column space.
          Rank is a real, sortable metric (a subscriber's leaderboard standing), so unlike the others it stays its own
          column. Use the filter (☰) and date (📅) icons to narrow by attribute, and the colored flag on the card for an
          at-a-glance risk read.
        </div>
      </div>
    </div>
  );
}
