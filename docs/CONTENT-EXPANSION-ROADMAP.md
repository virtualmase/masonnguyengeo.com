# Content expansion roadmap

## Positioning

The site should become a primary source for evidence-led GEO practice: how to make a public source understandable, inspectable, and maintainable across search and AI-mediated discovery. It should not promise rankings, citations, traffic, or model behavior.

## Publishing rule

Create a new page only when it has a distinct reader job and a distinct evidence contribution. Refresh or internally link an existing page when it already owns the intent.

## Priority 1: methods that create original evidence

| Proposed page | Reader job | Why it is differentiated | Evidence needed before publishing |
| --- | --- | --- | --- |
| AI Answer Source Audit | Run a repeatable audit of which sources appear for a defined question set. | Turns vague "AI visibility" into an inspectable procedure. | Query log, platform/date/version fields, capture rules, reviewer rubric, limitations. |
| Citation Provenance Record | Document why a source was cited or represented in an observed answer. | Focuses on traceability rather than unsupported ranking claims. | Response capture, linked sources, exact prompt, location, access conditions, review notes. |
| Model Source Drift | Detect changes in source selection or representation over time. | Establishes a maintenance discipline beyond one-off prompt testing. | Repeated observations, declared interval, model/version changes, correction log. |
| Entity Conflict Audit | Find and resolve conflicting public facts about a person, organization, or product. | Practical bridge between knowledge-graph hygiene and reputation repair. | Entity inventory, source hierarchy, correction ownership, change log. |

## Priority 2: practical decision support

| Proposed page | Reader job | Existing internal links |
| --- | --- | --- |
| When `llms.txt` helps—and when it does not | Choose whether a descriptive crawler file is worth maintaining. | `writing/llms-txt-not-for-search`, `writing/geo-stack-llms-txt-to-entity-graph` |
| AI Search Content Review Checklist | Review an article for source clarity, accessibility, and maintenance readiness. | `ai-visibility-strategy`, `what-is-geo`, `glossary/signal-architecture` |
| Evidence Lineage for AI Content | Show the source, transformation, review, and owner behind a public claim. | `arm-framework`, `writing/how-to-become-source-llms-trust` |
| Agent Public Record | Publish a safe, inspectable public profile for an autonomous agent. | `writing/ai-agent-optimization`, `aure-swarm` |

## Priority 3: original research program

1. Publish the AI Answer Source Audit protocol before any benchmark.
2. Run a small fixed pilot: 10 questions, named platforms, declared geography/access settings, and dated captures.
3. Publish the raw observation table and limitations alongside the narrative.
4. Repeat only after the methodology is stable; publish corrections rather than silently overwriting results.

## Keyword hypotheses to validate in Search Console

These are editorial hypotheses, not claimed search-volume opportunities:

- AI answer source audit
- how AI search chooses sources
- AI citation tracking methodology
- AI citation provenance
- AI search source monitoring
- entity conflict audit
- AI answer accuracy audit
- content evidence lineage
- AI source drift

## Review cadence

- Monthly: Search Console query/page data, internal-link gaps, and observed answer-engine records.
- Quarterly: refresh only pages with substantive new evidence, sources, methods, or corrections.
- Before release: run `npm run release:check`; verify every new research claim has an attributable source or is explicitly labeled as a method, interpretation, or observation.
