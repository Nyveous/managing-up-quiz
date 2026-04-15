import { useState, useEffect, useCallback, useRef } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────

const LEADERSHIP_QUESTIONS = [
  { text: "Do your colleagues seem to vie for your boss's attention?", cat: 3 },
  { text: "Does your boss often tell you what to do, rather than ask you?", cat: 1 },
  { text: "Does your boss seem unable to make innovative decisions?", cat: 2 },
  { text: "Do you feel that you can approach your boss about any problems?", cat: 4 },
  { text: "Do you feel that your boss does not involve you in decisions?", cat: 1 },
  { text: "Do you feel that your boss lacks creativity?", cat: 2 },
  { text: "Does your boss show little interest in your views?", cat: 1 },
  { text: "Does your boss contribute only when asked?", cat: 5 },
  { text: "Do you often find that changes are made or practices introduced without your consultation?", cat: 1 },
  { text: "Does your boss stick rigidly to the rules?", cat: 2 },
  { text: "Does your boss leave you to get on with minimal input?", cat: 5 },
  { text: "Do you feel that you want to work hard to please your boss?", cat: 3 },
  { text: "Does your boss seem uninvolved except when problems arise?", cat: 5 },
  { text: "Does your boss discourage you from approaching them with problems?", cat: 5 },
  { text: "Does your boss often talk about visions and dreams for the organization?", cat: 3 },
  { text: "Is your boss well liked and well respected by most people?", cat: 3 },
  { text: "Does your boss involve you in most decisions?", cat: 4 },
  { text: "Is your boss often preoccupied with other things?", cat: 2 },
  { text: "Are there regular team meetings to discuss new issues?", cat: 4 },
  { text: "Does your boss often appear inflexible?", cat: 2 },
  { text: "Does your boss rarely introduce anything new without consulting you?", cat: 4 },
  { text: "Does your boss seem uninterested in what you are doing?", cat: 5 },
  { text: "Is your boss happy to hand tasks over to others?", cat: 5 },
  { text: "Do you sometimes feel that you have too much responsibility?", cat: 5 },
];

const THINKING_QUESTIONS = [
  { text: "Does your boss take a long time to complete a task, paying attention to every detail?", cat: 1 },
  { text: "Is your boss easily distracted?", cat: 4 },
  { text: "Does your boss prefer to work on one task at a time?", cat: 3 },
  { text: "Does your boss often seem impatient when you are explaining things?", cat: 2 },
  { text: "Is your boss quite cautious?", cat: 5 },
  { text: "Does your boss resist routine work?", cat: 8 },
  { text: "Is your boss very organized?", cat: 3 },
  { text: "Does your boss dislike being disturbed while working?", cat: 1 },
  { text: "Does your boss have a neat and tidy office?", cat: 3 },
  { text: "Is your boss uninterested in the details, preferring the whole picture?", cat: 2 },
  { text: "Does your boss insist on knowing every little detail about projects you are involved in?", cat: 1 },
  { text: "Does your boss often seem to be doing several things at once?", cat: 4 },
  { text: "Does your boss worry a great deal about the consequences of any decisions?", cat: 5 },
  { text: "Does your boss tend to leave things to the last minute?", cat: 4 },
  { text: "Does your boss like information to be cut to the 'bottom line'?", cat: 4 },
  { text: "Is your boss good at repetitive or perennial tasks?", cat: 7 },
  { text: "Does your boss get excited by the latest fad or innovation?", cat: 8 },
  { text: "Does your boss delegate routine or mundane work to others?", cat: 8 },
  { text: "Does your boss seem, at times, over demanding?", cat: 1 },
  { text: "Does your boss have a regular routine?", cat: 7 },
  { text: "Does your boss seem forgetful and need reminding about details?", cat: 4 },
  { text: "Is your boss full of ideas?", cat: 6 },
  { text: "Does your boss prefer to have time to think things through before making a decision?", cat: 5 },
  { text: "Is your boss rarely late for meetings – and dislikes people who are?", cat: 3 },
  { text: "Does your boss resist change?", cat: 7 },
  { text: "Does your boss love to start new projects?", cat: 6 },
  { text: "Does your boss seem less interested in finishing a task than in starting the next one?", cat: 6 },
  { text: "Does your boss often have a vision or long-term strategic plan?", cat: 2 },
  { text: "Does your boss always seem to be changing things?", cat: 8 },
  { text: "Does your boss sometimes seem unable to consider the consequences of their actions?", cat: 6 },
  { text: "Does your boss prefer to work on existing projects rather than to start new ones?", cat: 7 },
  { text: "Is your boss unlikely to make snap decisions?", cat: 5 },
];

