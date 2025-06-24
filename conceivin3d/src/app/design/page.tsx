"use client"

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { ModelViewer } from "../../src/components/model-viewer";
import { ChatAssistant } from "../../src/components/chat-assistant";
import { VoiceAssistant } from "../../src/components/voice-assistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../src/components/ui/tabs";
import { Button } from "../../src/components/ui/button";
import { Card, CardContent } from "../../src/components/ui/card";
import { ImageIcon, FileText, ArrowLeft, Sparkles, Undo, Redo, Move } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "next-auth/react"; // Import getSession

export default function DesignPage() {
  const [referenceImage, setReferenceImage] = useState<string | null>("/placeholder.svg?height=512&width=512");
  const [description, setDescription] = useState<string | null>(
    "A 3D model with the following features:\n\n" +
      "- Ergonomic design with user comfort in mind\n" +
      "- Modern aesthetic with clean lines\n" +
      "- Sustainable materials for eco-friendly production\n" +
      "- Smart functionality with IoT integration\n\n" +
      "The design emphasizes both form and function, with attention to detail in the user experience.",
  );

  // Check if user is authenticated
  const session = await getSession(); // 获取当前会话
  if (!session) {
    return <div>You must be signed in to view this page.</div>; // 如果未认证，显示提示信息
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Reference Materials */}
        <div className="w-64 border-r border-logo-purple/20 bg-gray-900/30 backdrop-blur-sm p-4 flex flex-col h-full">
          {/* ... existing code ... */}
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* ... existing code ... */}

          {/* 3D Viewer */}
          <ModelViewer />

          {/* ... existing code ... */}
        </div>

        {/* AI Assistant Panel */}
        <ChatAssistant id="ai-chat" />
      </div>
    </div>
  );
}