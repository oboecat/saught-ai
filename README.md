# Saught AI

A little widget that connects your page, your users, and their favorite agent.

## What is it?

Saught AI is a lightweight JavaScript widget that adds an "Ask AI" button to any webpage. When users click it, they can ask questions about the current page content and get redirected to their preferred AI service (ChatGPT, Claude, Perplexity, etc.) with full context.

## Features

- **Contextual**: Automatically includes what the user is reading and any text they select
- **Familiar**: Opens in the user's preferred AI service with full context  
- **Zero complexity**: No servers, no tracking, no database - just a simple redirect

## Installation

### HTML (Works anywhere)

```html
<!-- Latest version (recommended) -->
<script async src="https://saught.ai/v0.js"></script>

<!-- Or pin to specific version -->
<script async src="https://saught.ai/v0.2.0.js"></script>
```

### shadcn (React/Next.js)

```bash
npx shadcn add https://saught.ai
```

Then use it in your component:

```javascript
import { FloatingAIWidget } from "@/components/floating-ai-widget"

export default function MyPage() {
  return (
    <div>
      {/* Your content */}
      <FloatingAIWidget />
    </div>
  )
}
```

## Configuration

### Set a default AI service

```html
<script 
  src="https://saught.ai/v0.js"
  data-default-ai="claude"
></script>
```

Options: `chatgpt`, `claude`, `perplexity`, `copilot`, `grok`

### Custom placeholder

```html
<script 
  src="https://saught.ai/v0.js"
  data-placeholder="Ask about our docs..."
></script>
```

### Custom prompt template

```html
<script 
  src="https://saught.ai/v0.js"
  data-agent-prompt="You're helping someone on ${webpage_url}. They selected: ${text_selection_context}. Question: ${question}"
></script>
```

Available variables: `${webpage_url}`, `${question}`, `${text_selection_context}`

## Development

This is a [Next.js](https://nextjs.org) project. To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Demo

Visit [saught.ai](https://saught.ai) to see the widget in action - click the "Ask AI" button in the bottom-right corner.

## Why not a chatbot?

Because it's free. Instead of building another chatbot, Saught AI leverages the AI services your users already know and love.

## Credits

Special thanks to [Ian Hassard](https://ca.linkedin.com/in/ianhassard) for the name and graciously providing the domain.

Built because I needed it.
