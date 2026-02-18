# Contributing to Collab Digital Twins Documentation

Thank you for contributing to Collab Digital Twins documentation! This guide will help you write clear, consistent, and useful documentation.

## Documentation Philosophy

We follow these core principles:

1. **Plain language** - Write for accessibility and understanding
2. **Clear scope** - Each document covers one topic well
3. **Well-structured** - Key points up front, logical flow throughout
4. **Audience-aware** - Know who you're writing for and what they need

## Directory Structure

Each documentation directory should start with an `overview.md` file that covers:

- **Prerequisites** - What the reader should know before reading this section
- **Scope** - What topics this section covers
- **Non-scope** - Related topics covered elsewhere (with links)

Example structure:
```
docs/
├── authorization/
│   ├── overview.md          ← Start here
│   ├── roles-permissions.md
│   └── casl-integration.md
├── ui-components/
│   ├── overview.md          ← Start here
│   ├── map-viewer.md
│   └── bim-viewer.md
└── api/
    ├── buildings/
    │   ├── overview.md      ← Start here
    │   └── endpoints.md
    └── sites/
        ├── overview.md
        └── endpoints.md
```

## Writing Guidelines

### Code Examples

- **Always specify the language** in code blocks: ` ```typescript`, ` ```bash`, ` ```json`
- **Keep examples working and realistic** - Test your code before documenting
- **Show complete examples** - Include necessary imports and context
- **Add comments for complex logic**

Example:
```typescript
import { useState } from 'react';

//Function description
export function Counter() {
    const [count, setCount] = useState(0);

    return (
        Count: {count}
        <button onClick={() => setCount(count + 1)}>
    );
}
```

### Formatting

- **Use tables for structured data** - Parameters, props, comparisons
- **Use relative links** - `[Link](../other-doc.md)` not absolute paths
- **Bold for UI elements** - "Click the **Create Building** button"
- **Code for technical terms** - "Use the `ability.can()` method"

