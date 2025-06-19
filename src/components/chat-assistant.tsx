// components/chat-assistant.tsx
"use client"

import type React from "react"
import { useRef, useEffect, useState, FC } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Loader2,
  Zap,
} from "lucide-react"
import { cn } from "@/src/lib/utils" // Corrected path
import { useAIAssistant } from "@/src/hooks/use-ai-assistant"
import { useModelViewer } from "@/src/hooks/use-model-viewer"
import { ToolName } from "@/types/tool-call" // Corrected path
import type { Message } from "ai"
import type { ToolAction } from "@/types/tool-category"

export function ChatAssistant({ id }: { id?: string }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)

  const viewerState = useModelViewer()
  const aiState = useAIAssistant(viewerState)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [aiState.messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiState.input.trim()) return

    aiState.handleSubmit(e)
  }

  // Optionally, ensure your useAIAssistant hook triggers executeToolCall for any tool/action returned by Gemini

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-50 rounded-full w-12 h-12 btn-logo-gradient text-white shadow-lg border-0"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="h-6 w-6 animate-fade-in" />
      </Button>
    )
  }

  return (
    <Card
      id={id}
      className={cn(
        "fixed top-20 right-4 z-50 w-80 shadow-xl transition-all duration-300 border-logo-purple/30",
        isMinimized ? "h-12" : "h-96",
        "bg-black/80 backdrop-blur-md",
      )}
    >
      {/* Header */}
      <CardHeader className="p-3 border-b border-logo-purple/20 flex flex-row items-center justify-between space-y-0 bg-logo-gradient">
        <CardTitle className="text-sm font-medium flex items-center text-white">
          <Bot className="h-4 w-4 mr-2" />
          AI Assistant
          <Zap className="h-3 w-3 ml-1 text-yellow-300" />
        </CardTitle>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? "Maximize" : "Minimize"}
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close AI Assistant"
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0">
          {/* Messages */}
          <div className="relative h-64 overflow-y-auto p-3 space-y-3 chat-messages">
            {aiState.messages.length === 0 && !aiState.isLoading && (
              <div className="text-center text-gray-500 text-sm py-6">
                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="font-medium">Powered by Gemini AI</p>
                <p className="text-xs mt-1">
                  Ask me to do anything you can do: add cubes, open autosaves, switch dark/light mode, and more.<br />
                  Just type your request naturally!
                </p>
              </div>
            )}

            {aiState.messages.map((message: Message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2",
                     message.role === "user"
                      ? "bg-logo-gradient text-white ml-auto"
                      : "bg-gray-800/70 text-gray-300 border border-logo-purple/20 mr-auto",
                    "whitespace-pre-line",
                  )}
                >
                  <div className="flex items-start space-x-2">
                     {message.role === "assistant" ? (
                      <div className="flex items-center">
                        <Bot className="h-4 w-4 mt-0.5 text-logo-purple flex-shrink-0" />
                        <Zap className="h-2 w-2 text-yellow-400 ml-0.5" />
                      </div>
                     ) : (
                    <User className="h-4 w-4 mt-0.5 text-logo-cyan flex-shrink-0" />
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {aiState.isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800/70 text-gray-300 rounded-lg px-3 py-2 border border-logo-purple/20">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-logo-purple" />
                    <Zap className="h-3 w-3 text-yellow-400 animate-pulse" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-logo-purple rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-logo-cyan rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-logo-purple rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {aiState.error && (
              <div className="flex justify-start">
                <div className="bg-red-900/70 text-red-300 rounded-lg px-3 py-2 border border-red-500/20">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-red-400" />
                    <p className="text-sm">
                      Error:{" "}
                      {typeof aiState.error === "object" && // Check if it's an object (and not null due to outer check)
                      "message" in aiState.error // Check if it has a 'message' property
                        ? String((aiState.error as { message: unknown }).message) // Access message safely
                        : String(aiState.error)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom of message list */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-logo-purple/20">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                value={aiState.input}
                onChange={aiState.handleInputChange}
                placeholder="Ask Gemini to do anything: 'Add a cube', 'Switch to light mode', 'Open autosave'..."
                className="flex-1 border-logo-purple/30 focus:border-logo-cyan bg-slate-900/50 text-white placeholder:text-gray-400"
                disabled={aiState.isLoading}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent default Enter behavior (e.g., newline in textarea)
                    if (!aiState.input.trim()) return;
                    // Directly call the AI state's submit handler.
                    // This is the Vercel AI SDK's handler which can be called without a form event.
                    aiState.handleSubmit();
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={aiState.isLoading || !aiState.input.trim()}
                className="btn-logo-gradient text-white border-0 hover:bg-logo-cyan/90"
              >
                {aiState.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            <div className="text-xs text-gray-500 mt-1 text-center">
              Powered by <span className="text-yellow-400">Gemini AI</span> • Type anything you want done, like “Add a cube”, “Switch to dark mode”, “Open autosave”, etc.
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
