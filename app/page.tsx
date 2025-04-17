"use client";

import { useState, useEffect } from "react";
import { Search, Moon, Sun } from "lucide-react";
import SchemaOverview from "@/components/schema-overview";
import ModelDetails from "@/components/model-details";
import ModelList from "@/components/model-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import DiagramAttachment from "@/components/diagram-attachment";
import { schema } from "@/lib/schema-data";

export default function SchemaVisualizer() {
  const [selectedModel, setSelectedModel] = useState(
    schema.models[0]?.name || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Only show UI after mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = schema.models
        .filter(
          (model) =>
            model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            model.fields.some((field) =>
              field.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        .map((model) => model.name);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Don't render UI until client-side
  if (!mounted) return null;

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border flex justify-between items-center px-4 py-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold"
        >
          Schema Visualizer
        </motion.div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search models..."
                className="pl-8 w-60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {showSearchResults && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 mt-1 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto bg-background border border-border"
                >
                  {searchResults.length === 0 ? (
                    <div className="p-2 text-muted-foreground">
                      No results found
                    </div>
                  ) : (
                    searchResults.map((modelName) => (
                      <div
                        key={modelName}
                        className="p-2 cursor-pointer hover:bg-muted"
                        onClick={() => handleModelSelect(modelName)}
                      >
                        {modelName}
                      </div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </nav>

      <div className="h-full flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="sticky top-4 left-0 w-64 border-r border-border p-4 overflow-y-scroll hidden md:block">
          <h2 className="text-lg font-semibold mb-3">Models</h2>
          <ModelList
            models={schema.models}
            selectedModel={selectedModel}
            onSelectModel={handleModelSelect}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Tabs defaultValue="overview" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="diagram">Diagram Attachment</TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className="flex-1 p-4 overflow-auto m-0"
            >
              <SchemaOverview schema={schema} selectedModel={selectedModel} />
            </TabsContent>

            <TabsContent
              value="details"
              className="flex-1 p-4 overflow-auto m-0"
            >
              <ModelDetails schema={schema} modelName={selectedModel} />
            </TabsContent>

            <TabsContent
              value="diagram"
              className="flex-1 p-4 overflow-auto m-0"
            >
              <DiagramAttachment schema={schema} modelName={selectedModel} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
