import { Container } from "@/components/container";
import { Brain, Target, Users, Zap } from "lucide-react";

const stats = [
  { label: "Users trained", value: "250k+" },
  { label: "Interviews aced", value: "1.2M+" },
  { label: "Offer rate increase", value: "3×" },
  { label: "Countries", value: "40+" },
];

const values = [
  {
    icon: <Brain className="w-6 h-6 text-emerald-600" />,
    bg: "bg-emerald-50",
    title: "AI-First",
    desc: "We put the latest LLM technology to work so every practice session feels real.",
  },
  {
    icon: <Target className="w-6 h-6 text-sky-600" />,
    bg: "bg-sky-50",
    title: "Outcome Focused",
    desc: "Every feature is designed around one goal — helping you land the job.",
  },
  {
    icon: <Users className="w-6 h-6 text-purple-600" />,
    bg: "bg-purple-50",
    title: "Community Driven",
    desc: "Built with feedback from thousands of engineers, PMs, and designers.",
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-600" />,
    bg: "bg-yellow-50",
    title: "Fast Iteration",
    desc: "We ship improvements every week so you always have the best tool.",
  },
];

export const AboutPage = () => {
  return (
    <div className="w-full pb-24">
      <Container className="py-16 space-y-20">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
            About <span className="text-emerald-500">Inter AI</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Inter AI was built to level the playing field. We believe every
            candidate deserves world-class interview preparation — regardless of
            background or budget.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center p-6 rounded-xl border bg-white shadow-sm"
            >
              <span className="text-3xl font-extrabold text-gray-900">{s.value}</span>
              <span className="text-sm text-muted-foreground mt-1 text-center">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              The interview process is broken. Candidates spend hundreds of
              hours preparing with static resources that don't reflect real
              interviews. We fix that with dynamic, AI-generated questions
              tailored exactly to your role, stack, and experience level.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our feedback engine analyses your spoken answers in real time,
              compares them to expert responses, and gives you an actionable
              rating — so you improve with every session.
            </p>
          </div>
          <img
            src="/assets/img/office.jpg"
            alt="Our team"
            className="w-full max-h-80 object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Values */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-6 rounded-xl border bg-white shadow-sm space-y-3"
              >
                <div className={`p-3 rounded-lg w-fit ${v.bg}`}>{v.icon}</div>
                <h3 className="font-semibold text-gray-900">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};