const LEADERSHIP_STYLES = {
  1: {
    label: "Dictatorial",
    color: "#C0392B",
    description:
      "Your boss feels they are in charge for a reason — because they are the best person for the job — and their role is to tell others what to do and how to do it. They are often motivated by a need for power and find it difficult to see things from other people's points of view. They tend to rely on reward and punishment to get the best out of workers.",
    tips: [
      "Build their trust in you gradually and consistently",
      "Ask 'permission' before acting on anything significant",
      "Keep them well informed with regular progress reports",
      "Demonstrate that you carry out their direction willingly and with enthusiasm",
    ],
  },
  2: {
    label: "Bureaucratic",
    color: "#8E44AD",
    description:
      "Your boss got where they are by following the rules, and sees no reason to change that philosophy now. They lack entrepreneurial risk-taking qualities, but are law-abiding and reliable. Any queries, problems, or decisions are handled by referring to the rulebook. They like everything written down and use forms and paperwork extensively.",
    tips: [
      "Submit any requests in writing — always",
      "Do not expect any diversion from established rules",
      "Supply them with relevant rules or precedents to help with decisions",
      "Keep written records of everything you do",
    ],
  },
  3: {
    label: "Charismatic",
    color: "#D35400",
    description:
      "Your boss motivates their team by inspiring them to achieve the organization's goals rather than pursue personal interests. They lead by personal example and typically earn great loyalty and hard work from their team. They often have a strong drive to act for the greater good of the organization, even at the expense of personal desires.",
    tips: [
      "Be enthusiastic about their vision and long-term dreams",
      "Demonstrate that you put the company's interests before your own",
      "Show genuine loyalty to your boss and the organization",
      "Demonstrate belief in their plans and ideas",
    ],
  },
  4: {
    label: "Consultative",
    color: "#1A7A4A",
    description:
      "Your boss involves and consults their team at every opportunity. Decisions are made with staff input and changes are discussed thoroughly. They may sometimes struggle with solo decision-making, preferring to share the burden. They value the team's perspective deeply.",
    tips: [
      "Be eager to share in decision-making processes",
      "Don't be afraid to voice your opinion — it's valued",
      "Offer encouragement and praise for their leadership",
      "Involve them in social activities like lunch or after-work gatherings",
    ],
  },
  5: {
    label: "Laissez-faire",
    color: "#2980B9",
    description:
      "Your boss observes that the team works well independently and makes a conscious decision to leave people to it without interfering. They are comfortable with delegation and trust. This boss typically operates with a 'cooperate and trust' attitude and is confident that the team can manage without constant oversight.",
    tips: [
      "Show that you can be trusted to get on with tasks independently",
      "Send regular emails to keep them informed of your progress",
      "Seek help only when genuine problems arise",
      "Don't bother them with trivial concerns or minor issues",
    ],
  },
};

