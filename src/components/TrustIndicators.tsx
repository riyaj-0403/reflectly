import { Shield, Lock, Heart } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your journal is encrypted and never shared. Your thoughts belong to you.",
  },
  {
    icon: Heart,
    title: "Emotion-Aware AI",
    description: "Gentle insights that understand how you feel, without judgment.",
  },
  {
    icon: Lock,
    title: "Your Data, Your Control",
    description: "Export or delete your data anytime. No ads, no selling data.",
  },
];

const TrustIndicators = () => {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Built with your wellbeing in mind
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We believe mental wellness starts with trust. That's why privacy and safety are at our core.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`glass-card p-8 text-center group hover:scale-105 transition-all duration-300 animate-fade-in-up-delay-${index + 1}`}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-lavender to-sky flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
