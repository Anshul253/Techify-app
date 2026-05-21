"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"

interface Conversation {
  id: string
  name: string
  active: boolean
}

interface SidebarProps {
  conversations: Conversation[]
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  visible: boolean
  onToggle: () => void
}

export default function Sidebar({
  conversations,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  visible,
  onToggle,
}: SidebarProps) {
  return (
    <>
      <div
        className={`${visible ? "w-64" : "w-0"} transition-all duration-300 h-screen bg-gradient-to-b from-black to-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-zinc-800">
          <Button
            onClick={onNewChat}
            className="w-full bg-gradient-to-r from-indigo-500 to-amber-600 hover:from-indigo-600 hover:to-amber-700 text-black font-medium"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Resume
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((conv) => (
            <div key={conv.id} className="relative group">
              <button
                onClick={() => onSelectChat(conv.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${
                  conv.active
                    ? "bg-gradient-to-r from-zinc-800 to-zinc-900 text-white border-l-2 border-indigo -500"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                }`}
              >
                {conv.name}
              </button>

              {conversations.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteChat(conv.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-500 hover:bg-transparent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="text-xs text-zinc-500 flex items-center justify-center">
            <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
            Techify
          </div>
        </div>
      </div>

      <button
        onClick={onToggle}
        className="absolute top-4 left-0 z-10 p-1.5 bg-zinc-800 text-zinc-400 rounded-r-md border-r border-y border-zinc-700 hover:text-amber-500 transition-colors"
      >
        {visible ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </>
  )
}