const THINKING_STYLES = {
  1: {
    label: "Detail-Conscious",
    color: "#2C3E50",
    description:
      "Your boss prefers to process information in small, bite-size chunks. They pay close attention to detail and are thorough and tenacious. They also like to communicate information in this same level of detail. They think in terms of days, weeks, and months rather than years.",
    tips: [
      "Give them lots of information, regularly and thoroughly",
      "Make everything as clear and unambiguous as possible",
      "Provide written updates frequently",
      "Pre-arrange meetings rather than dropping by; don't disturb them mid-task",
    ],
  },
  2: {
    label: "Big-Chunk",
    color: "#7D6608",
    description:
      "Your boss likes a high-level overview and becomes impatient when given too much detail. They think long-term and are skilled at developing overall strategy. They are typically fast processors because they skip over finer details — and they expect you to handle those details for them.",
    tips: [
      "Give them a general overview, not a deep dive into specifics",
      "Handle the small details yourself so they don't have to",
      "Use bullet points or key highlights in any reports",
      "Frame conversations in long-term strategic terms, not day-to-day",
    ],
  },
  3: {
    label: "Left-Brain",
    color: "#154360",
    description:
      "Your boss has a strong preference for order and logic. They are organized, focused, and like to finish one task before starting another. They prefer writing things down and have excellent time-management systems. Punctuality and structured thinking are non-negotiable values for them.",
    tips: [
      "Present thoughts and ideas in a logical, structured sequence",
      "Always arrive on time — never be late to meetings",
      "Meet every deadline you commit to",
      "Don't overwhelm them with too many issues at once; triage first",
    ],
  },
  4: {
    label: "Right-Brain",
    color: "#7B241C",
    description:
      "Your boss multitasks constantly and may have an untidy workspace. They tend to panic over deadlines, often forget details, and sometimes confuse tasks they've imagined doing with tasks they've actually done. They thrive on variety but can struggle with follow-through.",
    tips: [
      "Help them with time management — gently and regularly",
      "Offer extra help as deadlines approach",
      "Write important points down for them so nothing slips",
      "Send gentle reminders about key tasks and commitments",
    ],
  },
  5: {
    label: "Reactive",
    color: "#1E8449",
    description:
      "Your boss is thoughtful, cautious, and preoccupied with consequences. They prefer the status quo unless given a very compelling reason to change. They respond well to direct requests but may require so much information before deciding that subordinates grow frustrated with the pace.",
    tips: [
      "Make sure they are fully informed before asking for decisions",
      "Help them think through the consequences of any decision you want them to make",
      "Give them plenty of time and space — don't rush",
      "Show that you have considered every possible scenario and eventuality",
    ],
  },
  6: {
    label: "Proactive",
    color: "#884EA0",
    description:
      "Your boss is an initiator who loves to start new projects — though they don't always see them through before chasing the next exciting idea. In their enthusiasm, they may skip careful evaluation of alternatives or fail to pay enough attention to detail. They are energized by possibility and momentum.",
    tips: [
      "Bring exciting new ideas to them — they love fresh thinking",
      "Offer to help complete the projects they lose steam on",
      "Match their enthusiasm for new ideas and directions",
      "Survey alternatives carefully on their behalf, since they often won't",
    ],
  },
  7: {
    label: "Sameness",
    color: "#616A6B",
    description:
      "Your boss values familiarity and stability and does not respond well to change. They have a low tolerance for difference and tend to reject what is new. They are likely to have been in their role for many years, neither seeking promotion nor new directions.",
    tips: [
      "Frame new tasks by pointing out how similar they are to existing ones",
      "Aid decision-making by referencing a previous, similar situation",
      "Resist the temptation to suggest a flood of new ideas",
      "Help them cope with unavoidable change by suggesting a gradual transition",
    ],
  },
  8: {
    label: "Differences",
    color: "#CB4335",
    description:
      "Your boss embraces change and thrives on new ideas. They encourage fresh approaches and are always looking for better ways of working. They likely move jobs frequently and show little patience for mundane or repetitive work.",
    tips: [
      "Highlight what makes new ideas genuinely different from the old approach",
      "Think laterally and don't be afraid to propose unconventional solutions",
      "Proactively bring new ideas, tools, and opportunities to their attention",
      "React positively and with energy to any new change or reorganization",
    ],
  },
};

const LABELS = ["Never", "Rarely", "Sometimes", "Often", "Always"];

// ─── URL ENCODING ─────────────────────────────────────────────────────────────

function encodeResults(leaderScores, thinkScores) {
  const l = Object.values(leaderScores).join(",");
  const t = Object.values(thinkScores).join(",");
  return btoa(`${l}|${t}`);
}

function decodeResults(encoded) {
  try {
    const raw = atob(encoded);
    const [lPart, tPart] = raw.split("|");
    const lVals = lPart.split(",").map(Number);
    const tVals = tPart.split(",").map(Number);
    const leader = {};
    lVals.forEach((v, i) => (leader[i + 1] = v));
    const think = {};
    tVals.forEach((v, i) => (think[i + 1] = v));
    return { leader, think };
  } catch {
    return null;
  }
}

// ─── SCORING ─────────────────────────────────────────────────────────────────

