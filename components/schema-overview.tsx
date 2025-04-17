"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Table, Link2 } from "lucide-react"

interface SchemaOverviewProps {
  schema: any
  selectedModel: string
}

export default function SchemaOverview({ schema, selectedModel }: SchemaOverviewProps) {
  const getModelOverview = (modelName: string) => {
    const overviews: Record<string, string> = {
      Announcement:
        "The Announcement model represents a system-wide notification or event update. It stores important details such as title, description, event date, and location. Each announcement is uniquely identified, linked to a creator, and tracks creation and update timestamps.",
      Branch:
        "The Branch model represents different locations or divisions within an organization. It stores details such as the branch name, location, and a unique ID. Each branch can have multiple departments and maintains a status to indicate whether it is active.",
      Department:
        "The Department model represents a functional unit within a branch. Each department is uniquely identified and associated with a specific branch. It contains details about the department's name, status, and related positions.",
      Employee:
        "The Employee model stores comprehensive information about employees including personal details, position, educational background, and employment status. It maintains relationships with various other models for complete employee management.",
      Position:
        "The Position model defines job roles within departments. It includes details like position name, department association, and status. Each position can be assigned to multiple employees.",
      Project:
        "The Project model represents client projects with details like location, start/end dates, and company association. It tracks project status and maintains relationships with employees assigned to the project.",
      Company:
        "The Company model stores information about client companies including contact details, location, and legal information like VAT and TIN numbers. It maintains relationships with projects.",
      TaxCenter:
        "The TaxCenter model represents tax authorities with location and account details. It's associated with projects for tax reporting purposes.",
    }

    return (
      overviews[modelName] ||
      `The ${modelName} model is part of the database schema. It contains fields for storing data and relationships with other models.`
    )
  }

  // Count total models, fields, and relationships
  const totalModels = schema.models.length
  const totalFields = schema.models.reduce((acc: number, model: any) => acc + model.fields.length, 0)
  const totalRelationships = schema.models.reduce((acc: number, model: any) => acc + (model.relations?.length || 0), 0)

  // Get the selected model data
  const model = schema.models.find((m: any) => m.name === selectedModel)

  return (
    <div className="space-y-6">
      {/* Selected Model Card - Moved to the top */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <Table className="mr-2 h-5 w-5 text-primary" />
              Selected Model: {selectedModel}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">{getModelOverview(selectedModel)}</p>

            {/* Display key information about the selected model */}
            {model && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Quick Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-primary/5 rounded-md border border-primary/20">
                    <p className="text-sm font-medium">Fields</p>
                    <p className="text-2xl">{model.fields.length}</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-md border border-primary/20">
                    <p className="text-sm font-medium">Relationships</p>
                    <p className="text-2xl">{model.relations?.length || 0}</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-md border border-primary/20">
                    <p className="text-sm font-medium">Primary Key</p>
                    <p className="text-lg truncate">
                      {model.fields.find((f: any) => f.attributes.includes("@id"))?.name || "id"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Database Schema Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center justify-center border border-border">
                <Table className="h-8 w-8 mb-2 text-primary" />
                <p className="text-2xl font-bold">{totalModels}</p>
                <p className="text-sm text-muted-foreground">Models</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center justify-center border border-border">
                <Database className="h-8 w-8 mb-2 text-primary" />
                <p className="text-2xl font-bold">{totalFields}</p>
                <p className="text-sm text-muted-foreground">Fields</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center justify-center border border-border">
                <Link2 className="h-8 w-8 mb-2 text-primary" />
                <p className="text-2xl font-bold">{totalRelationships}</p>
                <p className="text-sm text-muted-foreground">Relationships</p>
              </div>
            </div>

            <p className="mb-4">
              This database schema represents an HR and project management system with models for employees,
              departments, projects, and related entities.
            </p>

            <h3 className="text-lg font-semibold mb-2">Key Models</h3>
            <ul className="space-y-2">
              <li className="p-2 bg-muted/30 rounded-md border border-border">
                <span className="font-medium">Employee</span>: Core entity for storing employee information
              </li>
              <li className="p-2 bg-muted/30 rounded-md border border-border">
                <span className="font-medium">Department & Branch</span>: Organizational structure
              </li>
              <li className="p-2 bg-muted/30 rounded-md border border-border">
                <span className="font-medium">Project & Company</span>: Client and project management
              </li>
              <li className="p-2 bg-muted/30 rounded-md border border-border">
                <span className="font-medium">EmployeeProject</span>: Connects employees to projects with role and
                salary info
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

