#!/usr/bin/env node

/**
 * generate-doc.js
 *
 * Reads a source file (or concatenated directory files) and a template,
 * calls the Claude API, and writes the generated doc to the output path.
 *
 * Usage:
 *   node scripts/generate-doc.js \
 *     --source /tmp/source_input.txt \
 *     --template docs/templates/api-template.mdx \
 *     --output docs/api/buildings.md
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Parse CLI args
const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const sourcePath = get('--source');
const templatePath = get('--template');
const outputPath = get('--output');

if (!sourcePath || !templatePath || !outputPath) {
  console.error(
    'Usage: node generate-doc.js --source <path> --template <path> --output <path>',
  );
  process.exit(1);
}

const sourceContent = fs.readFileSync(sourcePath, 'utf8');
const templateContent = fs.readFileSync(templatePath, 'utf8');

const client = new Anthropic();

const systemPrompt = `You are a technical documentation writer for a geospatial platform called CDT.

The platform is built with Next.js, TypeScript, Prisma, MapLibre, SWR, CASL, shadcn/ui, and MinIO.

Your job is to generate a documentation page by filling in the provided MDX template using the source code provided.

Rules:
- Follow the template structure exactly. Do not add or remove sections.
- Fill in every field you can confidently infer from the source code.
- For sections you cannot infer (design decisions, business logic, edge cases), leave the <!-- TODO: ... --> comment exactly as-is. Do not invent content.
- For table rows (props, params, returns), auto-populate what you can from TypeScript types and JSDoc comments. Leave <!-- description --> for anything unclear.
- Use plain, direct language. No filler phrases like "this component provides" or "this hook is responsible for".
- Code examples should be minimal and realistic — not toy examples.
- The Related section should link to the most likely related pages based on naming conventions (e.g. a buildings API route links to hooks/buildings.md and data-model/building.md).
- Output only the raw MDX content. No preamble, no explanation, no markdown fences around the whole output.`;

const userPrompt = `Here is the template to fill in:

${templateContent}

Here is the source code to document:

${sourceContent}

Generate the documentation page.`;

async function main() {
  console.log(`Generating doc for: ${outputPath}`);
  console.log(`Template: ${templatePath}`);

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    system: systemPrompt,
  });

  const generated = message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(outputPath, generated, 'utf8');
  console.log(`Done — written to ${outputPath}`);
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
