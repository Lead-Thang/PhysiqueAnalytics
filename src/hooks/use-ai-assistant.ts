// hooks/use-ai-assistant.ts
"use client";

// @ts-ignore: Temporarily bypassing module import error
import React, { useState, useCallback, FormEvent } from "react";
// @ts-ignore: Temporarily bypassing module import error
import type { UseModelViewerReturn } from "./use-model-viewer";
// @ts-ignore: Temporarily bypassing module import error
import type { ModelObject } from "../types/model-object"; // Ensure this path is correct
// @ts-ignore: Temporarily bypassing module import error
import type { ToolCall, ToolName } from "../types/tool-call"; // Import standardized types
// @ts-ignore: Temporarily bypassing module import error
import { ChatMistralAI } from 'langchain-mistralai';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Initialize Mistral AI client
const MISTRAL_API_KEY = process.env.NEXT_PUBLIC_MISTRAL_API_KEY || 'y5th1XKBGV3NjGh9tRppbA84BdJ9g6Pt';
const mistral = new ChatMistralAI({
  apiKey: MISTRAL_API_KEY,
  model: 'open-mistral-7b',
});

export function useAIAssistant(viewerActions?: UseModelViewerReturn) {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm Conceivo, your AI assistant for Conceivin3D. I can help with 3D modeling, measurements, and design suggestions. Try asking me about creating objects, changing properties, or using the tools!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      setError(null); // Clear error when user starts typing
    },
    []
  );

  const _executeApiCall = useCallback(
    async (messageContent: string) => {
      if (!messageContent.trim() || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: messageContent,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Use Mistral AI instead of local endpoint
        const response = await mistral.invoke([
          { role: "system", content: SYSTEM_PROMPT }, // Include system prompt for context
          { role: "user", content: messageContent },
        ]);

        if (!response.content) {
          throw new Error('No response message received from Mistral');
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.content as string,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Process any commands if viewer actions are available
        if (viewerActions && assistantMessage.content) {
          // @ts-ignore: Temporarily bypassing type mismatch error
          processCommand(assistantMessage.content, viewerActions);
        }
      } catch (err) {
        console.error("AI Assistant error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);

        const errorResponse: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I'm sorry, I encountered an error processing your request. Please try again, or ask me something else about 3D modeling.",
        };
        setMessages((prev) => [...prev, errorResponse]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, viewerActions, setMessages, setIsLoading, setError]
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
      // Make 'e' optional
      if (e && e.preventDefault) {
        e.preventDefault(); // Only call preventDefault if 'e' is provided and has the method
      }
      if (!input.trim() || isLoading) return;

      // Directly call API logic instead of aiState
      _executeApiCall(input.trim());
    },
    [input, isLoading, _executeApiCall]
  );

  const sendCommand = useCallback(
    (commandText: string) => {
      if (!commandText.trim() || isLoading) return;

      // Optionally, add the command as a user message to the chat
      // const commandMessage: Message = {
      //   id: `cmd-${Date.now()}`,
      //   role: "user",
      //   content: commandText,
      // };
      // setMessages((prev) => [...prev, commandMessage]);

      // Directly call the API logic
      _executeApiCall(commandText.trim());
    },
    [isLoading, _executeApiCall]
  );

  const resetConversation = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm Conceivo, your AI assistant for Conceivin3D. How can I help you with 3D modeling today?",
      },
    ]);
    setError(null);
    setInput("");
  }, []);

  const processAIMessage = useCallback((messageContent: string) => {
    // Optional post-processing of AI responses
    console.log("Processing AI message:", messageContent);
  }, []);

  const suggestCommands = useCallback(() => {
    const suggestions = [
      "Add a red cube at position [1, 0.5, 1]",
      "Scale this object up by 20%",
      "Make this blue",
      "Delete selected",
      "Reset camera view",
    ];

    const suggestion =
      suggestions[Math.floor(Math.random() * suggestions.length)];
    setInput(suggestion);
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    sendCommand,
    resetConversation,
    processAIMessage,
    suggestCommands,
  };
}

