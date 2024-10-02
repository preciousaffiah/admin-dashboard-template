import { CircleHelp } from "lucide-react";
import { Button } from "@shadcn-ui/button";

export default function UserPrompt() {
  return (
    <div className="m-2 md:m-6 mb-6 p-4 md:pt-20 bg-easing-gradient rounded-lg border-[0.5px] border-gray-900">
      <CircleHelp className="mb-4 text-black-secondary" />
      <h1 className="mb-3 text-lg font-medium text-black-secondary">
        Need help?
      </h1>
      <p className="mb-4 text-lg font-normal text-black-secondary">
        Click here to join our community of fintech experts
      </p>
      <Button
        className="w-full py-6 text-lg font-normal text-white border-[0.5px] border-gray-700 rounded-lg"
        size="lg"
      >
        Accept invite
      </Button>
    </div>
  );
}
