"use client"

import type React from "react"
import { useState, useCallback } from "react"
import type { UseModelViewerReturn } from "./use-model-viewer"
import type { ModelObject } from "../../types/model-object" // Ensure this path is correct
import type { ToolCall, ToolName } from "../../types/tool-call" // Import standardized types

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function useAIAssistant(viewerActions?: UseModelViewerReturn) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your Conceivin3D assistant. I can help with 3D modeling, measurements, and design suggestions. Try asking me about creating objects, changing properties, or using the tools!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    setError(null) // Clear error when user starts typing
  }, [])

  const _executeApiCall = useCallback(
    async (messageContent: string) => {
      if (!messageContent.trim() || isLoading) return

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: messageContent, // Use the passed messageContent
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/ai-assistant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            userId: "conceivin3d_user",
            app: "design-assist",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (!data.message) {
          throw new Error("No response message received")
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Process any commands if viewer actions are available
        if (viewerActions && data.command) {
          processCommand(data.command, viewerActions)
        }
      } catch (err) {
        console.error("AI Assistant error:", err)
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        setError(errorMessage)

        const errorResponse: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I'm sorry, I encountered an error processing your request. Please try again, or ask me something else about 3D modeling.",
        }
        setMessages((prev) => [...prev, errorResponse])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, messages, viewerActions, setMessages, setIsLoading, setError],
  )

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => { // Make 'e' optional
      if (e) {
        e.preventDefault() // Only call preventDefault if 'e' is provided
      }
      if (!input.trim() || isLoading) return

      _executeApiCall(input.trim())
      setInput("") // Clear input after initiating submission
    },
    [input, isLoading, _executeApiCall, setInput],
  )

  const sendCommand = useCallback(
    (commandText: string) => {
      if (!commandText.trim() || isLoading) return

      // Optionally, add the command as a user message to the chat
      // const commandMessage: Message = {
      //   id: `cmd-${Date.now()}`,
      //   role: "user",
      //   content: commandText,
      // };
      // setMessages((prev) => [...prev, commandMessage]);

      // Directly call the API logic
      _executeApiCall(commandText.trim())
    },
    [isLoading, _executeApiCall],
  )

  const resetConversation = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your Conceivin3D assistant. How can I help you with 3D modeling today?",
      },
    ])
    setError(null)
    setInput("")
  }, [])

  const processAIMessage = useCallback((messageContent: string) => {
    // Optional post-processing of AI responses
    console.log("Processing AI message:", messageContent)
  }, [])

  const suggestCommands = useCallback(() => {
    const suggestions = [
      "Add a red cube at position [1, 0.5, 1]",
      "Scale this object up by 20%",
      "Make this blue",
      "Delete selected",
      "Reset camera view",
    ]

    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    setInput(suggestion)
  }, [])

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
  }
}

function processCommand(command: ToolCall, viewerActions: UseModelViewerReturn) {
  try {
        // This switch needs to handle the refined ToolName values
    switch (command.action) {
      // Example: if API sends { action: "add-box", params: { ... } }
      case "add-box":
        viewerActions.addObject("box"); // Corrected: Pass only one argument as expected.
        // TODO: If command.params (e.g., position, size, color) are relevant for the new box,
        // they need to be applied using other viewerActions methods after object creation,
        // or the addObject method's signature in useModelViewer.ts should be updated.
        break
      case "add-sphere":
        viewerActions.addObject("sphere"); // Corrected: Pass only one argument as expected.
        // TODO: Handle command.params for the new sphere similarly if they are provided.
        break
      // Add cases for all relevant ToolNames from types/tool-call.ts
      case "delete-selected":
        viewerActions.deleteSelected()
        break
      case "change-color": // Example: if API sends { action: "change-color", params: { color: "#ff0000" } }
        if (command.params?.color) {
          viewerActions.updateColor(command.params.color as string)
        }
        break
      case "scale": // Example: if API sends { action: "scale", params: { x: 1.2, y: 1.2, z: 1.2 } }
        if (command.params?.scale) {
          // Ensure scale is a 3-element array
          if (Array.isArray(command.params.scale) && command.params.scale.length === 3) {
            const [x, y, z] = command.params.scale
          viewerActions.updateScale("x", x) // Or viewerActions.updateScale({x,y,z}) if API changes
          viewerActions.updateScale("y", y) //
          viewerActions.updateScale("z", z) //
          } else {
            console.warn("Invalid scale params for update command:", command.params.scale)
          }
        }
        break
      default:
        console.log("Unknown or unhandled command action in processCommand:", command.action)
    }
  } catch (error) {
    console.error("Error processing command:", error)
  }
}