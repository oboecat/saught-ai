"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { X, Send, Minimize2, Quote, ChevronDown } from "lucide-react"

interface FloatingAIWidgetProps {
  agentPrompt?: string;
  defaultAI?: string;
  placeholder?: string;
  aiServices?: { id: string; name: string; url: string }[];
  textSelectionPrefix?: string;
  isWidget?: boolean;
}

const defaultAiServices = [
  { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/?hints=search&q=" },
  { id: "claude", name: "Claude", url: "https://claude.ai/chat?q=" },
  // It would seem Gemini does not support query strings, yet.
  // { id: "gemini", name: "Gemini", url: "https://gemini.google.com/app?q=" },
  { id: "perplexity", name: "Perplexity", url: "https://www.perplexity.ai/?q=" },
  { id: "copilot", name: "Copilot", url: "https://copilot.microsoft.com/?q=" },
  { id: "grok", name: "Grok", url: "https://grok.com/?q=" },
]

const defaultPrompt = `I have used a widget that has linked me to you from \${webpage_url}, please read this page. \${text_selection_context} Here is my question: \${question}`;
const defaultTextSelectionPrefix = "Here is the text I selected: "

export function FloatingAIWidget({ 
  agentPrompt = defaultPrompt,
  placeholder = "Type your question...", 
  defaultAI = "chatgpt",
  aiServices = defaultAiServices,
  textSelectionPrefix = defaultTextSelectionPrefix,
  isWidget = false,
}: FloatingAIWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedService, setSelectedService] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedAIService') || defaultAI
    }
    return defaultAI
  })
  const [question, setQuestion] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [suppressClose, setSuppressClose] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [isQuoteMode, setIsQuoteMode] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
    if (e.target.value.trim()) {
      setIsPinned(true);
    }
  };

  const captureSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const text = selection.toString().trim();
    if (text) {
      // Check if selection is within the widget itself
      const anchorNode = selection.anchorNode;
      const focusNode = selection.focusNode;
      
      // Skip if selection is within the widget
      if (widgetRef.current && 
          (widgetRef.current.contains(anchorNode) || 
           widgetRef.current.contains(focusNode))) {
        return;
      }
      
      // Limit to 1KB of text
      const maxLength = 1024;
      setSelectedText(text.length > maxLength ? text.slice(0, maxLength) + '...' : text);
      return true; // Return true if we captured text
    }
    return false;
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!widgetRef.current) return

      if (suppressClose || isPinned || isQuoteMode) return;
      const path = event.composedPath();

      // Check if your widget's element (widgetRef.current) is part of the event's path.
      // If it is, the click originated inside your widget or 
      // one of its children (including Shadow DOM children).
      const isClickInsideWidget = path.includes(widgetRef.current);

      // Simple check - if the click target is not contained in our widget, close it
      if (!isClickInsideWidget) {
        setIsExpanded(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPinned && !isQuoteMode) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isExpanded, suppressClose, isPinned, isQuoteMode]);

  // Add effect to save selectedService to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedAIService', selectedService)
    }
  }, [selectedService])

  // Handle text selection when quote mode is active
  useEffect(() => {
    if (!isQuoteMode) return;

    const handleSelectionEnd = (event: MouseEvent | TouchEvent) => {
      // Check if the event target is an interactive element within the widget
      const target = event.target as HTMLElement;

      const path = event.composedPath();
      // Check if your widget's element (widgetRef.current) is part of the event's path.
      // If it is, the click originated inside your widget or 
      // one of its children (including Shadow DOM children).
      if (widgetRef.current && path.includes(widgetRef.current)) {
        // If clicking/touching within the widget, don't capture selection
        return;
      }

      // Small delay to ensure selection is complete
      setTimeout(() => {
        captureSelection();
      }, 10);
    };

    // Listen for both mouse and touch events
    document.addEventListener('mouseup', handleSelectionEnd);
    document.addEventListener('touchend', handleSelectionEnd);
    
    return () => {
      document.removeEventListener('mouseup', handleSelectionEnd);
      document.removeEventListener('touchend', handleSelectionEnd);
    };
  }, [isQuoteMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      const service = aiServices.find((s) => s.id === selectedService)
      if (service) {
        // Include selected text as context if available
        let fullQuery = agentPrompt.replace(/\${webpage_url}/g, window.location.href)
          .replace(/\${question}/g, question.trim())

        if (selectedText) {
          fullQuery = fullQuery.replace(/\${text_selection_context}/g, `${textSelectionPrefix} "${selectedText}"`);
        } else {
          fullQuery = fullQuery.replace(/\${text_selection_context}/g, "");
        }

        window.open(service.url + encodeURIComponent(fullQuery), "_blank")
        setQuestion("")
        setSelectedText("")
        setIsQuoteMode(false)
        if (!isPinned) {
          setIsExpanded(false)
        }
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && question.trim()) {
      handleSubmit(e)
    }
  }

  function handleSelectionChange(value: string) {
    setSelectedService(value)
    setSuppressClose(false);
  }

  const toggleQuoteMode = () => {
    if (!isQuoteMode) {
      // Check if there's already a selection when activating quote mode
      captureSelection();
      setIsQuoteMode(true);
    } else {
      // Deactivate quote mode
      setIsQuoteMode(false);
    }
  };

  const clearSelection = () => {
    setIsQuoteMode(false);
    setSelectedText("");
  };

  const selectedServiceName = aiServices.find((s) => s.id === selectedService)?.name || "ChatGPT"

  return (
    <div id="floating-ai-widget" ref={widgetRef} className="fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out">
      <div className={`bg-white/20 backdrop-blur-md border border-black/10 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden transition-transform duration-200 ease-out ${isExpanded ? 'scale-100' : 'scale-95 hover:scale-100'}`}>
        {!isExpanded ? (
          // Collapsed State
          <div className="flex items-center gap-2 p-3">
            <Button
              onClick={() => setIsExpanded(true)}
              variant="ghost"
              className="text-gray-700 hover:text-gray-900 hover:bg-white/20 font-medium"
            >
              Ask {selectedServiceName}
            </Button>

            <DropdownMenu modal={false} onOpenChange={setSuppressClose}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-auto border-0 bg-transparent hover:bg-white/20 focus:ring-0 focus:ring-offset-0 h-auto p-1">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                container={isWidget ? widgetRef.current?.getRootNode() as Element : undefined}
              >
                {aiServices.map((service) => (
                  <DropdownMenuItem 
                    key={service.id} 
                    onClick={() => handleSelectionChange(service.id)}
                    className="cursor-pointer"
                  >
                    {service.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          // Expanded State
          <div className="p-4 w-80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Ask</span>
                <DropdownMenu  modal={false} onOpenChange={setSuppressClose}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-auto border-0 bg-transparent hover:bg-white/20 focus:ring-0 focus:ring-offset-0 text-sm h-auto p-1 px-2">
                      {selectedServiceName}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start"
                    container={widgetRef.current?.getRootNode() as Element}
                  >
                    {aiServices.map((service) => (
                      <DropdownMenuItem 
                        key={service.id} 
                        onClick={() => handleSelectionChange(service.id)}
                        className="cursor-pointer"
                      >
                        {service.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  onClick={toggleQuoteMode}
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 hover:bg-white/20 ${isQuoteMode ? 'text-blue-600 bg-blue-100/30' : 'text-gray-500'}`}
                  title="Quote selected text"
                >
                  <Quote className="h-3 w-3" />
                </Button>
                <Button
                  onClick={() => {
                    setIsPinned(false);
                    setIsExpanded(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-white/20 text-gray-500"
                  title="Minimize"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {(selectedText || isQuoteMode) && (
                <div className="mb-3 p-2 bg-white/30 rounded-lg border border-white/30 group">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {selectedText ? "Quoted from page" : "Select text from page"}
                    </span>
                    {selectedText && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={clearSelection}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {selectedText ? (
                    <div className="border-l-3 border-gray-500 pl-3">
                      <p className="text-sm text-gray-700 break-words whitespace-pre-line line-clamp-3">
                        {selectedText}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Highlight any text on the page to quote it
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={question}
                  onChange={handleQuestionChange}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="bg-white/50 border-white/30 focus:bg-white/70 focus:border-white/50 placeholder:text-gray-500 flex-1"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!question.trim()}
                  className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0 px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <div className="flex justify-between items-end">
              <div className="mt-2 text-xs text-gray-600">
                {question.trim() ? "Click send or press Enter" : "Type your question above"}
              </div>
              <a href="https://saught.ai/" className="text-xs text-gray-600 underline">by saught.ai</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
