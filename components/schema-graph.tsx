"use client"

import { useRef, useEffect, useState } from "react"
import * as d3 from "d3"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

interface SchemaGraphProps {
  schema: any
  selectedModel: string
  onSelectModel: (modelName: string) => void
}

export default function SchemaGraph({ schema, selectedModel, onSelectModel }: SchemaGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState({ show: false, text: "", x: 0, y: 0 })
  const { theme } = useTheme()

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove()

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    // Build relationships
    const relationships: any[] = []
    const modelNames = new Set(schema.models.map((model: any) => model.name))

    schema.models.forEach((model: any) => {
      model.relations?.forEach((relation: any) => {
        if (relation.attribute && relation.attribute.includes("@relation")) {
          const targetModel = relation.type.replace(/\[\]|\?/g, "")
          // Only add the relationship if the target model exists in our schema
          if (modelNames.has(targetModel)) {
            relationships.push({
              source: model.name,
              target: targetModel,
              type: relation.type.includes("[]") ? "one-to-many" : "one-to-one",
              name: relation.name,
            })
          }
        }
      })
    })

    // Prepare data for graph
    const graphNodes = schema.models.map((model: any) => ({
      id: model.name,
      label: model.name,
      radius: Math.max(30, model.name.length * 4),
      selected: model.name === selectedModel,
    }))

    const graphLinks = relationships.map((rel: any) => ({
      source: rel.source,
      target: rel.target,
      type: rel.type,
      name: rel.name,
    }))

    // Create SVG and group element
    const svg = d3.select(svgRef.current)
    const g = svg.append("g")

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom as any)

    // Create force simulation
    const simulation = d3
      .forceSimulation(graphNodes)
      .force(
        "link",
        d3
          .forceLink(graphLinks)
          .id((d: any) => d.id)
          .distance(200),
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide().radius((d: any) => d.radius + 20),
      )

    // Create links
    const links = g
      .append("g")
      .selectAll("line")
      .data(graphLinks)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", theme === "dark" ? "#374151" : "#e5e7eb")
      .attr("stroke-width", 1.5)
      .style("stroke-dasharray", (d: any) => (d.type === "one-to-many" ? "5,5" : "0"))

    // Create nodes
    const nodes = g
      .append("g")
      .selectAll(".node")
      .data(graphNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .on("click", (_event: any, d: any) => {
        onSelectModel(d.id)
      })
      .on("mouseover", (event: any, d: any) => {
        setTooltip({
          show: true,
          text: d.id,
          x: event.pageX,
          y: event.pageY,
        })
      })
      .on("mouseout", () => {
        setTooltip({ ...tooltip, show: false })
      })
      .call(
        d3
          .drag()
          .on("start", (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on("drag", (event: any, d: any) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on("end", (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          }) as any,
      )

    // Add circles to nodes
    nodes
      .append("circle")
      .attr("r", (d: any) => d.radius)
      .attr("fill", (d: any) => (d.selected ? "#7775e6" : "#5d5cde"))
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .transition()
      .duration(500)
      .attr("r", (d: any) => d.radius)

    // Add labels to nodes
    nodes
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "white")
      .text((d: any) => d.label)

    // Update positions on each tick
    simulation.on("tick", () => {
      links
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      nodes.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight

      svg.attr("width", newWidth).attr("height", newHeight)

      simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2))
      simulation.alpha(0.3).restart()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      simulation.stop()
    }
  }, [schema, selectedModel, theme, onSelectModel])

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg ref={svgRef} width="100%" height="100%" />

      {tooltip.show && (
        <div
          className="absolute bg-background border border-border p-2 rounded-md shadow-md z-50 pointer-events-none"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          {tooltip.text}
        </div>
      )}
    </motion.div>
  )
}

