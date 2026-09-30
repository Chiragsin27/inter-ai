import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { BadgeCheck, BookOpen, BriefcaseBusiness, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: <Sparkles className="w-7 h-7 text-emerald-600" />,
    bg: "bg-emerald-50 border-emerald-100",
    title: "AI Mock Interviews",
    desc: "Practice with AI-generated questions tailored to your specific role, experience level, and tech stack. Get instant feedback on every answer.",
    href: "/generate",
    cta: "Start practicing",
  },
  {
    icon: <BookOpen className="w-7 h-7 text-sky-600" />,
    bg: "bg-sky-50 border-sky-100",
    title: "Interview Preparation",
    desc: "Access curated guides covering system design, behavioural questions, coding patterns, and industry-specific interview formats.",
    href: "/generate",
    cta: "Explore guides",
  },
  {
    icon: <BriefcaseBusiness className="w-7 h-7 text-purple-600" />,
    bg: "bg-purple-50 border-purple-100",
    title: "Career Coaching",
    desc: "Work through your career goals with structured frameworks. From role transitions to salary negotiation — we've got you covered.",
    href: "/contact",
    cta: "Get in touch",
  },
  {
    icon: <BadgeCheck className="w-7 h-7 text-yellow-600" />,
    bg: "bg-yellow-50 border-yellow-100",
    title: "Resume Building",
    desc: "Craft a resume that beats ATS filters and stands out to hiring managers with role-specific recommendations.",
    href: "/contact",
    cta: "Get in touch",
  },
];

export const ServicesPage = () => {
  return (
    <div className="w-full pb-24">
      <Container className="py-16 space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
            Our <span className="text-emerald-500">Services</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to prepare, practice, and land your dream role.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className={`flex flex-col gap-4 p-8 rounded-2xl border ${s.bg} transition-shadow hover:shadow-md`}
            >
              <div className="p-3 rounded-xl w-fit bg-white shadow-sm">
                {s.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{s.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                {s.desc}
              </p>
              <Link to={s.href}>
                <Button size="sm" variant="outline">
                  {s.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-12 border rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to ace your next interview?
          </h2>
          <p className="text-muted-foreground text-sm">
            Start with a free AI mock interview today.
          </p>
          <Link to="/generate">
            <Button>
              Get Started <Sparkles className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};
