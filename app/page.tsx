"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Navbar } from "../components/navbar"
import { Hero } from "../components/hero"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { ArrowRight, Sparkles, ImageIcon, CuboidIcon as Cube, Lightbulb, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "../src/lib/utils"
import { FeatureCardSkeleton } from "../components/ui/feature-card-skeleton"
import { ModelViewerSkeleton } from "../components/ui/model-viewer-skeleton"

// Predefined prompt options
const promptOptions = [
  "A modern office chair with ergonomic design",
  "A minimalist desk lamp with adjustable brightness",
  "A futuristic electric vehicle concept",
  "A sustainable water bottle with temperature control",
  "A smart home security device with camera",
]

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"prompt" | "image" | "description">("prompt")
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle prompt submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    setIsGenerating(true)

    // Simulate AI processing
    setTimeout(() => {
      setGeneratedImage("/placeholder.svg?height=512&width=512")
      setGeneratedDescription(
        `A 3D model of ${prompt} with the following features:
- Ergonomic design with user comfort in mind
- Modern aesthetic with clean lines
- Sustainable materials for eco-friendly production
- Smart functionality with IoT integration

The design emphasizes both form and function, with attention to detail in the user experience.`,
      )
      setActiveTab("image")
      setIsGenerating(false)
    }, 3000)
  }

  // Handle random prompt selection
  const selectRandomPrompt = () => {
    const randomPrompt = promptOptions[Math.floor(Math.random() * promptOptions.length)]
    setPrompt(randomPrompt)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />

      {/* Show Hero section only when no content is generated */}
      {!generatedImage && <Hero />}

      <main className="flex-1 flex flex-col">
        {/* Main prompt section */}
        <section className="relative flex-1 flex items-center justify-center px-4 py-20">
          {/* Background effects */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-logo-purple/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-logo-cyan/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          <div className="max-w-3xl w-full mx-auto z-10">
            {!generatedImage ? (
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                  What would you like to <span className="text-logo-gradient">create</span> today?
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Describe your product idea and our AI will help you bring it to life in 3D
                </p>
              </div>
            ) : (
              <div className="flex justify-center mb-8">
                <div className="flex space-x-4 bg-gray-900/50 backdrop-blur-sm rounded-lg p-1">
                  <button
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all",
                      activeTab === "prompt" ? "bg-logo-gradient text-white" : "text-gray-300 hover:text-white",
                    )}
                    onClick={() => setActiveTab("prompt")}
                  >
                    <Lightbulb className="h-4 w-4 inline mr-2" />
                    Prompt
                  </button>
                  <button
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all",
                      activeTab === "image" ? "bg-logo-gradient text-white" : "text-gray-300 hover:text-white",
                    )}
                    onClick={() => setActiveTab("image")}
                  >
                    <ImageIcon className="h-4 w-4 inline mr-2" />
                    Reference Image
                  </button>
                  <button
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all",
                      activeTab === "description" ? "bg-logo-gradient text-white" : "text-gray-300 hover:text-white",
                    )}
                    onClick={() => setActiveTab("description")}
                  >
                    <Sparkles className="h-4 w-4 inline mr-2" />
                    AI Description
                  </button>
                </div>
              </div>
            )}

            <Card className="bg-gray-900/50 backdrop-blur-sm border border-logo-purple/30 shadow-2xl">
              <CardContent className={cn("p-6", generatedImage && activeTab !== "prompt" ? "hidden" : "block")}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Describe your product idea (e.g., 'A modern office chair with ergonomic design')"
                      className="bg-black/50 border-logo-purple/30 focus:border-logo-cyan text-white h-14 pl-4 pr-32 text-lg"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isGenerating}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-logo-purple"
                      onClick={selectRandomPrompt}
                      disabled={isGenerating}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Inspire me
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="btn-logo-gradient text-white px-8 py-6 text-lg font-medium border-0 shadow-lg hover:shadow-logo-purple/30"
                      disabled={isGenerating || !prompt.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Create with AI
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>

              {/* Generated Image Tab */}
              {generatedImage && activeTab === "image" && (
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-md aspect-square mb-4 border border-logo-purple/30 rounded-lg overflow-hidden">
                      {isGenerating ? (
                        <ModelViewerSkeleton />
                      ) : (
                        <Image src={generatedImage || "/placeholder.svg"} alt={prompt} fill className="object-cover" />
                      )}
                    </div>
                    <p className="text-gray-300 text-center mb-6">
                      AI-generated reference image for: <span className="text-logo-cyan">{prompt}</span>
                    </p>
                    <Link href="/design">
                      <Button className="btn-logo-gradient text-white px-8 py-6 text-lg font-medium border-0 shadow-lg hover:shadow-logo-purple/30">
                        Start 3D Design
                        <Cube className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              )}

              {/* Generated Description Tab */}
              {generatedDescription && activeTab === "description" && (
                <CardContent className="p-6">
                  <div className="bg-black/50 border border-logo-purple/20 rounded-lg p-4 mb-6">
                    <h3 className="text-logo-gradient font-bold mb-3">AI Design Recommendations</h3>
                    <div className="text-gray-300 whitespace-pre-line">{generatedDescription}</div>
                  </div>
                  <div className="flex justify-center">
                    <Link href="/design">
                      <Button className="btn-logo-gradient text-white px-8 py-6 text-lg font-medium border-0 shadow-lg hover:shadow-logo-purple/30">
                        Start 3D Design
                        <Cube className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              )}
            </Card>

            {!generatedImage && (
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Not sure where to start? Try one of our{" "}
                  <button
                    className="text-logo-purple hover:text-logo-cyan underline transition-colors"
                    onClick={selectRandomPrompt}
                  >
                    example prompts
                  </button>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features preview (only shown before generation) */}
        {!generatedImage && (
          <section className="py-16 px-6 border-t border-logo-purple/20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-12 text-logo-gradient">
                From Concept to Creation in Minutes
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <FeatureCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
