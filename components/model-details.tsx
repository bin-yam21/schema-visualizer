"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface ModelDetailsProps {
  schema: any
  modelName: string
}

export default function ModelDetails({ schema, modelName }: ModelDetailsProps) {
  const model = schema.models.find((m: any) => m.name === modelName)

  if (!model) {
    return <div>Select a model to view details</div>
  }

  // Function to determine the color for different data types
  const getTypeColor = (type: string) => {
    if (type.includes("String")) return "text-blue-500 dark:text-blue-400"
    if (type.includes("Int") || type.includes("Float") || type.includes("number") || type.includes("int"))
      return "text-green-600 dark:text-green-400"
    if (type.includes("Date") || type.includes("DateTime")) return "text-purple-600 dark:text-purple-400"
    if (type.includes("Boolean") || type.includes("boolean")) return "text-amber-600 dark:text-amber-400"
    if (type.startsWith("'") || type.includes("|")) return "text-pink-600 dark:text-pink-400"
    if (type.includes("[]")) return "text-indigo-600 dark:text-indigo-400"
    return "text-primary"
  }

  // Function to determine badge color for relation types
  const getRelationBadgeVariant = (relationType: string) => {
    if (relationType === "One-to-Many") return "secondary"
    if (relationType === "One-to-One (Optional)") return "outline"
    return "default"
  }

  return (
    <div>
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold mb-4">
        {model.name}
      </motion.h2>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="bg-muted/30">
              <CardTitle>Fields</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Attributes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {model.fields.map((field: any) => (
                      <TableRow key={field.name}>
                        <TableCell className="font-medium">
                          {field.attributes.includes("@id") ? (
                            <span className="flex items-center">
                              {field.name}
                              <Badge
                                variant="outline"
                                className="ml-2 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                              >
                                PK
                              </Badge>
                            </span>
                          ) : field.attributes.includes("@unique") ? (
                            <span className="flex items-center">
                              {field.name}
                              <Badge
                                variant="outline"
                                className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                              >
                                Unique
                              </Badge>
                            </span>
                          ) : (
                            field.name
                          )}
                        </TableCell>
                        <TableCell className={cn("font-mono", getTypeColor(field.type))}>{field.type}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {field.attributes.map((attr: string, i: number) => (
                            <span key={i} className="mr-1">
                              {attr}
                            </span>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {model.relations && model.relations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="bg-muted/30">
                <CardTitle>Relationships</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Relation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {model.relations.map((relation: any) => {
                        const relationType = relation.type.includes("[]")
                          ? "One-to-Many"
                          : relation.type.includes("?")
                            ? "One-to-One (Optional)"
                            : "One-to-One"

                        return (
                          <TableRow key={relation.name}>
                            <TableCell className="font-medium">{relation.name}</TableCell>
                            <TableCell className={cn("font-mono", getTypeColor(relation.type))}>
                              {relation.type}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRelationBadgeVariant(relationType)}>{relationType}</Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {model.uniqueConstraints && model.uniqueConstraints.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader className="bg-muted/30">
                <CardTitle>Unique Constraints</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="list-disc pl-5">
                  {model.uniqueConstraints.map((constraint: string[], index: number) => (
                    <li key={index} className="mb-1">
                      {constraint.join(", ")}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

