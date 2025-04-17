"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ModelListProps {
  models: Array<{ name: string }>
  selectedModel: string
  onSelectModel: (modelName: string) => void
}

export default function ModelList({ models, selectedModel, onSelectModel }: ModelListProps) {
  return (
    <div className="space-y-1">
      {models.map((model, index) => (
        <motion.div
          key={model.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
          className={cn(
            "p-2 rounded cursor-pointer transition-colors",
            selectedModel === model.name ? "bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
          onClick={() => onSelectModel(model.name)}
        >
          {model.name}
        </motion.div>
      ))}
    </div>
  )
}

