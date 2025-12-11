import React from "react";

import { ToolCallItem } from "@/lib/assistant";
import { BookOpenText, ChevronRight, Clock, Zap } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { agentTools } from "@/config/tools-list";

interface ToolCallProps {
  toolCall: ToolCallItem;
}

function FunctionCall({ toolCall }: ToolCallProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const formatName = (name: string) => {
    return name.replace(/_/g, " ").replace("-", " ");
  };

  return (
    <div className="w-full mb-4">
      <div
        className="flex gap-1 items-center justify-end w-full px-4 text-[#2B83F6]  cursor-pointer"
        onClick={toggleShowDetails}
      >
        <div className="flex gap-2 items-center">
          <Zap size={16} />
          <div className="text-sm font-medium">
            {toolCall.name && agentTools.includes(toolCall.name)
              ? `Suggested ${formatName(toolCall.name || "")}`
              : toolCall.status === "completed"
              ? `Called ${formatName(toolCall.name || "")}`
              : `Calling ${formatName(toolCall.name || "")}...`}
          </div>
        </div>

        <div
          className={`transform transition-transform duration-300 ${
            showDetails ? "rotate-90" : "rotate-0"
          }`}
        >
          <ChevronRight size={16} />
        </div>
      </div>
      {showDetails && (
        <div className="bg-[#fafafa] rounded-xl p-2 mx-2 md:ml-24 mt-4 mb-2">
          <div className="max-h-96 overflow-y-scroll text-xs border-b mx-6 p-2">
            <SyntaxHighlighter
              customStyle={{
                backgroundColor: "#fafafa",
                padding: "8px",
                paddingLeft: "0px",
                marginTop: 0,
                marginBottom: 0,
              }}
              language="json"
              style={coy}
            >
              {JSON.stringify(toolCall.parsedArguments, null, 2)}
            </SyntaxHighlighter>
          </div>
          <div className="max-h-96 overflow-y-scroll mx-6 p-2 text-xs">
            {toolCall.output ? (
              <SyntaxHighlighter
                customStyle={{
                  backgroundColor: "#fafafa",
                  padding: "8px",
                  paddingLeft: "0px",
                  marginTop: 0,
                }}
                language="json"
                style={coy}
              >
                {JSON.stringify(JSON.parse(toolCall.output), null, 2)}
              </SyntaxHighlighter>
            ) : (
              <div className="text-zinc-500 flex items-center gap-2 py-2">
                <Clock size={16} /> Waiting for result...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FileSearchCall({ toolCall }: ToolCallProps) {
  return (
    <div className="flex gap-2 items-center text-[#2B83F6] justify-end w-full mb-4 mr-2">
      <BookOpenText size={16} />
      <div className="text-sm font-medium mb-0.5">
        {toolCall.status === "completed"
          ? "Searched files"
          : "Searching files..."}
      </div>
    </div>
  );
}

export default function ToolCall({ toolCall }: ToolCallProps) {
  return (
    <div className="flex justify-start pt-2">
      {(() => {
        switch (toolCall.tool_type) {
          case "function_call":
            return <FunctionCall toolCall={toolCall} />;
          case "file_search_call":
            return <FileSearchCall toolCall={toolCall} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