function computeScores(questions, answers, styleMap) {
  const totals = {};
  const counts = {};
  Object.keys(styleMap).forEach((k) => { totals[k] = 0; counts[k] = 0; });
  questions.forEach((q, i) => {
    const cat = String(q.cat);
    const raw = answers[i] ?? 3;
    totals[cat] = (totals[cat] || 0) + (raw - 1);
    counts[cat] = (counts[cat] || 0) + 1;
  });
  const normalized = {};
  Object.keys(styleMap).forEach((k) => {
    const max = 4 * (counts[k] || 1);
    normalized[k] = Math.round(((totals[k] || 0) / max) * 100);
  });
  return normalized;
}

function getPrimary(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function getSecondary(scores, primaryKey) {
  const topScore = scores[primaryKey];
  const threshold = topScore * 0.75;
  return Object.entries(scores)
    .filter(([k, v]) => k !== primaryKey && v >= threshold)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

// ─── GLOBAL STYLES (injected once) ───────────────────────────────────────────

const GLOBAL_CSS = `
  .qbtn-primary {
    display: block; width: 100%; padding: 14px 24px;
    font-size: 15px; font-weight: 500;
    background: var(--color-text-primary); color: var(--color-background-primary);
    border: none; border-radius: 8px; cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    font-family: var(--font-sans);
  }
  .qbtn-primary:hover { opacity: 0.82; }
  .qbtn-primary:active { transform: scale(0.98); opacity: 0.9; }

  .qbtn-secondary {
    font-size: 13px; font-weight: 500; padding: 9px 16px;
    background: var(--color-background-primary); color: var(--color-text-primary);
    border: 1.5px solid var(--color-border-secondary);
    border-radius: 7px; cursor: pointer;
    transition: background 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.1s;
    font-family: var(--font-sans);
    display: inline-flex; align-items: center; gap: 6px;
  }
  .qbtn-secondary:hover {
    background: var(--color-background-secondary);
    border-color: var(--color-border-primary);
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .qbtn-secondary:active { transform: scale(0.97); box-shadow: none; }
  .qbtn-secondary.success {
    background: #d4edda; color: #155724; border-color: #c3e6cb;
  }

  .qbtn-ghost {
    font-size: 13px; padding: 9px 14px;
    background: transparent; color: var(--color-text-secondary);
    border: 1.5px solid var(--color-border-tertiary);
    border-radius: 7px; cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s, transform 0.1s;
    font-family: var(--font-sans);
    text-decoration: underline;
    text-decoration-color: transparent;
    text-underline-offset: 2px;
  }
  .qbtn-ghost:hover {
    color: var(--color-text-primary);
    border-color: var(--color-border-secondary);
    background: var(--color-background-secondary);
    text-decoration-color: var(--color-border-secondary);
  }
  .qbtn-ghost:active { transform: scale(0.97); }
  .qbtn-ghost:disabled { opacity: 0.3; cursor: default; pointer-events: none; text-decoration: none; }

  .scale-btn {
    flex: 1; padding: 10px 4px; font-size: 12px;
    border-radius: 6px; cursor: pointer;
    transition: background 0.12s, color 0.12s, border-color 0.12s, transform 0.1s;
    line-height: 1.3; text-align: center; font-family: var(--font-sans);
    border-width: 1.5px; border-style: solid;
  }
  .scale-btn.unselected { background: var(--color-background-primary); color: var(--color-text-secondary); border-color: var(--color-border-tertiary); font-weight: 400; }
  .scale-btn.unselected:hover { background: var(--color-background-secondary); border-color: var(--color-border-secondary); color: var(--color-text-primary); }
  .scale-btn.selected { background: var(--color-text-primary); color: var(--color-background-primary); border-color: var(--color-text-primary); font-weight: 500; }
  .scale-btn:active { transform: scale(0.96); }

  .dot-btn {
    width: 10px; height: 10px; border-radius: 2px;
    border: none; cursor: pointer; padding: 0;
    transition: background 0.15s, transform 0.12s;
  }
  .dot-btn:hover { transform: scale(1.5); }
  .dot-btn:active { transform: scale(1.1); }
`;

function StyleInjector() {
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "managing-up-quiz-styles";
    if (!document.getElementById("managing-up-quiz-styles")) {
      el.textContent = GLOBAL_CSS;
      document.head.appendChild(el);
    }
    return () => { const existing = document.getElementById("managing-up-quiz-styles"); if (existing) existing.remove(); };
  }, []);
  return null;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
          {current} / {total}
        </span>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 3, background: "var(--color-border-tertiary)", borderRadius: 99 }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "var(--color-text-primary)",
          borderRadius: 99, transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  );
}