function processCommand(
  command: string,
  viewerActions: UseModelViewerReturn
) {
  try {
    // Attempt to parse the command as JSON
    const toolCall = JSON.parse(command);

    // This switch needs to handle the refined ToolName values
    switch (toolCall.action) {
      case "add":
        viewerActions.addObject(toolCall.type);
        if (toolCall.position) {
          // Handle each axis separately with proper parameter matching
          if (toolCall.position[0] !== undefined) {
            viewerActions.updatePosition("x", toolCall.position[0]);
          }
          if (toolCall.position[1] !== undefined) {
            viewerActions.updatePosition("y", toolCall.position[1]);
          }
          if (toolCall.position[2] !== undefined) {
            viewerActions.updatePosition("z", toolCall.position[2]);
          }
        }
        if (toolCall.color) {
          viewerActions.updateColor(toolCall.color);
        }
        break;
      case "delete":
        viewerActions.deleteSelected();
        break;
      case "move":
        if (toolCall.axis && toolCall.distance) {
          // Handle each axis separately with proper parameter matching
          if (toolCall.axis === "x") {
            viewerActions.updatePosition("x", toolCall.distance);
          } else if (toolCall.axis === "y") {
            viewerActions.updatePosition("y", toolCall.distance);
          } else if (toolCall.axis === "z") {
            viewerActions.updatePosition("z", toolCall.distance);
          }
        }
        break;
      case "scale":
        if (toolCall.factor) {
          // Uniform scaling across all axes
          viewerActions.updateScale("x", toolCall.factor);
          viewerActions.updateScale("y", toolCall.factor);
          viewerActions.updateScale("z", toolCall.factor);
        } else if (toolCall.x || toolCall.y || toolCall.z) {
          // Differential scaling per axis
          if (toolCall.x) viewerActions.updateScale("x", toolCall.x);
          if (toolCall.y) viewerActions.updateScale("y", toolCall.y);
          if (toolCall.z) viewerActions.updateScale("z", toolCall.z);
        }
        break;
      case "rotate":
        if (toolCall.axis && toolCall.angle) {
          viewerActions.updateRotation(
            toolCall.axis,
            toolCall.angle
          );
        }
        break;
      case "color":
        if (toolCall.color) {
          viewerActions.updateColor(toolCall.color);
        }
        break;
      case "generate":
        if (toolCall.prompt) {
          // Trigger Hunyuan3D generation via the appropriate API
          console.log(`Generating 3D model based on: ${toolCall.prompt}`);
          // Here you would integrate actual Hunyuan3D generation logic
          // viewerActions.generate3DModel(toolCall.prompt);
        }
        break;
      default:
        console.log(
          "Unknown or unhandled command action in processCommand:",
          toolCall.action
        );
    }
  } catch (error) {
    console.error("Error parsing command:", error);
    // Fallback to natural language processing
    viewerActions.setFeedback(`Natural Language Feedback: ${command}`);
  }
}

// Add this at the bottom to ensure it's available
export const SYSTEM_PROMPT = `You are Conceivo, the AI assistant for Conceivin3D — a professional 3D design platform.
You understand CAD modeling, geometry, materials, and engineering concepts.

When users ask about actions like \"Add a red cube\" or \"Scale up by 20%\", respond in one of two formats:

### Option 1: Structured Command (for direct execution)

{
  \"action\": \"add\",
  \"type\": \"box\",
  \"position\": [1, 0.5, 1],
  \"color\": \"#ef4444\"
}

Supported Actions:
- add: Create new object (box, sphere, cylinder, cone, torus, plane, wedge)
- delete: Remove selected object
- move: Move object along axis (x/y/z)
- scale: Scale object (x/y/z)
- rotate: Rotate object (x/y/z)
- color: Change object color
- measure: Measure distance between objects
- view: Toggle wireframe/shaded mode

Example Commands You Should Parse:
- \"Add a box at position [2, 1, -1]\" → {\"action\": \"add\", \"type\": \"box\", \"position\": [2, 1, -1]}
- \"Make this blue\" → {\"action\": \"color\", \"color\": \"#3b82f6\"}
- \"Delete selected\" → {\"action\": \"delete\"}
- \"Scale up the box by 20%\" → {\"action\": \"scale\", \"factor\": 1.2}
- \"Rotate this cone on Y-axis\" → {\"action\": \"rotate\", \"axis\": \"y\", \"angle\": 45}
- \"Model a futuristic cityscape\" → {\"action\": \"generate\", \"prompt\": \"A futuristic cityscape with skyscrapers and flying cars\"}

### Option 2: Natural Language Feedback

If no structured command is needed, provide helpful feedback:
\"Just added a red box at position [1, 0.5, 1]\"
\"Your model has been scaled up by 20%\"
\"I've updated the material to smooth plastic\"

Always be encouraging and provide specific, actionable guidance for 3D modeling tasks`;
