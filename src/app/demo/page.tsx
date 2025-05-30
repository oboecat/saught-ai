import { FloatingAIWidget } from "@/components/floating-ai-widget"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white text-gray-600">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-normal text-black mb-8">Widget Playground</h1>
        
        <div className="space-y-8">
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-medium text-black mb-4">Try it out!</h2>
            <p className="mb-4">
              This is a demo page where you can test the Saught AI widget. The widget appears in the bottom-right corner.
            </p>
            <p className="text-sm text-gray-500">
              Try selecting some text on this page and clicking the quote button in the widget to include it as context!
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-black mb-4">Sample Content</h2>
            <div className="prose prose-gray max-w-none">
              <p>
                The Saught AI widget is designed to make it easy for your visitors to ask questions about your content
                using their favorite AI service. It automatically includes context about what page they're on and what
                text they've selected.
              </p>
              
              <h3 className="text-lg font-medium text-black mt-6 mb-3">How it works</h3>
              <ul className="space-y-2">
                <li>When a visitor clicks "Ask AI", the widget opens with a text input</li>
                <li>They can select any text on your page and click the quote button to include it</li>
                <li>The widget constructs a prompt with the page URL, selected text, and their question</li>
                <li>It opens their chosen AI service (ChatGPT, Copilot, etc.) in a new tab with the full context</li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-6 mb-3">Privacy First</h3>
              <p>
                The widget doesn't send any data to our servers. It simply constructs a URL and opens the AI service
                directly. This means:
              </p>
              <ul className="space-y-2">
                <li>No tracking or analytics</li>
                <li>No data collection</li>
                <li>No cookies (except localStorage for user preferences)</li>
                <li>Works entirely client-side</li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-6 mb-3">Perfect for Documentation</h3>
              <p>
                If you have technical documentation, the widget is especially useful. Users can select code snippets,
                error messages, or configuration examples and ask for help directly. The AI will have full context
                about what they're looking at.
              </p>
            </div>
          </section>

          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-medium text-black mb-4">Try these examples:</h2>
            <ul className="space-y-3 text-sm">
              <li>• Select some text above and ask "What does this mean?"</li>
              <li>• Ask "How do I add this widget to my React app?"</li>
              <li>• Ask "What AI services does this support?"</li>
              <li>• Ask "Is this widget free to use?"</li>
            </ul>
          </section>
        </div>
      </div>

      <FloatingAIWidget />
    </div>
  )
} 