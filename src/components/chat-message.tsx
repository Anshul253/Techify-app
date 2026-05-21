"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Check, X } from "lucide-react"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  isEditing?: boolean
  questionIndex?: number
}

interface ChatMessageProps {
  message: Message
  onEdit: () => void
  onSave: (content: string) => void
}

export default function ChatMessage({ message, onEdit, onSave }: ChatMessageProps) {
  const isUser = message.role === "user"
  const [editedContent, setEditedContent] = useState(message.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (message.isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length)
    }
  }, [message.isEditing])

  const handleSave = () => {
    onSave(editedContent)
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} max-w-[85%] gap-3`}>
        <Avatar
          className={`h-8 w-8 ${isUser ? "ml-2" : "mr-2"} ring-2 ${isUser ? "ring-zinc-500/20" : "ring-zinc-700"}`}
        >
          <AvatarFallback
            className={
              isUser
                ? "bg-gradient-to-br from-indigo-500 to-amber-600 text-black font-medium"
                : "bg-gradient-to-br from-indigo-700 to-zinc-800"
            }
          >
            {isUser ? "U" : "T"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          {message.isEditing ? (
            <div className="flex flex-col gap-4 bg-zinc-800/80 backdrop-blur-sm p-2 rounded-xl border border-zinc-700 shadow-lg">
              <textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="p-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50  resize-x"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEdit}
                  className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-gradient-to-r from-indigo-500 to-amber-600 hover:from-indigo-600 hover:to-amber-700 text-black"
                >
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`p-4 rounded-xl relative ${
                isUser
                  ? "bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 text-zinc-100 backdrop-blur-sm shadow-lg shadow-amber-500/10"
                  : "bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 text-zinc-100 backdrop-blur-sm shadow-lg shadow-indigo-500/10"
              }`}
            >
              {message.content}

              {isUser && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onEdit}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-black/70 hover:text-white hover:bg-indigo-600/20"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

