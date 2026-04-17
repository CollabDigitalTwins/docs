# Docs Generation Workflow

This workflow auto-generates documentation pages from source code in the CDT core repo using the Claude API. It fetches source files, feeds them to Claude with the appropriate template, and opens a draft PR for human review.

Currently **manual trigger only**. The workflow supports auto-triggering on core repo changes but this is not yet configured — see [Future: Auto Trigger](#future-auto-trigger) below.

## How It Works

```
Someone triggers the workflow manually
        │
        ▼
Workflow fetches source file(s) from the core repo
        │
        ▼
Claude reads the source + template and generates an MDX doc page
        │
        ▼
Draft PR is opened in the docs repo
        │
        ▼
Reviewer fills in TODOs, verifies accuracy, and merges
```

API credits are only consumed during the Claude generation step. Failed runs before that step cost nothing.

---

## Setup

### Required Repo Secrets

Add these under **docs repo → Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `ANTHROPIC_API_KEY` | API key from console.anthropic.com |
| `SOURCE_REPO_TOKEN` | GitHub fine-grained PAT with Contents: Read on the core repo |
| `SOURCE_REPO_ORG` | GitHub org for the core repo (e.g. `collabdt`) |
| `SOURCE_REPO_NAME` | Core repo name (e.g. `core`) |

### Required Repo Permissions

Under **docs repo → Settings → Actions → General → Workflow permissions**:
- Set to **Read and write permissions**
- Check **Allow GitHub Actions to create and approve pull requests**

### GitHub PAT Setup

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
2. Create a token scoped to the core repo only
3. Under Repository permissions, set **Contents: Read-only**
4. Add the token as `SOURCE_REPO_TOKEN` in the docs repo secrets

---

## Triggering the Workflow

Go to **docs repo → Actions → Generate Docs → Run workflow**.

Fill in the three fields:

| Field | Description | Example |
|-------|-------------|---------|
| `source_path` | Path to a file or directory in the core repo | `src/core/hooks/buildings` |
| `doc_type` | Which template to use | `hook` |
| `output_path` | Where to write the doc in this repo | `docs/hooks/buildings.md` |

**Accepted `doc_type` values:**

| Value | Use for |
|-------|---------|
| `component` | React components in `src/core/components/` |
| `hook` | SWR hooks in `src/core/hooks/` |
| `context` | Context providers in `src/core/store/` |
| `api` | API routes in `src/app/api/` |
| `concept` | Narrative/architecture pages |

**Single file vs directory:**

- Single file — point at a `.ts` or `.tsx` file directly. Claude documents that file only.
- Directory — point at a folder. All `.ts` and `.tsx` files in that directory are concatenated and Claude generates one consolidated doc covering all of them.

Use single file for standalone components. Use directory for resource-grouped files like hooks where all files are closely related.

**Common paths:**

| What | `source_path` |
|------|---------------|
| Buildings hooks | `src/core/hooks/buildings` |
| Sites hooks | `src/core/hooks/sites` |
| Toolbar component | `src/core/components/Toolbar.tsx` |
| Map context | `src/core/store/Map/context.ts` |

Each run opens a new draft PR regardless of existing open PRs for the same path. Close any duplicates before merging.

---

## Skipping Files

To exclude a file from documentation generation, add this comment near the top of the file:

```ts
// @docs-skip: shadcn
```

The reason after the colon is optional but recommended. Common values: `shadcn`, `generated`, `external`, `internal`.

The workflow checks for `@docs-skip` before calling the Claude API. If found, the run exits early and no credits are consumed.

---

## Reviewing a Generated PR

Every generated PR is opened as a **draft** and includes a before-merging checklist. Here's the full review process:

### 1. Read the generated content

Go to the PR → **Files changed** tab. Review the generated `.md` file against the checklist:

- [ ] Fill in all `<!-- TODO: ... -->` sections — these require human context (design decisions, business logic, edge cases, architectural rationale)
- [ ] Verify auto-populated props, params, and return types are accurate
- [ ] Check all links in the Related section resolve to real pages
- [ ] Update `last_updated` in the frontmatter to today's date
- [ ] Remove any `<!-- placeholder -->` comments that aren't needed

### 2. Edit directly in the PR

For small edits, click `...` on the file in Files changed → **Edit file**. Commit directly to the PR branch — no need to check out locally.

### 3. Preview locally (optional)

To preview the rendered page in Docusaurus before merging:

```bash
git fetch
git checkout docs/auto-<run-id>
npm run start
```

Open `localhost:3000` and navigate to the relevant section.

### 4. Mark ready and merge

Once all TODOs are resolved and the content looks accurate, click **Ready for review** to convert from draft, then merge into main.

---

## What Claude Can and Can't Infer

**Claude fills in automatically:**
- Props and their TypeScript types
- Hook signatures, parameters, and return shapes
- API endpoint methods, paths, and status codes
- Usage examples based on the actual code
- Related section links based on naming conventions

**Claude cannot infer — requires human input:**
- Why a design decision was made
- Business logic and edge cases not evident from code
- Architectural tradeoffs or alternatives considered
- Anything that lives in someone's head and not in the source

These gaps are marked with `<!-- TODO: ... -->` comments in the generated output.

---

## Future: Auto Trigger

The workflow already supports a `repository_dispatch` trigger which can fire automatically when code is merged in the core repo. It is currently dormant — nothing sends dispatch events to this repo yet.

To enable it, add this workflow to the core repo:

```yaml
# core repo: .github/workflows/notify-docs.yml
name: Notify Docs Repo

on:
  push:
    branches: [main]
    paths:
      - 'src/core/components/**'
      - 'src/core/hooks/**'
      - 'src/core/store/**'

jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - name: Get changed files
        id: changed
        uses: tj-actions/changed-files@v44

      - name: Dispatch to docs repo
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.DOCS_REPO_TOKEN }}
          repository: collabdt/docs
          event-type: source-updated
          client-payload: |
            {
              "changed_files": ${{ toJson(steps.changed.outputs.all_changed_files) }},
              "doc_type": "component",
              "output_path": "docs/components/auto-updated.md"
            }
```

Recommended to set this up only after manual generation has established baseline coverage across all sections.