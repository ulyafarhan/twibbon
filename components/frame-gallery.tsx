"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { FrameState } from "@/components/twibbon-editor"

interface FrameGalleryProps {
  onFrameSelect: (frame: FrameState) => void
  selectedFrame: FrameState | null
}

// Sample frames data
const frames: FrameState[] = [
  {
    id: "1",
    name: "Kemerdekaan Indonesia",
    url: "/placeholder.svg?height=200&width=200",
    category: "Nasional",
  },
  {
    id: "2",
    name: "Hari Lingkungan",
    url: "/placeholder.svg?height=200&width=200",
    category: "Lingkungan",
  },
  {
    id: "3",
    name: "Ramadan Kareem",
    url: "/placeholder.svg?height=200&width=200",
    category: "Religi",
  },
  {
    id: "4",
    name: "Hari Pendidikan",
    url: "/placeholder.svg?height=200&width=200",
    category: "Pendidikan",
  },
  {
    id: "5",
    name: "Pilkada 2024",
    url: "/placeholder.svg?height=200&width=200",
    category: "Politik",
  },
  {
    id: "6",
    name: "Hari Kesehatan",
    url: "/placeholder.svg?height=200&width=200",
    category: "Kesehatan",
  },
]

const categories = ["Semua", "Nasional", "Lingkungan", "Religi", "Pendidikan", "Politik", "Kesehatan"]

export function FrameGallery({ onFrameSelect, selectedFrame }: FrameGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  const filteredFrames =
    selectedCategory === "Semua" ? frames : frames.filter((frame) => frame.category === selectedCategory)

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Frame Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredFrames.map((frame) => (
          <Card
            key={frame.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedFrame?.id === frame.id && "ring-2 ring-primary",
            )}
            onClick={() => onFrameSelect(frame)}
          >
            <CardContent className="p-3">
              <div className="aspect-square relative mb-2">
                <img
                  src={frame.url || "/placeholder.svg"}
                  alt={frame.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm text-foreground truncate">{frame.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {frame.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