// Radar chart with static below-chart tooltip (no floating overlay conflicts)
function RadarChartPanel({ data, title, accentColor }) {
  const [hovered, setHovered] = useState(null);

  const customTick = (props) => {
    const { x, y, cx, cy, payload } = props;
    const isActive = hovered?.label === payload.value;
    const lx = x + (x - cx) * 0.15;
    const ly = y + (y - cy) * 0.15;
    const anchor = lx < cx - 4 ? "end" : lx > cx + 4 ? "start" : "middle";
    return (
      <text
        key={payload.value}
        x={lx}
        y={ly}
        textAnchor={anchor}
        dominantBaseline="middle"
        fill={isActive ? accentColor : "var(--color-text-secondary)"}
        fontWeight={isActive ? 500 : 400}
        style={{ fontSize: 10.5, fontFamily: "var(--font-sans)", transition: "fill 0.15s" }}
      >
        {payload.value}
      </text>
    );
  };

  // Use `index` to look up the data item directly — avoids Recharts payload shape ambiguity
  const customDot = (props) => {
    const { cx, cy, index } = props;
    const item = data[index];
    if (!item) return null;
    const isActive = hovered?.label === item.label;
    return (
      <circle
        key={`dot-${index}`}
        cx={cx} cy={cy}
        r={isActive ? 3.5 : 2}
        fill={accentColor}
        fillOpacity={isActive ? 0.9 : 0.5}
        stroke={accentColor}
        strokeWidth={isActive ? 1 : 0}
        style={{ cursor: "pointer", transition: "r 0.12s, fill-opacity 0.12s" }}
        onMouseEnter={() => setHovered(item)}
        onMouseLeave={() => setHovered(null)}
      />
    );
  };

  return (
    <div style={{ minWidth: 0 }}>
      <p style={{
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
        color: "var(--color-text-secondary)", fontWeight: 500, margin: "0 0 4px",
      }}>
        {title}
      </p>
      {/* overflow:hidden keeps labels from bleeding into sibling column */}
      <div style={{ overflow: "hidden", width: "100%" }}>
        <ResponsiveContainer width="100%" height={210}>
          <RadarChart
            data={data}
            margin={{ top: 26, right: 30, bottom: 26, left: 30 }}
            onMouseLeave={() => setHovered(null)}
          >
            <PolarGrid stroke="var(--color-border-tertiary)" />
            <PolarAngleAxis
              dataKey="label"
              tick={customTick}
              tickLine={false}
              axisLine={false}
            />
            <Radar
              dataKey="value"
              stroke={accentColor}
              fill={accentColor}
              fillOpacity={0.15}
              strokeWidth={2}
              dot={customDot}
              activeDot={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Static tooltip zone below chart — no floating conflicts */}
      <div style={{ height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {hovered ? (
          <div style={{
            background: "var(--color-background-primary)",
            border: "1px solid var(--color-border-secondary)",
            borderRadius: 6, padding: "4px 12px", fontSize: 12,
            color: "var(--color-text-primary)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontWeight: 500 }}>{hovered.label}</span>
            <span style={{ color: "var(--color-text-secondary)" }}>—</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, color: accentColor }}>
              {hovered.value}%
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 11, color: "var(--color-text-secondary)", opacity: 0.55 }}>
            hover a point to see score
          </span>
        )}
      </div>
    </div>
  );
}

