"use client"

import { useState } from "react"
import { CodeBlock } from "@/components/code-block"
import { WIDGET_LATEST_URL, WIDGET_PINNED_URL, MAJOR_VERSION, VERSION } from "@/lib/version"

const methods = [
  {
    id: "script",
    name: "HTML",
    description: "Works anywhere - WordPress, React, Vue, plain HTML, whatever",
    code: `<!-- Latest version (recommended) -->
<script async src="${WIDGET_LATEST_URL}"></script>

<!-- Or pin to specific version -->
<script async src="${WIDGET_PINNED_URL}"></script>`,
  },
  {
    id: "shadcn",
    name: "shadcn",
    description: "For React/Next.js projects using shadcn components",
    code: `npx shadcn add https://saught.ai

// Then use it in your component:
import { FloatingAIWidget } from "@/components/floating-ai-widget"

export default function MyPage() {
  return (
    <div>
      {/* Your content */}
      <FloatingAIWidget />
    </div>
  )
}`,
  },
]

export function PlatformTabs() {
  const [activeTab, setActiveTab] = useState("script")
  const activeMethod = methods.find(m => m.id === activeTab)

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => setActiveTab(method.id)}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === method.id 
                ? "text-black border-b-2 border-gray-900" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {method.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeMethod && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {activeMethod.description}
            </p>
            <CodeBlock
              language={activeMethod.id === "script" ? "html" : "javascript"}
              code={activeMethod.code}
            />
            {activeMethod.id === "script" && (
              <p className="text-xs text-gray-400 mt-3">
                💡 Use <code className="bg-gray-100 px-1">v{MAJOR_VERSION}.js</code> for latest updates, or pin to <code className="bg-gray-100 px-1">v{VERSION}.js</code> for stability
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}