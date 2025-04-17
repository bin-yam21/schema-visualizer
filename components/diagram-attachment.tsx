"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Image, Database, FileText } from "lucide-react"

interface DiagramAttachmentProps {
  schema: any
  modelName: string
}

export default function DiagramAttachment({ schema, modelName }: DiagramAttachmentProps) {
  const model = schema.models.find((m: any) => m.name === modelName)

  if (!model) {
    return <div>Select a model to view diagrams</div>
  }

  // Sample diagrams for different models
  const getDiagramInfo = (modelName: string) => {
    const diagrams: Record<string, { title: string; description: string }[]> = {
      Employee: [
        {
          title: "Employee Entity Relationship Diagram",
          description:
            "Shows the relationships between Employee and related entities like Position, EmployeeProfile, and EmployeeEducationalBackground.",
        },
        {
          title: "Employee Data Flow Diagram",
          description: "Illustrates how employee data flows through the system during onboarding and updates.",
        },
      ],
      Project: [
        {
          title: "Project Management Schema",
          description: "Visualizes the relationships between Project, Company, and EmployeeProject entities.",
        },
      ],
      Branch: [
        {
          title: "Organizational Structure",
          description: "Shows the hierarchical relationship between Branch, Department, and Position entities.",
        },
      ],
    }

    return (
      diagrams[modelName] || [
        {
          title: `${modelName} Entity Diagram`,
          description: `Basic entity relationship diagram for the ${modelName} model and its direct relationships.`,
        },
      ]
    )
  }

  const diagrams = getDiagramInfo(modelName)

  return (
    <div className="space-y-6">
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold mb-4">
        Diagrams for {model.name}
      </motion.h2>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Available Diagrams
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4 text-muted-foreground">
              The following diagrams are available for the {model.name} model. These diagrams help visualize the
              structure and relationships of this entity within the database schema.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {diagrams.map((diagram, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {index % 2 === 0 ? (
                      <Image className="h-16 w-16 text-primary" />
                    ) : (
                      <FileText className="h-16 w-16 text-primary" />
                    )}
                  </div>
                  <div className="p-4 border-t">
                    <h3 className="font-medium text-lg mb-1">{diagram.title}</h3>
                    <p className="text-muted-foreground text-sm">{diagram.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center">
              <Image className="mr-2 h-5 w-5" />
              Schema Visualization
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <Database className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium">Schema Diagram Placeholder</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is a placeholder for the {model.name} entity relationship diagram.
                  </p>
                </div>
              </div>
              <div className="p-4 border-t">
                <h3 className="font-medium text-lg mb-1">{model.name} Entity Relationship</h3>
                <p className="text-muted-foreground">
                  This diagram shows the relationships between the {model.name} model and related entities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