function StyleCard({ styleData, role, isSecondary }) {
  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: `1px solid var(--color-border-${isSecondary ? "tertiary" : "secondary"})`,
      borderRadius: 12, padding: "20px 24px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: styleData.color, flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", fontWeight: 500 }}>
            {role}{isSecondary ? " (secondary)" : ""}
          </span>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)" }}>
            {styleData.label}
          </h3>
        </div>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)", margin: "0 0 16px" }}>
        {styleData.description}
      </p>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "14px 16px" }}>
        <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", fontWeight: 500, margin: "0 0 10px" }}>
          How to manage this style
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7, color: "var(--color-text-primary)" }}>
          {styleData.tips.map((tip, i) => (
            <li key={i} style={{ marginBottom: 6 }}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ScoreRow({ styles, scores, primaryKey }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
      {Object.entries(styles).map(([k, v]) => (
        <div key={k} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "7px 12px", borderRadius: 6,
          background: k === primaryKey ? "var(--color-background-secondary)" : "transparent",
          border: k === primaryKey ? "1px solid var(--color-border-secondary)" : "1px solid transparent",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: v.color }} />
            <span style={{ fontSize: 12, color: "var(--color-text-primary)" }}>{v.label}</span>
          </div>
          <span style={{
            fontSize: 12, fontFamily: "var(--font-mono)",
            color: k === primaryKey ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            fontWeight: k === primaryKey ? 500 : 400,
          }}>
            {scores[k]}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const PHASE = { WELCOME: "welcome", LEADER: "leader", THINKING: "thinking", RESULTS: "results" };

export default function App() {
  const [phase, setPhase] = useState(PHASE.WELCOME);
  const [leaderAnswers, setLeaderAnswers] = useState({});
  const [thinkAnswers, setThinkAnswers] = useState({});
  // currentQ = 0-based index of the question currently displayed
  const [currentQ, setCurrentQ] = useState(0);
  const [copyState, setCopyState] = useState("idle"); // idle | copied | fallback
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("r");
    if (encoded) {
      const decoded = decodeResults(encoded);
      if (decoded) { setResultData(decoded); setPhase(PHASE.RESULTS); }
    }
  }, []);

  const isLeader = phase === PHASE.LEADER;
  const currentQuestions = isLeader ? LEADERSHIP_QUESTIONS : THINKING_QUESTIONS;
  const currentAnswers = isLeader ? leaderAnswers : thinkAnswers;
  const setCurrentAnswers = isLeader ? setLeaderAnswers : setThinkAnswers;
  const totalQuestions = currentQuestions.length;
  const answeredCount = Object.keys(currentAnswers).length;

  // displayNumber is 1-based and always matches currentQ + 1
  // Both the "Q{n}" label and the "n / total" counter use this same value
  const displayNumber = currentQ + 1;

  const handleAnswer = useCallback((value) => {
    setCurrentAnswers((prev) => ({ ...prev, [currentQ]: value }));
    setTimeout(() => {
      if (currentQ < totalQuestions - 1) setCurrentQ((q) => q + 1);
    }, 120);
  }, [currentQ, totalQuestions, setCurrentAnswers]);

  // Back: go to previous question AND clear that question's answer so the count drops
  const handleBack = useCallback(() => {
    if (currentQ === 0) return;
    const prevQ = currentQ - 1;
    setCurrentAnswers((prev) => {
      const next = { ...prev };
      delete next[prevQ];
      return next;
    });
    setCurrentQ(prevQ);
  }, [currentQ, setCurrentAnswers]);

  const handleFinishSection = useCallback(() => {
    if (phase === PHASE.LEADER) {
      setCurrentQ(0);
      setPhase(PHASE.THINKING);
    } else {
      const leaderScores = computeScores(LEADERSHIP_QUESTIONS, leaderAnswers, LEADERSHIP_STYLES);
      const thinkScores = computeScores(THINKING_QUESTIONS, thinkAnswers, THINKING_STYLES);
      setResultData({ leader: leaderScores, think: thinkScores });
      setPhase(PHASE.RESULTS);
      const encoded = encodeResults(leaderScores, thinkScores);
      const url = new URL(window.location.href);
      url.searchParams.set("r", encoded);
      window.history.replaceState({}, "", url.toString());
    }
  }, [phase, leaderAnswers, thinkAnswers]);

  const handleCopyLink = useCallback(() => {
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => { setCopyState("copied"); setTimeout(() => setCopyState("idle"), 2500); })
        .catch(() => { setFallbackUrl(url); setCopyState("fallback"); });
    } else {
      setFallbackUrl(url);
      setCopyState("fallback");
    }
  }, []);

  const handleRetake = useCallback(() => {
    setLeaderAnswers({}); setThinkAnswers({});
    setCurrentQ(0); setResultData(null);
    setPhase(PHASE.WELCOME);
    const url = new URL(window.location.href);
    url.searchParams.delete("r");
    window.history.replaceState({}, "", url.toString());
  }, []);

  // ── WELCOME ──
  if (phase === PHASE.WELCOME) {
    return (
      <>
        <StyleInjector />
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px" }}>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: 16 }}>
            Managing Up
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.2, margin: "0 0 16px", color: "var(--color-text-primary)" }}>
            What's your boss's personality type?
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-text-secondary)", marginBottom: 32 }}>
            This quiz is based on two books on managing up. Answer 56 questions
            about your boss to identify their leadership and thinking style —
            then get tailored tips on how to work with them more effectively.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
            {[["Part 1", "Leadership style", "24 questions", "5 styles"], ["Part 2", "Thinking style", "32 questions", "8 styles"]].map(([part, label, qs, styles]) => (
              <div key={part} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "16px 18px" }}>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-secondary)", margin: "0 0 6px", fontWeight: 500 }}>{part}</p>
                <p style={{ fontWeight: 500, fontSize: 14, margin: "0 0 4px", color: "var(--color-text-primary)" }}>{label}</p>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>{qs} · {styles}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
            Rate each statement from 1 (Never) to 5 (Always) based on how well it describes your boss.
            Takes about 5–7 minutes.
          </p>
          <button className="qbtn-primary" onClick={() => setPhase(PHASE.LEADER)}>
            Start Part 1 — Leadership Style →
          </button>
        </div>
      </>
    );
  }

  // ── QUESTIONS ──
  if (phase === PHASE.LEADER || phase === PHASE.THINKING) {
    const q = currentQuestions[currentQ];
    const allAnswered = answeredCount === totalQuestions;
    const partLabel = isLeader ? "Part 1 of 2 — Leadership Style" : "Part 2 of 2 — Thinking Style";
    const nextLabel = isLeader ? "Continue to Part 2 →" : "See Results →";
    const remaining = totalQuestions - answeredCount;

    return (
      <>
        <StyleInjector />
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-secondary)", fontWeight: 500, margin: 0 }}>
              {partLabel}
            </p>
            <button className="qbtn-ghost" onClick={handleBack} disabled={currentQ === 0}>
              ← Back
            </button>
          </div>

          {/* displayNumber matches Q{n} below — both always equal currentQ + 1 */}
          <ProgressBar current={displayNumber} total={totalQuestions} />

          <div style={{
            background: "var(--color-background-primary)",
            border: "1px solid var(--color-border-tertiary)",
            borderRadius: 12, padding: "24px", marginBottom: 20, minHeight: 80,
          }}>
            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 12px", fontFamily: "var(--font-mono)" }}>
              Q{displayNumber}
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--color-text-primary)", margin: 0 }}>
              {q.text}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                className={`scale-btn ${currentAnswers[currentQ] === v ? "selected" : "unselected"}`}
                onClick={() => handleAnswer(v)}
              >
                {v}
                <br />
                <span style={{ fontSize: 10, opacity: 0.7 }}>{LABELS[v - 1]}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 24 }}>
            {currentQuestions.map((_, i) => (
              <button
                key={i}
                className="dot-btn"
                onClick={() => setCurrentQ(i)}
                title={`Q${i + 1}${currentAnswers[i] !== undefined ? ` — ${LABELS[currentAnswers[i] - 1]}` : " — not answered"}`}
                style={{
                  background:
                    i === currentQ ? "var(--color-text-primary)"
                    : currentAnswers[i] !== undefined ? "var(--color-border-secondary)"
                    : "var(--color-border-tertiary)",
                }}
              />
            ))}
          </div>

          {allAnswered ? (
            <button className="qbtn-primary" onClick={handleFinishSection}>{nextLabel}</button>
          ) : (
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", textAlign: "center" }}>
              {remaining} question{remaining !== 1 ? "s" : ""} remaining — use the dots above to navigate
            </p>
          )}
        </div>
      </>
    );
  }

  // ── RESULTS ──
  if (phase === PHASE.RESULTS && resultData) {
    const { leader: leaderScores, think: thinkScores } = resultData;
    const primaryLeaderKey = getPrimary(leaderScores);
    const secondaryLeaderKey = getSecondary(leaderScores, primaryLeaderKey);
    const primaryThinkKey = getPrimary(thinkScores);
    const secondaryThinkKey = getSecondary(thinkScores, primaryThinkKey);

    const leaderRadarData = Object.entries(LEADERSHIP_STYLES).map(([k, v]) => ({ label: v.label, value: leaderScores[k] ?? 0 }));
    const thinkRadarData = Object.entries(THINKING_STYLES).map(([k, v]) => ({ label: v.label, value: thinkScores[k] ?? 0 }));

    return (
      <>
        <StyleInjector />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-text-secondary)", fontWeight: 500, margin: "0 0 6px" }}>
                Your results
              </p>
              <h1 style={{ fontSize: 24, fontWeight: 500, margin: 0, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
                {LEADERSHIP_STYLES[primaryLeaderKey].label} · {THINKING_STYLES[primaryThinkKey].label}
              </h1>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16, alignItems: "center" }}>
              <button
                className={`qbtn-secondary${copyState === "copied" ? " success" : ""}`}
                onClick={handleCopyLink}
              >
                {copyState === "copied" ? "✓ Copied!" : copyState === "fallback" ? "Copy below ↓" : "Copy link"}
              </button>
              <button className="qbtn-ghost" onClick={handleRetake}>Retake</button>
            </div>
          </div>

          {/* Clipboard fallback input */}
          {copyState === "fallback" && (
            <div style={{
              background: "var(--color-background-secondary)", border: "1px solid var(--color-border-tertiary)",
              borderRadius: 8, padding: "12px 16px", marginBottom: 20,
            }}>
              <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 8px", fontWeight: 500 }}>
                Copy this URL to share your results:
              </p>
              <input
                readOnly value={fallbackUrl} onFocus={(e) => e.target.select()}
                style={{
                  width: "100%", fontSize: 12, fontFamily: "var(--font-mono)",
                  padding: "8px 10px", borderRadius: 6,
                  border: "1px solid var(--color-border-secondary)",
                  background: "var(--color-background-primary)",
                  color: "var(--color-text-primary)", boxSizing: "border-box",
                }}
              />
            </div>
          )}

          {/* Radar charts — each clipped so labels respect column boundary */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
            background: "var(--color-background-secondary)",
            borderRadius: 12, padding: "20px 16px 12px", marginBottom: 28,
          }}>
            <RadarChartPanel data={leaderRadarData} title="Leadership style" accentColor="#2C3E50" />
            <RadarChartPanel data={thinkRadarData} title="Thinking style" accentColor="#884EA0" />
          </div>

          {/* Leadership breakdown */}
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-secondary)", fontWeight: 500, margin: "0 0 8px" }}>
            Leadership style
          </p>
          <ScoreRow styles={LEADERSHIP_STYLES} scores={leaderScores} primaryKey={primaryLeaderKey} />
          <StyleCard styleData={LEADERSHIP_STYLES[primaryLeaderKey]} role="Leadership style" isSecondary={false} />
          {secondaryLeaderKey && <StyleCard styleData={LEADERSHIP_STYLES[secondaryLeaderKey]} role="Leadership style" isSecondary={true} />}

          {/* Thinking breakdown */}
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-secondary)", fontWeight: 500, margin: "24px 0 8px" }}>
            Thinking style
          </p>
          <ScoreRow styles={THINKING_STYLES} scores={thinkScores} primaryKey={primaryThinkKey} />
          <StyleCard styleData={THINKING_STYLES[primaryThinkKey]} role="Thinking style" isSecondary={false} />
          {secondaryThinkKey && <StyleCard styleData={THINKING_STYLES[secondaryThinkKey]} role="Thinking style" isSecondary={true} />}

          <div style={{
            borderTop: "1px solid var(--color-border-tertiary)",
            paddingTop: 20, marginTop: 12,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>
              Based on <em>Managing Your Boss in a Week</em> & <em>The Unwritten Rules of Managing Up</em>
            </p>
            <button className="qbtn-ghost" onClick={handleRetake}>Retake quiz</button>
          </div>
        </div>
      </>
    );
  }

  return null;
}