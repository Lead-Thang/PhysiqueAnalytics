// types/ai-tools.ts
import type { ToolCall } from "./tool-call";

export interface AIResponse {
  text: string;
  audioUrl?: string;
  command?: ToolCall | null;
  timestamp: number; // Unix timestamp indicating when the response was generated
  status: "success" | "error"; // Indicates the result of the operation
  error?: string; // Error message if status is "error"
}