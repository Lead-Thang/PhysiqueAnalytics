// src/app/page.tsx
"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "src/components/navbar"
import { Hero } from "src/components/hero"
import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "src/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import {
  Box,
  Zap,
  Sparkles,
  Send,
  RotateCcw,
  Maximize2,
  Loader2,
  X,
  LayoutDashboard,
  Building,
  TreePine,
} from "lucide-react"

export default function HomePage() {
  return (
    <Suspense fallback="Loading...">
      <HomePageContent />
    </Suspense>
  )
}

function HomePageContent() {
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("text")
  const inputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") || ""

  // Auto-focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e)
    }
  }

  // Generate concept from prompt
  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt) return

    setIsGenerating(true)
    setGeneratedImage(null)
    setGeneratedDescription(null)
    setActiveTab("image")

    try {
      const result = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      })

      if (!result.ok) throw new Error("Failed to generate concept")

      const data = await result.json()
      setGeneratedImage(data.image)
      setGeneratedDescription(data.description || "")
    } catch (err: any) {
      console.error("Generation failed:", err)
      setError(err.message || "Failed to generate concept. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Random prompts
  const promptOptions = [
    "Create a modern office chair",
    "Design a futuristic car",
    "Build a robot arm",
    "Generate a house",
    "Make a logo in 3D",
    "Design a smart home",
    "Create a minimalist desk lamp",
    "Design a sci-fi helmet",
    "Make a coffee mug",
    "Create a bridge",
    "Design a rooftop garden",
    "Create a luxury villa",
  ]

  const selectRandomPrompt = () => {
    const randomPrompt = promptOptions[Math.floor(Math.random() * promptOptions.length)]
    setPrompt(randomPrompt)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      {/* Header */}
      <Navbar />

      {/* Hero */}
      <Hero onPromptSubmit={(prompt) => setPrompt(prompt)} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10 md:py-20 max-w-5xl">
        <section className="flex flex-col items-center justify-center text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-logo-cyan to-logo-purple text-transparent bg-clip-text mb-4">
            Design Anything with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mb-8">
            Describe your 3D model idea below and let AI turn it into a visual concept.
          </p>
          <div className="flex gap-4 justify-center mt-4 flex-wrap">
            <Button size="lg" variant="outline" onClick={selectRandomPrompt}>
              Example Prompts
            </Button>
            <Link href="/design">
              <Button size="lg" className="btn-logo-gradient text-white hover:bg-logo-cyan/90">
                Start 3D Design
                <Zap className="ml-2 h-4 w-4 animate-pulse" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Prompt Generator */}
        <section className="max-w-2xl mx-auto">
          <Card className="glass overflow-hidden border border-border shadow-lg backdrop-blur-md">
            <CardHeader className="bg-logo-gradient p-6 pb-2">
              <CardTitle className="text-2xl font-bold text-white">AI Concept Generator</CardTitle>
              <CardDescription className="text-gray-300">
                Type your idea below and let AI create a reference for you.
              </CardDescription>
            </CardHeader>

            {/* 添加彩色环形效果的 Logo */}
            <CardContent className="p-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* 使用现有的 logo 图标 */}
                  <svg className="w-16 h-16 text-logo-cyan" viewBox="0 0 24 24" fill="none">
                    {/* 现有 logo 的 SVG 内容 */}
                    <path d="...existing logo path..." />
                  </svg>
                </div>
                {/* 彩色环形效果 */}
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full rounded-full" style={{
                      background: 'conic-gradient(from 45deg, #ff00ff, #00ffff, #00ff00, #ffff00, #ff00ff)'
                    }}></div>
                  </div>
                </div>
              </div>

              {/* 保留原有表单内容 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your 3D model..."
                    disabled={isGenerating}
                    className="w-full py-6 pl-4 pr-12 text-lg bg-card border-border text-white placeholder:text-muted-foreground focus:border-logo-cyan"
                  />
                  {prompt && !isGenerating && (
                    <button
                      type="button"
                      onClick={() => setPrompt("")}
                      aria-label="Clear input"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Example Prompts */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Modern chair",
                    "Futuristic car",
                    "Robot arm",
                    "Luxury villa",
                    "Minimalist lamp",
                    "Smart home",
                    "Coffee mug",
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => {
                        setPrompt(example)
                        setTimeout(() => inputRef.current?.focus(), 100)
                      }}
                      className="text-sm text-logo-cyan hover:text-logo-purple underline transition-colors"
                      type="button"
                    >
                      {example}
                    </button>
                  ))}
                </div>

                {/* Generate Button */}
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    className="btn-logo-gradient text-white px-6 py-3 rounded-md"
                    disabled={!prompt.trim() || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Concept
                        <Sparkles className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Result Tabs */}
              {(generatedImage || generatedDescription || error) && (
                <Tabs defaultValue="description" className="mt-6">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800/50"
                    style={{ boxShadow: "0 0 10px rgba(79, 70, 229, 0.2)" }}>
                    <TabsTrigger value="description" className="data-[state=active]:bg-logo-cyan/20">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="image" className="data-[state=active]:bg-logo-cyan/20">
                      Reference Image
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-4">
                    <Card className="bg-card border-border">
                      <CardContent className="pt-6 text-muted-foreground whitespace-pre-line">
                        {generatedDescription || "Type a prompt above to get started."}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="image" className="mt-4">
                    <Card className="bg-card border-border overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-slate-900 border border-border">
                          {isGenerating ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <Loader2 className="animate-spin h-10 w-10 text-logo-cyan" />
                            </div>
                          ) : generatedImage ? (
                            <img
                              src={generatedImage}
                              alt={prompt || "AI-generated concept"}
                              width={512}
                              height={512}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                              No image yet
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}

              {/* CTA Button */}
              {!isGenerating && generatedImage && (
                <div className="mt-6 text-center">
                  <Link href={`/design?prompt=${encodeURIComponent(prompt)}`}>
                    <Button className="btn-logo-gradient text-white w-full md:w-auto">
                      Start 3D Design
                      <Box className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Architectural Mode */}
        <section className="mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Architectural Design Mode</h2>
            <p className="text-xl text-muted-foreground">
              Create buildings, interiors, landscapes, and more using natural language.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass hover:-translate-y-1 hover:shadow-lg hover:shadow-logo-cyan/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-6 w-6 mr-2 text-logo-cyan" /> Interior Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Plan rooms, add furniture, and visualize spaces before building them.
                </p>
                <Button asChild variant="link" className="text-logo-cyan">
                  <Link href="/design?mode=interior">Try Interior Mode</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass hover:-translate-y-1 hover:shadow-lg hover:shadow-logo-cyan/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LayoutDashboard className="h-6 w-6 mr-2 text-logo-cyan" /> Structural Modeling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Add walls, doors, windows, and structural elements using natural language.
                </p>
                <Button asChild variant="link" className="text-logo-cyan">
                  <Link href="/design?mode=architectural">Try Architectural Mode</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass hover:-translate-y-1 hover:shadow-lg hover:shadow-logo-cyan/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TreePine className="h-6 w-6 mr-2 text-logo-cyan" /> Urban Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Design cities, parks, roads, and large-scale environments.
                </p>
                <Button asChild variant="link" className="text-logo-cyan">
                  <Link href="/design?mode=urban">Try Urban Mode</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-card/50 backdrop-blur-md text-center text-sm text-muted-foreground">
        Conceivin3D · Powered by rendairAI & Hunyuan3D
      </footer>
    </div>
  )
}
