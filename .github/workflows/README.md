# Docs Generation Workflow

This workflow auto-generates documentation pages from source code in the CDT core repo using the Claude API.

## How It Works

1. You trigger the workflow (manually or automatically on PR merge)
2. The workflow fetches the specified source file(s) from the core repo
3. Claude reads the source + the appropriate template and generates an MDX doc page
4. A draft PR is opened in this repo for human review
5. A reviewer fills in any `<!-- TODO: ... -->` sections, verifies accuracy, and merges

## Setup

### Required Secrets

Add these in the docs repo under **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `SOURCE_REPO_TOKEN` | GitHub PAT with `repo` read access to the core repo |
| `SOURCE_REPO_ORG` | GitHub org name for the core repo (e.g. `collabdt`) |
| `SOURCE_REPO_NAME` | Core repo name (e.g. `core`) |

### GitHub PAT Setup

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Create a token scoped to the core repo with **Contents: Read** permission
3. Add it as `SOURCE_REPO_TOKEN` in this repo's secrets

## Manual Trigger

Go to **Actions → Generate Docs → Run workflow** and fill in:

| Field | Example |
|-------|---------|
| `source_path` | `src/app/api/buildings` or `src/components/Toolbar.tsx` |
| `doc_type` | `api`, `component`, `hook`, `context`, or `concept` |
| `output_path` | `docs/api/buildings.md` |

Supports both single files and directories. For directories, all `.ts` and `.tsx` files are concatenated and fed to Claude together.

## Auto Trigger (Cross-repo Dispatch)

To trigger automatically when code is merged in the core repo, add this workflow to the **core repo**:

```yaml
# In core repo: .github/workflows/notify-docs.yml
name: Notify Docs Repo

on:
  push:
    branches: [main]
    paths:
      - 'src/app/api/**'
      - 'src/components/**'
      - 'src/hooks/**'
      - 'src/store/**'

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
          repository: YOUR_ORG/cdt-docs
          event-type: source-updated
          client-payload: |
            {
              "changed_files": ${{ toJson(steps.changed.outputs.all_changed_files) }},
              "source_path": "${{ steps.changed.outputs.all_changed_files }}",
              "doc_type": "component",
              "output_path": "docs/components/auto.md"
            }
```

> **Note:** The auto-trigger payload needs `doc_type` and `output_path` logic — for a small team, manual dispatch is simpler to start with.

## Skipping Files

To prevent a file from being documented, add this comment anywhere at the top:

```ts
// @docs-skip: shadcn
// @docs-skip: generated
// @docs-skip: external
```

The workflow checks for `@docs-skip` before calling the API and exits early if found.

## Reviewing Generated PRs

Every generated PR includes a checklist:

- Fill in all `<!-- TODO: ... -->` sections (design decisions, edge cases, business logic)
- Verify auto-populated props/params against the actual source
- Check all links in the Related section resolve correctly
- Update `last_updated` in the frontmatter
- Remove any placeholder comments that aren't needed