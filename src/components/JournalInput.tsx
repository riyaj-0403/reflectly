import { Textarea } from "@/components/ui/textarea";
import { Mic, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface JournalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const JournalInput = ({ value, onChange, onSubmit, isSubmitting }: JournalInputProps) => {
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => setInputMode("text")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
            inputMode === "text"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <PenLine className="w-4 h-4" />
          Write
        </button>
        <button
          onClick={() => setInputMode("voice")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
            inputMode === "voice"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Mic className="w-4 h-4" />
          Voice
        </button>
      </div>

      {inputMode === "text" ? (
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Write freely, without judgment..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[200px] text-base bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl resize-none focus:ring-2 focus:ring-primary/30 transition-all p-4"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {value.length} characters
            </span>
            <Button
              variant="hero"
              size="lg"
              onClick={onSubmit}
              disabled={!value.trim() || isSubmitting}
            >
              {isSubmitting ? "Analyzing..." : "Save & Analyze"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lavender to-peach flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105 animate-pulse-soft">
            <Mic className="w-10 h-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-center">
            Tap to start recording your thoughts<br />
            <span className="text-sm">(Voice feature coming soon)</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default JournalInput;
