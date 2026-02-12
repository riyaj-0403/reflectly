import { cn } from "@/lib/utils";

const tags = [
  "Stress",
  "Studies",
  "Relationships",
  "Health",
  "Work",
  "Sleep",
  "Family",
  "Finances",
  "Social",
  "Self-care",
];

interface QuickTagsProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const QuickTags = ({ selectedTags, onTagToggle }: QuickTagsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-center text-sm font-medium text-muted-foreground">
        What's on your mind? (optional)
      </h4>
      
      <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickTags;
