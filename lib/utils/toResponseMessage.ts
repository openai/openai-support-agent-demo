export type ResponseContentItem =
  | { type: "input_text" | "output_text"; text: string }
  | {
      type: "input_image";
      image_url: string;
      detail?: "low" | "high" | "auto";
    };

export type ResponseMessage = {
  role: string;
  content: ResponseContentItem[];
};

export function toResponseMessage(role: string, text: string): ResponseMessage {
  return {
    role,
    content: [
      { type: role === "assistant" ? "output_text" : "input_text", text },
    ],
  };
}
