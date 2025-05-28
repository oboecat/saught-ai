import { CodeBlock } from "@/components/code-block";
import { FloatingAIWidget } from "@/components/floating-ai-widget";
import { PlatformTabs } from "@/components/platform-tabs";
import { Sparkles, Zap, Shield } from "lucide-react";
import Link from "next/link";
import {
  WIDGET_LATEST_URL,
  WIDGET_PINNED_URL,
  MAJOR_VERSION,
  VERSION,
} from "@/lib/version";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-600">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        <div className="text-center">
          <h1 className="text-5xl font-normal text-black mb-6 tracking-tight">
            Saught <span className="text-gray-400 text-3xl">AI</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            A little widget that connects your page, your users, and their
            favorite agent.
          </p>
        </div>
      </section>

      {/* Installation Section */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-normal text-black mb-4 text-center">
          How to add it
        </h2>

        <PlatformTabs />
      </section>
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <p className="text-base mb-4">
          See the "Ask AI" button in the bottom-right? Click it and ask about
          anything on this page.{" "}
          <Link
            href="/demo"
            className=" text-blue-600 hover:text-blue-700 transition-colors"
          >
            More examples →
          </Link>
        </p>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-32">
        <h2 className="text-3xl font-normal text-black mb-2 text-center">
          Why not a chatbot?
        </h2>
        <p className="text-center text-gray-500 mb-16">Because it's free.</p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
              <Sparkles className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-black mb-2">Contextual</h3>
            <p className="text-sm">
              Automatically includes what the user is reading and any text they
              select
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
              <Zap className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-black mb-2">Familiar</h3>
            <p className="text-sm">
              Opens in the user's preferred AI service with full context
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-black mb-2">Zero complexity</h3>
            <p className="text-sm">
              No servers, no tracking, no database - just a simple redirect
            </p>
          </div>
        </div>
      </section>

      {/* Configuration Section */}
      <section className="max-w-4xl mx-auto px-6 pb-32">
        <h2 className="text-3xl font-normal text-black mb-12 text-center">
          Customize It
        </h2>

        <div className="space-y-12">
          <div>
            <h3 className="text-lg text-black mb-4">
              Set a default AI service:
            </h3>
            <CodeBlock
              language="html"
              code={`<script 
  src="${WIDGET_LATEST_URL}"
  data-default-ai="claude"
></script>`}
            />
            <p className="text-sm text-gray-500 mt-2">
              Options: chatgpt, claude, perplexity, copilot, grok
            </p>
          </div>

          <div>
            <h3 className="text-lg text-black mb-4">Custom placeholder:</h3>
            <CodeBlock
              language="html"
              code={`<script 
  src="${WIDGET_LATEST_URL}"
  data-placeholder="Ask about our docs..."
></script>`}
            />
          </div>

          <div>
            <h3 className="text-lg text-black mb-4">Custom prompt template:</h3>
            <CodeBlock
              language="html"
              code={`<script 
  src="${WIDGET_LATEST_URL}"
  data-agent-prompt="You're helping someone on \${webpage_url}. They selected: \${text_selection_context}. Question: \${question}"
></script>`}
            />
            <p className="text-sm text-gray-500 mt-2">
              Variables:{" "}
              <code className="bg-gray-100 px-1">${`{webpage_url}`}</code>,{" "}
              <code className="bg-gray-100 px-1">${`{question}`}</code>,{" "}
              <code className="bg-gray-100 px-1">
                ${`{text_selection_context}`}
              </code>
            </p>
          </div>

          <div>
            <h3 className="text-lg text-black mb-4">Version pinning:</h3>
            <CodeBlock
              language="html"
              code={`<!-- Always get latest updates -->
<script src="${WIDGET_LATEST_URL}"></script>

<!-- Pin to specific version for stability -->
<script src="${WIDGET_PINNED_URL}"></script>`}
            />
            <p className="text-sm text-gray-500 mt-2">
              Use <code className="bg-gray-100 px-1">v{MAJOR_VERSION}.js</code>{" "}
              for automatic updates, or pin to a specific version like{" "}
              <code className="bg-gray-100 px-1">v{VERSION}.js</code> for
              production stability.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 pb-12">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Special thanks to{" "}
            <a
              target="_blank"
              href="https://ca.linkedin.com/in/ianhassard"
              className="text-black hover:underline"
            >
              Ian Hassard
            </a>{" "}
            for the name and graciously providing the domain.
          </p>
          <p className="text-gray-500 text-xs font-semibold">
            Built by{" "}
            <a
              href="https://twitter.com/oboecat007"
              className="text-black hover:underline"
            >
              @oboecat007
            </a>{" "}
            because I needed it.{" "}
            <a
              href="https://github.com/oboecat/saught-ai"
              className="inline-flex underline text-xs transition-colors"
            >
              view source
            </a>
          </p>
        </div>
      </footer>

      {/* Demo Widget */}
      <FloatingAIWidget />
    </div>
  );
}
