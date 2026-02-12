import { Button } from "@/components/ui/button";
import { CheckCircle, Lightbulb, Heart, RefreshCw } from "lucide-react";

interface AISuggestionsProps {
  mood: string;
  tags: string[];
  onNewEntry: () => void;
}

const moodSuggestions: Record<string, { task: string; question: string; activity: string; message: string }> = {
  Happy: {
    message: "You're radiating positivity today! 🌟",
    task: "Capture what made today special in a gratitude note",
    question: "What small joy can you share with someone else today?",
    activity: "Set a positive intention for tomorrow",
  },
  Sad: {
    message: "It's okay to feel this way. You're not alone. 💙",
    task: "Write one thing you did well today, no matter how small",
    question: "What's one tiny thing that could bring you comfort right now?",
    activity: "Try a 2-minute breathing exercise to gently ease your mind",
  },
  Anxious: {
    message: "Let's take this moment by moment. You've got this. 🌿",
    task: "Break one big worry into a small, manageable step",
    question: "What's one thing within your control right now?",
    activity: "Try the 5-4-3-2-1 grounding exercise",
  },
  Calm: {
    message: "What a peaceful state to be in. Savor it. ✨",
    task: "Notice what helped you reach this calm state",
    question: "How can you recreate this feeling tomorrow?",
    activity: "A short mindfulness meditation to deepen this peace",
  },
  Angry: {
    message: "Your feelings are valid. Let's process them gently. 🔥",
    task: "Write down what triggered this feeling without judgment",
    question: "What boundary might need to be set here?",
    activity: "Physical movement—try a quick walk or stretch",
  },
  Tired: {
    message: "Rest is productive too. Be gentle with yourself. 😴",
    task: "Identify one thing you can postpone or delegate",
    question: "What's draining your energy the most lately?",
    activity: "A 10-minute power rest or body scan relaxation",
  },
  Excited: {
    message: "Your enthusiasm is contagious! Channel it well. ⚡",
    task: "Write down your top priorities while you have this energy",
    question: "What's fueling this excitement? Capture it!",
    activity: "Share your excitement with someone who'd appreciate it",
  },
  neutral: {
    message: "Every feeling is worth exploring. 🌸",
    task: "Take a moment to check in with your body",
    question: "What would make today feel meaningful?",
    activity: "A 5-minute journaling session about your current state",
  },
};

const AISuggestions = ({ mood, tags, onNewEntry }: AISuggestionsProps) => {
  const suggestions = moodSuggestions[mood] || moodSuggestions.neutral;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Analysis Summary */}
      <div className="glass-card p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-lavender to-mint flex items-center justify-center">
          <Heart className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
          {suggestions.message}
        </h2>
        <p className="text-muted-foreground">
          Based on your check-in, here are some gentle suggestions for you.
        </p>
        
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender to-lavender-deep flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-foreground/80" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Small Action</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {suggestions.task}
          </p>
        </div>

        <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky to-sky-deep flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-foreground/80" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Reflection</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {suggestions.question}
          </p>
        </div>

        <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-peach to-peach-deep flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-foreground/80" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Activity</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {suggestions.activity}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button variant="hero" size="lg" onClick={onNewEntry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          New Check-in
        </Button>
        <Button variant="hero-outline" size="lg" asChild>
          <a href="/dashboard">View Mood History</a>
        </Button>
      </div>
    </div>
  );
};

export default AISuggestions;
