import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleTool, ToolName } from "@/lib/tools/tools-handling";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import useConversationStore from "@/stores/useConversationStore";
import { processMessages } from "@/lib/assistant";
export default function Action({
  name,
  functionName,
  parameters,
}: {
  name: string;
  functionName: ToolName;
  parameters: Record<string, any>;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const addConversationItem = useConversationStore(
    (s) => s.addConversationItem
  );
  const modelProvider = useConversationStore((s) => s.modelProvider);
  const removeRecommendedAction = useConversationStore(
    (s) => s.removeRecommendedAction
  );
  const handleConfirm = async () => {
    setLoading(true);
    const result = await handleTool(
      functionName,
      parameters,
      "execute",
      modelProvider
    );
    if (result.result) {
      console.log("Executed function", functionName, parameters, result);
      // Add to conversation as a new assistant message
      addConversationItem({
        role: "assistant",
        content: JSON.stringify(result),
      });
      await processMessages();
    } else {
      console.log("Error executing function", functionName, parameters, result);
    }
    setLoading(false);
    // Close dialog and remove suggested action
    setOpen(false);
    removeRecommendedAction(functionName);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <div className="bg-[#2B83F6] hover:bg-[#2B83F6]/90 text-white px-3 py-1.5 text-sm rounded-lg cursor-pointer">
          {name}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>
            Confirm the action to take to resolve the customer query
          </DialogDescription>
          <DialogDescription>{functionName}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(parameters).map(([key, value]) => (
            <div key={key} className="flex gap-2 items-center">
              <Label htmlFor={key} className="w-24">
                {key}
              </Label>
              <Input id={key} defaultValue={value} className="col-span-3" />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => handleConfirm()}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
