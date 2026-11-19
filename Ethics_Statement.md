# Ethics statement | Calorie and Macro Meal Finder

Eric Braverman · Brayden Molinyawe · Christopher Farah  
**Team review draft | 12 November 2026 | Audit baseline: main 9624d53; implementation branch 6e65ce7**

## 1. Privacy summary

D1/D2 define the authenticated calorie-only release; protein ranking, saved macro goals and guest search are deferred. D0 describes a search request, a saved profile, and a maintainer import. Asking to see meals under 700 kcal authorizes answering that request; it does not authorize remembering the target or connecting it to analytics. US-01 distinguishes search from “save as my default,” and US-05 requires account deletion. These are design commitments, not verified deployment behavior.

**Consent and project closure.** Proposed UI for team review: before the first search explain what goes to the server, that saving is optional, and who operates the service. Label the separate save action “Remember my calorie target on this account.” At registration explain the identity provider and deletion path. Maintainers explicitly confirm validated imports. No implementation of those meal-specific notices or end-of-project purge was found. Before recruiting users, assign an operator and date to close registration, revoke access, delete profile and identity records, clear logs and expire backup copies; verify deletion with a test account. Medical history is explicitly excluded by the constraints essay. No evidence shows that a previously collected field was actually removed.

| Data item / source | Purpose | Consent or authority | Storage / access | Retention or gap |
|---|---|---|---|---|
| Method, path, headers, body, client IP and forwarded protocol / browser and tunnel (I1–I3) | Route requests and return pages | Explain ingress at first use | Cloudflare edge, connector, frontend; operators may see logs | In-flight; edge and host log periods unverified |
| Username and password / login form (I3) | Authenticate | Registration and sign-in notice needed | Keycloak identity store; credentials entered at provider | Delete identity on account deletion; backup expiry separate |
| Code, state, verifier, redirect URI, client ID / OIDC (I3–I4) | Bind callback to session | Sign-in action | Browser callback and frontend/session | One exchange; D2 opaque cookie; 30 min idle, 8 h absolute; restart clears server memory |
| Access, refresh and ID tokens; subject, roles and expiry / Keycloak (I4–I8) | Authorize requests | Explain session at sign-in | D2: frontend server and backend; starter uses browser localStorage | Access 5 min; verify refresh lifetime and revocation |
| Public signing keys, key ID, type, algorithm, modulus and exponent / Keycloak (I8) | Verify signatures | Service operation | Backend cache; public keys only | D0 cache: 10 min |
| Type, calorie target, restaurant IDs, limit; optional protein mode / search (I5, I10) | Filter and rank | Search action only | C1/C2 and read-only C5 query; no search-history store in D0 | Request only by design; verify query strings never enter logs |
| User UUID, saved calorie target; possible future saved macro goals/preferences / user (I6, I11) | Restore defaults | Separate save action; future fields need notice | C3 and profile DB; owner-scoped access | Delete via profile and identity flow; test both sides |
| Service-account token and target user UUID / C3 (I9) | Delete identity | Explicit account-deletion confirmation proposed | C3 → Keycloak admin API | Token expiry unverified; never log it |

**D2 deletion and operations.** Profile deletion creates a durable pending job; C3 removes the identity, then clears the profile, job and creator attribution. Recovery retries every minute and alerts after ten failed runs. Administrators retain a separate tombstone for seven days so restoring a backup cannot resurrect a deleted account. D2 requires CSRF token plus origin checks for state changes, a server-side nonce, least-privilege database roles and private health checks. Logs use route templates, timestamps, request IDs, status, duration, component and stable error codes. These mechanisms are specified, not deployment attestations.

**Catalog and operational records.** The rows below complete the import, result and operational flows. Public food facts are distinct from an individual's association with those foods.

| Data item / source | Purpose | Consent or authority | Storage / access | Retention or gap |
|---|---|---|---|---|
| Restaurant ID, CSV filename/content, USDA source/query / maintainer (I7, I13) | Stage import | Maintainer supplies file; confirm before commit | C4; USDA sees query and server API key | Normalized ImportRow staging; D1 preview expires after 24 h; verify cleanup |
| FDC ID, description, nutrient IDs/values, calories, serving quantity/unit, optional macro grams / supplier (I12–I13) | Nutrition per serving | Source terms, not personal consent | C4 → C5; C2 reads | Catalog lifecycle; retain source/date for provenance |
| Meal/item IDs, names, quantities, restaurant, type, totals, serving, ranked items and closest option / C5 (I5, I10) | Display choices | Search response | Public catalog → C2/C1 → requester | Catalog persists; response caching policy unverified |
| Import ID, status, added/removed/changed counts, old/new values, error line/reason, recalculation count, source/date / C4 (I7, I12) | Preview, confirm, audit | Maintainer action | Maintainer view; C4/C5 import log | 24 h for previews; permanent summary TTL unverified; erase creator on deletion |
| Request ID, method, URI, status, duration / template filter; backup dump / scheduler | Diagnose and restore | Disclose before live use | Operator logs; template encrypts dump with age and copies by SSH | D2: 7 days of rotated logs and 7 encrypted daily backups; starter script defaults to 14 days |
| Email, full name, username, marketing flag, billing ID, created/updated timestamps / template schema; OIDC subject, clicks, pageviews/replay / optional analytics | Generic starter features | No project consent evidenced for billing, marketing or replay | Starter DB; PostHog if keyed; Sentry integration needs event review | No evidence of live use or vendor deletion. Exclude or independently justify before enabling |

