"use client"

import { useState } from "react"
import { Navbar } from "../../components/navbar"
import { ModelViewer } from "../../components/model-viewer"
import { ChatAssistant } from "../../components/chat-assistant"
import { VoiceAssistant } from "../../components/voice-assistant"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { ImageIcon, FileText, ArrowLeft, Sparkles, Undo, Redo, Move } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function DesignPage() {
  const [referenceImage, setReferenceImage] = useState<string | null>("/placeholder.svg?height=512&width=512")
  const [description, setDescription] = useState<string | null>(
    "A 3D model with the following features:\n\n" +
      "- Ergonomic design with user comfort in mind\n" +
      "- Modern aesthetic with clean lines\n" +
      "- Sustainable materials for eco-friendly production\n" +
      "- Smart functionality with IoT integration\n\n" +
      "The design emphasizes both form and function, with attention to detail in the user experience.",
  )

  return (
    <div className="h-screen flex flex-col bg-black">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Reference Materials */}
        <div className="w-64 border-r border-logo-purple/20 bg-gray-900/30 backdrop-blur-sm p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-gray-400 hover:text-white flex items-center text-sm transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Prompt
            </Link>
            <span className="text-logo-gradient text-sm font-medium">References</span>
          </div>

          <Tabs defaultValue="image" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 mb-4 bg-gray-800/50 rounded-md p-1">
              <TabsTrigger
                value="image"
                className="data-[state=active]:bg-logo-purple data-[state=active]:text-white text-gray-400 text-xs py-1 transition-all"
              >
                <ImageIcon className="h-3 w-3 mr-1" />
                Image
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-logo-cyan data-[state=active]:text-white text-gray-400 text-xs py-1 transition-all"
              >
                <FileText className="h-3 w-3 mr-1" />
                Description
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="flex-1 flex flex-col">
              {referenceImage ? (
                <div className="relative w-full aspect-square mb-3 border border-logo-purple/30 rounded-lg overflow-hidden">
                  <Image
                    src={referenceImage || "/placeholder.svg"}
                    alt="Reference image"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <Card className="flex-1 flex items-center justify-center border-dashed border-2 border-gray-700 bg-black/50">
                  <CardContent className="text-center p-4">
                    <ImageIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No reference image available</p>
                  </CardContent>
                </Card>
              )}

              <Button
                variant="outline"
                size="sm"
                className="mt-auto border-logo-purple/30 text-logo-purple hover:bg-logo-purple/10 transition-colors"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </TabsContent>

            <TabsContent value="description" className="flex-1 flex flex-col">
              {description ? (
                <div className="flex-1 bg-black/50 border border-logo-purple/20 rounded-lg p-3 mb-3 overflow-y-auto">
                  <h3 className="text-logo-gradient text-sm font-bold mb-2">AI Design Recommendations</h3>
                  <div className="text-gray-300 text-xs whitespace-pre-line">{description}</div>
                </div>
              ) : (
                <Card className="flex-1 flex items-center justify-center border-dashed border-2 border-gray-700 bg-black/50">
                  <CardContent className="text-center p-4">
                    <FileText className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No description available</p>
                  </CardContent>
                </Card>
              )}

              <Button
                variant="outline"
                size="sm"
                className="mt-auto border-logo-cyan/30 text-logo-cyan hover:bg-logo-cyan/10 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Edit Description
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Floating Toolbar */}
          <div className="absolute top-4 left-4 z-30 flex gap-2 p-2 bg-black/70 rounded-lg shadow-lg backdrop-blur-sm">
            <Button
              variant="ghost"
              size="icon"
              title="Create Cube"
              aria-label="Create Cube"
              className="hover:bg-logo-purple/10 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M9.375 3a1.875 1.875 0 000 3.75h1.875v3H9.375a3.75 3.75 0 00-3.75 3.75V18h12.75v-4.125a3.75 3.75 0 00-3.75-3.75h-1.875v-3H14.625a1.875 1.875 0 100-3.75H5.625z" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Move Object (M)"
              aria-label="Move Object"
              className="hover:bg-logo-purple/10 text-white"
            >
              <Move className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Measure Tool"
              aria-label="Measure Tool"
              className="hover:bg-logo-purple/10 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M15.75 5.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.75 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.75 12.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM7.5 19.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM9 3.75a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM9 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM9 14.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM16.5 3.75a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM16.5 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM16.5 14.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
              </svg>
            </Button>
          </div>

          {/* Voice Assistant Button */}
          <div className="absolute top-4 right-20 z-30">
            <VoiceAssistant />
          </div>

          {/* Undo/Redo Shortcuts */}
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Undo"
            >
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Redo"
            >
              <Redo className="h-4 w-4 mr-1" />
              Redo
            </Button>
          </div>

          {/* 3D Viewer */}
          <ModelViewer />

          {/* AI Assistant Toggle Button */}
          <div className="absolute bottom-6 right-6 z-40">
            <Button
              className="btn-logo-gradient rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => document.getElementById("ai-chat")?.scrollIntoView({ behavior: "smooth" })}
              aria-label="Open AI Assistant"
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </div>

          {/* Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-30 text-xs text-gray-500 px-4 py-1 bg-black/30 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span>Selected: Nothing</span>
                <span>Objects: 1</span>
                <span>View: Isometric</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-logo-cyan">🎤 Voice Ready</span>
                <span className="text-logo-purple">🤖 AI Assistant</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <ChatAssistant id="ai-chat" />
      </div>
    </div>
  )
}
