import { Check, Clipboard, SquareCheck } from "lucide-react";
import { useState } from "react";

const Copy = ({ textToCopy }: { textToCopy: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    // Use the Clipboard API to copy the text
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div>
      <button
        onClick={handleCopy}
        className="px-1 py-1 bg-secondaryBorder text-foreground rounded hover:bg-primary"
      >
        {isCopied ? (
          <Check className="md:size-4 size-3" />
        ) : (
          <Clipboard className="md:size-4 size-3" />
        )}
      </button>
    </div>
  );
};

export default Copy;