## 2. Security summary

**History audit.** After pulling on 12 Nov 2026, git rev-list --remotes counted 17 commits reachable from both fetched team branches. git log --remotes -G searched historical diffs for password/client-secret assignments, private-key headers, AWS access-key IDs, GitHub tokens and Stripe live-secret patterns. Development app and Keycloak Secret manifests with literal placeholder credentials were added in 7afe150; realm exports in all three environments contain a placeholder-like client secret. The narrower high-confidence patterns produced no matching commits. This was a text-pattern check, not entropy scanning or a live credential test. Broad patterns also matched design examples and the feature-branch import (6e65ce7); no validation against live services was attempted. No credential values are reproduced. No rotation or removal was performed; verify unused status, rotate any reused credential, and provision unique secrets before deployment.

| Self-audit question | Evidence / remaining check |
|---|---|
| Could a default credential work? | Dev manifests supply defaults. Staging/prod reference Vault through ExternalSecrets. Verify rendered environments reject defaults; no deployed instance was tested. |
| Are endpoints protected? | Spring Security requires authentication except OPTIONS, health and the starter Stripe webhook. Verify signature handling or exclude billing. D0 requires JWTs and a maintainer role for imports; test 401, 403 and cross-account access. |
| Are tokens, transport and secrets protected? | D0 specifies OIDC/PKCE, five-minute JWTs and public HTTPS via Cloudflare. Starter browser token storage differs. Check issuer/audience and move tokens to the intended boundary before real users. Vault references do not prove rotation or disk encryption. |
| Can requests be abused? | Prod realm enables brute-force protection; dev/staging do not. D0 caps uploads at 5 MB and handles upstream USDA 429s. No verified inbound search/import rate limiter; agree limits and test 429 responses. |

## 3. Licensing summary

**Project license:** no repository-root license was found. No affirmative public redistribution grant for the team's work is documented. The team must determine ownership and agree its license; the starter package's author field is not a license. Compatibility with all dependencies cannot be confirmed. Keep the project-specific choice separate from licenses already applying to third-party files.

