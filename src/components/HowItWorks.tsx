import { BookOpen, Brain, TrendingUp, Sparkles } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    title: "Check In Daily",
    description: "Select your mood and jot down your thoughts in seconds.",
    color: "from-lavender to-lavender-deep",
  },
  {
    icon: Brain,
    title: "AI Analyzes Gently",
    description: "Our AI understands your emotions with empathy, not judgment.",
    color: "from-sky to-sky-deep",
  },
  {
    icon: Sparkles,
    title: "Get Suggestions",
    description: "Receive personalized, actionable tips tailored to how you feel.",
    color: "from-peach to-peach-deep",
  },
  {
    icon: TrendingUp,
    title: "Track Your Growth",
    description: "See patterns, celebrate progress, and understand yourself better.",
    color: "from-mint to-mint-deep",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-muted/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Simple & Effective
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            How Moodly Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your journey to emotional wellness, made simple and supportive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0" />
              )}
              
              <div className="glass-card p-6 h-full relative z-10 group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
                    <step.icon className="w-6 h-6 text-foreground/80" />
                  </div>
                  <span className="text-3xl font-serif font-bold text-muted-foreground/50">
                    {index + 1}
                  </span>
                </div>
                
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
