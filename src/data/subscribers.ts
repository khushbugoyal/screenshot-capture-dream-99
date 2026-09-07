export type Risk = "low" | "medium" | "serious" | "critical";

export type Subscriber = {
  name: string | null;
  email: string | null;
  id?: string;
  date: string;
  tags: string[];
  type: string;
  referrals: number;
  points: number;
  visits: number;
  visitors: number;
  confirmed: number;
  pending: number;
  unconfirmed: number;
  revenue: number;
  tasks: number;
  commPending: number;
  commPaid: number;
  risk: Risk;
  // derived
  dashboardVisits: number;
  shares: number;
  emailsReceived: number;
  smsReceived: number;
  rank: number;
};

type Raw = Omit<Subscriber, "dashboardVisits" | "shares" | "emailsReceived" | "smsReceived" | "rank">;

const rawData: Raw[] = [
  { name: null, email: null, id: "sub_123hg4ghdf6uhd", date: "Aug 13, 2026", tags: [], type: "Referred", referrals: 0, points: 5, visits: 1, visitors: 0, confirmed: 0, pending: 0, unconfirmed: 0, revenue: 0, tasks: 0, commPending: 0, commPaid: 0, risk: "low" },
  { name: "Wbfba Cbeel", email: "wcbeel@tradier.com", date: "Aug 13, 2026", tags: ["fintech"], type: "Signup", referrals: 0, points: 5, visits: 1, visitors: 0, confirmed: 0, pending: 0, unconfirmed: 0, revenue: 0, tasks: 0, commPending: 0, commPaid: 0, risk: "low" },
  { name: "Marta Alvarez", email: "m.alvarez@brightpath.io", date: "Aug 12, 2026", tags: ["vip"], type: "Referred", referrals: 14, points: 320, visits: 48, visitors: 22, confirmed: 11, pending: 2, unconfirmed: 1, revenue: 2140, tasks: 8, commPending: 180, commPaid: 960, risk: "low" },
  { name: "Devon Price", email: "devon.price@northloop.dev", date: "Aug 12, 2026", tags: ["influencer"], type: "Referred", referrals: 9, points: 210, visits: 31, visitors: 15, confirmed: 6, pending: 3, unconfirmed: 0, revenue: 940, tasks: 5, commPending: 210, commPaid: 340, risk: "medium" },
  { name: "Priya Natarajan", email: null, id: "gsub_123hg4ghdf2344", date: "Aug 12, 2026", tags: ["healthcare"], type: "Signup", referrals: 0, points: 0, visits: 2, visitors: 0, confirmed: 0, pending: 0, unconfirmed: 0, revenue: 0, tasks: 0, commPending: 0, commPaid: 0, risk: "low" },
  { name: "Callum Reyes", email: "callum@driftgoods.com", date: "Aug 11, 2026", tags: ["ecommerce"], type: "Referred", referrals: 2, points: 40, visits: 9, visitors: 3, confirmed: 0, pending: 0, unconfirmed: 2, revenue: 0, tasks: 2, commPending: 0, commPaid: 0, risk: "serious" },
  { name: "Yuki Tanaka", email: "yuki.tanaka@loopward.co", date: "Aug 11, 2026", tags: [], type: "Signup", referrals: 1, points: 15, visits: 3, visitors: 1, confirmed: 1, pending: 0, unconfirmed: 0, revenue: 60, tasks: 1, commPending: 0, commPaid: 12, risk: "low" },
  { name: "Grace Okafor", email: "grace.okafor@havenworks.com", date: "Aug 10, 2026", tags: ["agency"], type: "Referred", referrals: 6, points: 140, visits: 22, visitors: 9, confirmed: 3, pending: 1, unconfirmed: 2, revenue: 410, tasks: 4, commPending: 60, commPaid: 110, risk: "medium" },
  { name: "Tobias Klein", email: "t.klein@ferngate.eu", date: "Aug 10, 2026", tags: [], type: "Signup", referrals: 0, points: 0, visits: 1, visitors: 0, confirmed: 0, pending: 0, unconfirmed: 0, revenue: 0, tasks: 0, commPending: 0, commPaid: 0, risk: "low" },
  { name: "Nina Petrova", email: "nina.petrova@skywardlabs.ai", date: "Aug 9, 2026", tags: ["vip"], type: "Referred", referrals: 22, points: 0, visits: 60, visitors: 1, confirmed: 0, pending: 0, unconfirmed: 20, revenue: 0, tasks: 6, commPending: 0, commPaid: 0, risk: "critical" },
  { name: "Owen Fitzgerald", email: "owen.f@basecliff.com", date: "Aug 9, 2026", tags: ["partner"], type: "Referred", referrals: 5, points: 95, visits: 18, visitors: 7, confirmed: 4, pending: 1, unconfirmed: 0, revenue: 320, tasks: 3, commPending: 40, commPaid: 180, risk: "low" },
  { name: "Aaliyah Brooks", email: "aaliyah@moonriverco.com", date: "Aug 8, 2026", tags: [], type: "Signup", referrals: 0, points: 5, visits: 1, visitors: 0, confirmed: 0, pending: 0, unconfirmed: 0, revenue: 0, tasks: 0, commPending: 0, commPaid: 0, risk: "low" },
  { name: "Chen Wei", email: "chen.wei@harborworks.com", date: "Aug 6, 2026", tags: [], type: "Referred", referrals: 1, points: 15, visits: 4, visitors: 1, confirmed: 0, pending: 1, unconfirmed: 0, revenue: 0, tasks: 1, commPending: 0, commPaid: 0, risk: "low" },
];

export const subscribers: Subscriber[] = rawData.map((d) => {
  const automationViews = d.visitors * 2 + Math.round(d.points / 18);
  return {
    ...d,
    dashboardVisits: d.visits,
    shares: Math.round(d.points / 25) + Math.ceil(d.referrals / 4),
    emailsReceived: Math.round(automationViews * 0.65),
    smsReceived: automationViews - Math.round(automationViews * 0.65),
    rank: 0,
  };
});

// Rank = leaderboard standing by points, tie-broken by referrals. Fixed per
// record; it does not change with the table's sort or filter.
[...subscribers]
  .sort((a, b) => b.points - a.points || b.referrals - a.referrals)
  .forEach((d, i) => {
    d.rank = i + 1;
  });

export const AVATAR_FAMILIES = [
  { name: "purple", fill: "#F0ECFB", ink: "#6A4FC0" },
  { name: "teal", fill: "#E6F5F7", ink: "#2E8A96" },
  { name: "green", fill: "#E4F6EC", ink: "#16793D" },
  { name: "coral", fill: "#FDEDEB", ink: "#B85350" },
  { name: "amber", fill: "#FBF3E2", ink: "#8A6A1E" },
  { name: "blue", fill: "#E9F2FC", ink: "#2F72A8" },
  { name: "pink", fill: "#FBEFFB", ink: "#A24FA9" },
];

export function hashName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % AVATAR_FAMILIES.length;
}

export const riskMeta: Record<Risk, { label: string; cls: string }> = {
  low: { label: "Low risk", cls: "rw-good" },
  medium: { label: "Medium risk", cls: "rw-medium" },
  serious: { label: "High risk", cls: "rw-serious" },
  critical: { label: "Critical risk", cls: "rw-critical" },
};