The accompanying [itemized license and attribution register](NOTICE.md) lists all 468 distinct JavaScript package/version pairs in bun.lock and the named Gradle libraries and plugins. The frontend package.json describes a Vite/React starter, while D0 proposes Next.js. Including a package here records its presence, not that it is used in the intended meal finder. Version-specific package declarations and Maven POMs were consulted, with SPDX identifiers checked against the [official list](https://spdx.org/licenses/).

| Component / version | License and type | Obligation or outstanding decision |
|---|---|---|
| Spring Boot starters 3.5.8; Liquibase 4.31.1 | Apache-2.0, permissive | Preserve license, notices and change statements as applicable. |
| PostgreSQL JDBC 42.7.8; React and React DOM (versions in register) | BSD-2-Clause; MIT, permissive | Preserve copyright, conditions and disclaimer. |
| Locked frontend packages with MPL-2.0 | File-level copyleft | If distributing executable form, make the covered source available and preserve notices. Determine which optional packages actually ship. |
| BusyBox 1.37; Temurin 21 JRE | GPL-2.0-only; OpenJDK with Classpath exception | Container distribution has separate source/notice obligations. Inspect the actual image and embedded components. |
| GSAP 3.15.0 | Custom vendor terms; no SPDX-listed open-source license identified | Keep proprietary notices, check permitted uses; a free download does not confer a general right to relicense. |
| USDA FoodData Central API v1 | CC0-1.0, public-domain dedication | Acknowledge source as requested; protect API key and respect rate limits. |
| Restaurant sources, starter code, logos and compiled theme | Exact permissions unverified | Obtain source-specific terms and rights before distribution or replace the material. |

**Remaining license work.** Review register entries marked unverified, retrieve actual copyright notices, resolve the JVM transitive graph and build an inventory from the exact container digests used. Inspect fonts and other bundled material inside the theme. Record a team decision for each copyleft or custom-terms component. This document does not assert those checks have passed.

## 4. Attribution list

The [NOTICE register](NOTICE.md) is the common attribution list linked from README section 5. It identifies package versions, links to source metadata and names embedded asset paths. These sources require different kinds of credit:

- **Libraries and adapted code:** Spring, PostgreSQL JDBC, MapStruct and other JVM artifacts are listed by Maven coordinate; frontend libraries by locked npm name/version. The starter entered in commit 7afe150. Identify who supplied it, its upstream URL/license, and any copied tutorial code. No complete snippet provenance record was located.
- **Nutrition data:** The proposed grocery importer reads USDA FoodData Central by API. USDA publishes the data under CC0 and asks for attribution ([USDA API guide](https://fdc.nal.usda.gov/api-guide/)). A maintainer would transcribe restaurant nutrition facts into CSV. No specific restaurant permission, source snapshot or successful import is attested here.
- **Creative assets:** D0 contains two draw.io sources and exported PNGs. The unmerged implementation branch credits landing-page photos to Ilya Mashkov and Lee Milo (see NOTICE). The main-branch starter includes a logo, a remote Roboto Mono font import and a Keycloak theme JAR with fonts and logos. Link the actual creator and license for each reused asset; identify team-created artwork separately. A theme archive containing a logo is not evidence of permission to reuse the brand.

**Professional code review for the component owners.** Apply the [ACM Code of Ethics](https://www.acm.org/code-of-ethics) to a decision you actually made. For §1.6 (privacy), verify whether pressing Search ever persists the target or sends a replay event. For §1.3 (honesty), test whether unavailable protein is shown as unknown rather than zero or a health claim. For §1.4 (fairness), check US-04 with a screen reader and identify which foods the initial catalog underrepresents. For §1.5 (credit), trace one displayed food and one reused asset back to the source. Record the team's own findings and reasoning before signing.

**Traceability limits.** Evidence reviewed: D0 §3–5 (components and I1–I13), [user stories US-01–US-08](Requirements/User_Stories.md), the [constraints essay](Ethics/Constraints_Essay.md), the [product scope](Project-Description.md#macro-extension-notes), and the template's db/changelog/03-users.xml. See Design_Diagrams/D1_Detailed_Design.md §2 (nutrition schema), §4–6 (reuse and stack), and D2_Detailed_Design.md §2–4 (profile, deletion, operations, traceability). A separately titled Week 9 technical specification was not found. The starter users table is not the D1 model. Reconcile any separate Week 9 submission; if the team adopts broader collection than the constraints essay allows, revise the essay and explain the change.

## 5. AI-use disclosure

“Generative AI tools may be used for drafting and code assistance but not for the design decisions or written analysis that are assessed in this course.”

This draft was prepared with AI assistance. The entries below are grounded in the available chat, not a complete account of any member’s work. A file named CLAUDE.md in the starter does not establish who used an AI tool. Each member should reconstruct their own use, including any work outside this chat, and record the checks they personally performed.

| Tool | Used by | Task | Column | How verified / action needed |
|---|---|---|---|---|
| Codex | Christopher Farah | Summarized assignment prompts, inspected project docs, drafted meeting agenda and edited project wording | Generally OK: drafting | Compared prompts and existing files in chat; Christopher to confirm personal review. |
| Codex | Christopher Farah | Collected history-scan evidence, extracted dependency records, produced this Markdown, NOTICE and PDF draft | Generally OK: evidence collection / drafting | Source paths, commit and upstream metadata recorded. Component owners must independently reproduce or inspect findings. |
| Codex | Christopher Farah | Suggested ranking by total protein, tie rules, missing-data behavior and possible D1 scope; some suggestions entered working docs | Not a substitute for design decisions | Team must identify accepted/rejected suggestions, independently derive the rule and rationale, and correct any document that presents a suggestion as decided. |
| Codex | Christopher Farah | Drafted privacy/security wording, proposed consent/closure steps and ethics-review prompts here | Not a substitute for assessed written analysis | Replace proposals with the team's actual choices, evidence and independently written analysis. No member verification is attested. |
| Not yet reported | Eric Braverman | Personal tool/task history pending | Unclassified | Member to record each use and verification, or explicitly attest no use. |
| Not yet reported | Brayden Molinyawe | Personal tool/task history pending | Unclassified | Member to record each use and verification, or explicitly attest no use. |

**Sign only after independent review.** For each signature: “I confirm that the architecture, data model, priorities and design rationale were the team's own, and that my AI-use disclosure is complete and accurate.”

Christopher Farah — Signature: /s/ Christopher Farah    Date: November 12, 2026

Eric Braverman — Signature: ____________________ Date: __________

Brayden Molinyawe — Signature: ____________________ Date: __________
