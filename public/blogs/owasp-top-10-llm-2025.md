# OWASP Top 10 for LLM Applications 2025

> A Technical Cybersecurity Deep Dive — Covering All 10 Categories, with Focus on LLM08 (Vector/Embedding Weaknesses) and LLM10 (Unbounded Consumption)

> **Source & Disclaimer:** The OWASP Top 10 for LLM Applications 2025 is maintained by the [OWASP Foundation](https://owasp.org/www-project-top-10-for-large-language-model-applications/). The summary table, category descriptions, attack analyses, and all numerical figures (costs, multipliers, thresholds) in this post represent the **author's interpretation and illustrative estimates** — not OWASP's official language. Refer to the original OWASP project page for canonical definitions. All cost figures, multipliers, and monitoring thresholds are approximate and will vary significantly by model, provider, architecture, and pricing at time of deployment. Verify against your own infrastructure before using in production security planning.

---

## At a Glance

| OWASP Risk                       | Attack Surface              | Impact                                  | Primary Defense                        |
| -------------------------------- | --------------------------- | --------------------------------------- | -------------------------------------- |
| Prompt Injection                 | Prompts, RAG, agents        | Manipulation, data exposure, tool abuse | Input/context isolation, authorization |
| Sensitive Information Disclosure | Model, RAG, logs            | Data leakage                            | Access control, data minimization      |
| Supply Chain                     | Models, libraries, datasets | Compromise, backdoors                   | Provenance, integrity verification     |
| Data/Model Poisoning             | Training/RAG data           | Manipulated behavior                    | Data validation, provenance            |
| Improper Output Handling         | LLM → application           | XSS, injection, RCE                     | Output validation/sanitization         |
| Excessive Agency                 | Agents/tools                | Unauthorized actions                    | Least privilege                        |
| System Prompt Leakage            | System instructions         | Internal info disclosure                | Keep secrets outside prompts           |
| Vector/Embedding Weaknesses      | Vector DB/RAG               | Unauthorized retrieval                  | Access controls, tenant isolation      |
| Misinformation                   | Model output                | Incorrect decisions                     | Grounding, verification                |
| Unbounded Consumption            | Inference/agents            | DoS, cost exhaustion                    | Limits, quotas, monitoring             |

---

## The 10 Categories

1. **Prompt Injection** — Attacker instructions smuggled into the LLM's context hijack its behavior.
2. **Sensitive Information Disclosure** — Model or app leaks PII, secrets, or other users' data.
3. **Supply Chain** — Compromise anywhere in the model → dataset → library → plugin → deployment pipeline.
4. **Data/Model Poisoning** — Attacker corrupts training/fine-tuning/RAG data so the model learns bad behavior.
5. **Improper Output Handling** — Trusting LLM output blindly leads to XSS, SQLi, command injection downstream.
6. **Excessive Agency** — Too many tools/permissions so a hijacked LLM can take destructive real-world actions.
7. **System Prompt Leakage** — System prompts get extracted; never put secrets/auth logic in the prompt.
8. **Vector/Embedding Weaknesses** — RAG pipeline flaws: cross-tenant leakage, poisoned documents, weak access control.
9. **Misinformation** — Hallucinations become a security issue once automated decisions act on them.
10. **Unbounded Consumption** — Resource exhaustion via huge inputs, repeated calls, runaway agent loops.

---

---

# Deep Dive: LLM08 — Vector & Embedding Weaknesses

**Core insight:** Embedding and retrieval mechanisms introduce new security boundaries that most developers ignore.

---

## 1. Vectors, Embeddings & RAG

An embedding converts text into a numerical vector. Semantically similar content produces nearby vectors.

```text
"How do I reset my password?"  →  [0.13, -0.82, 0.41, ...]
"I forgot my password"         →  [0.11, -0.80, 0.39, ...]   ← nearby in vector space
```

**The RAG pipeline:**

```text
OFFLINE:  Documents → Chunking → Embedding → Vector DB
RUNTIME:  Query → Embedding → Similarity Search → Retrieved Chunks → LLM → Response
```

> ### Similarity is not authorization.

A document can be the most relevant result while being something the user **should never see**. This is the central problem.

---

## 2. Where the Security Boundary Must Exist

**Wrong** — relying on the LLM to not leak data:

```text
Query → Similarity Search → LLM → "hopefully won't leak anything"
```

**Right** — enforcing access *before* retrieval:

```text
Query → Authentication → Authorization → Filtered Retrieval → LLM → Output Filtering → Response
```

If unauthorized documents reach the LLM's context, no prompt engineering will reliably prevent disclosure.

---

## 3. Unauthorized Retrieval

```text
User A (Sales) → "What are our layoff plans?" → Vector Search (no filter)
→ HR Confidential Doc retrieved → LLM discloses restructuring plans
```

**Why it happens:** No pre-retrieval filtering, flat index architecture, missing permission propagation, or stale permissions after access revocation.

---

## 4. Cross-Tenant Leakage

In multi-tenant SaaS, a single missing tenant filter is catastrophic:

```python
# DANGEROUS — no tenant filtering
results = vector_db.similarity_search(query, top_k=5)

# SECURE — tenant-scoped retrieval
results = vector_db.similarity_search(query, top_k=5, filter={"tenant_id": tid})
```

**Isolation options:** metadata filtering (common, risky if missed), separate collections, separate DB instances (strongest), or namespace partitioning.

AI security still depends on boring old access control — humanity's most reliable recurring plot twist.

---

## 5. Vector/RAG Poisoning

Attacker-controlled content enters the knowledge base and gets retrieved by future queries:

```text
Malicious document → Embedding pipeline → Vector DB → Future query → LLM processes poisoned content
```

**Most dangerous variant:** The poisoned document contains LLM instructions (*"Ignore previous instructions..."*) — this is where LLM08 intersects with LLM01 (Prompt Injection).

**LLM08 vs LLM04:** LLM04 covers broad data/model poisoning (training, fine-tuning). LLM08 is specifically about vector/embedding/RAG pipeline weaknesses.

---

## 6. Embedding Manipulation

Crafting content to game retrieval ranking:

- **Keyword stuffing** — packing target terms to rank highly for related queries
- **Adversarial perturbation** — subtle text that shifts embedding vectors toward target regions
- **Chunking exploitation** — placing payloads where chunk boundaries favor retrieval

Hard to detect because the manipulation is in semantic space, not on the text surface.

---

## 7. Metadata Leakage

Vector stores carry metadata (doc IDs, sources, authors, classifications, timestamps). Even without document content, metadata like `"HR-2025-LAYOFF-PLAN-v3"` from `\\internal-share\hr\confidential\` tells an attacker everything they need to know.

**Fix:** Strip sensitive metadata before indexing, implement metadata-level access controls, sanitize error messages.

---

## 8. Attack Scenarios

**Scenario 1 — Competitive Intelligence Breach:** A namespace filter defaults to global search on timeout. Tenant B retrieves Tenant A's strategic documents.

**Scenario 2 — Poisoned Knowledge Base:** Disgruntled employee edits internal wiki. Ingestion pipeline picks it up. Employees receive phishing instructions from the helpdesk bot.

**Scenario 3 — Stale Permissions:** Terminated employee's documents remain in the vector index. New team members retrieve content that should have been purged.

---

## 9. Testing

| Test                         | Objective                                         |
| ---------------------------- | ------------------------------------------------- |
| Cross-user retrieval         | Detect unauthorized document access               |
| Cross-tenant retrieval       | Test tenant isolation                             |
| Malicious document insertion | Test retrieval poisoning                          |
| Metadata exposure            | Detect information leakage                        |
| Deleted-document retrieval   | Test stale index behavior                         |
| Permission changes           | Test whether indexes respect authorization updates |
| Direct vector DB access      | Test backend exposure                             |

---

## 10. Detection

**Key signals:** Cross-tenant document retrieval, unusual query patterns, retrieval of deleted/revoked docs, metadata access spikes, new documents with anomalous embeddings.

**Critical alert:** `doc_tenant != user_tenant` and `access_granted == true` → immediate investigation.

Log every retrieval operation with user ID, tenant ID, document tenant, similarity score, and whether filters were applied.

---

## 11. Mitigation — Defense in Depth

```text
Layer 1: Ingestion Controls    → Content validation, source authentication, access-level tagging
Layer 2: Storage Isolation     → Tenant partitioning, encryption at rest, metadata minimization
Layer 3: Retrieval Auth        → Pre-query filtering, row-level security, permission propagation
Layer 4: Context Filtering     → Post-retrieval validation, content sanitization, context size limits
Layer 5: Output Validation     → Response filtering, grounding verification
Layer 6: Monitoring            → Real-time alerting, audit trails, incident response playbooks
```

---

## 12. Hypothetical Scenario: Multi-Tenant RAG Leakage

> **Note:** This is a hypothetical scenario constructed from patterns commonly observed in multi-tenant RAG deployments and publicly discussed failure modes. It is not attributed to a specific vendor or disclosure.

A B2B SaaS platform used a shared vector DB with metadata-based tenant filtering. When filtered results were sparse, the app fell back to **unfiltered search** to "improve quality."

```python
results = vector_db.search(query, filter={"tenant_id": tid}, top_k=5)
if len(results) < 3:
    results = vector_db.search(query, top_k=5)  # catastrophic fallback
```

Asking unusual, specific questions triggered the fallback — leaking competitor roadmaps, pricing strategies, and customer PII across tenants.

**Lesson:** Never sacrifice authorization for user experience. A "helpful" fallback that bypasses access controls is a vulnerability.

---

---

# Deep Dive: LLM10 — Unbounded Consumption

**Core insight:** LLM applications have **wildly variable cost per request**. The attacker chooses where on the cost spectrum each request lands.

---

## 1. Why LLM Workloads Are Different

> **Note:** The figures below are illustrative order-of-magnitude estimates. Actual costs vary significantly by model, provider, context length, and architecture. Verify against your provider's current pricing.

```text
Traditional: Request → CPU (~1ms) → Response                    ≈ $0.000001
LLM:         Request → Embedding → RAG → Inference → Tools → Response  ≈ $0.01–$1+
```

| Factor               | Traditional App | LLM App (illustrative) | Multiplier (order of magnitude) |
| -------------------- | --------------- | ---------------------- | ------------------------------- |
| Compute per request  | ~1ms CPU        | ~5s GPU                | ~5,000x                         |
| Cost per request     | ~$0.000001      | ~$0.01–$1              | 10,000x–1,000,000x              |
| Cost variability     | Low             | Extreme                | —                                |

---

## 2. Token Exhaustion

Send max-length inputs requesting verbose, multi-format output:

```text
128K input tokens + "explain in 5 languages" → ~$2/request (illustrative, model-dependent)
→ 1,000 automated requests → ~$2,000/day
```

**Defense:** Per-request input token limits aligned with legitimate use cases.

---

## 3. Request Flooding

Traditional rate limiting (requests/sec) is insufficient because request cost varies wildly.

**Use token-aware rate limiting:**

```text
Requests/min: 60  |  Input tokens/min: 40,000  |  Output tokens/min: 10,000  |  Concurrent: 5
```

---

## 4. Large-Context Attacks

- **Direct:** Send 200K-token input → GPU occupied for an extended period (duration varies by model/hardware)
- **Via RAG:** Broad query → hundreds of retrieved chunks → massive context assembled
- **Conversational:** Maintain long multi-turn conversations → context grows every turn

**Defense:** Context budgets — cap user input, retrieved context, conversation history, and total context independently.

---

## 5. Expensive RAG Operations

Attackers can target the retrieval pipeline specifically:

- Broad queries → excessive retrieval → expensive reranking → massive context
- Repeated document uploads → expensive re-embedding and reindexing

**Defense:** Cap `top_k`, limit upload sizes, rate-limit ingestion separately, cache embeddings, implement circuit breakers.

---

## 6. Agent/Tool Loops

An agent with no execution limit is an **infinitely expensive loop with an API bill attached:**

```text
while task_not_complete:
    ask_llm()       # $$
    call_tool()     # $$
```

**Defense — hard execution budgets:**

```text
Max LLM calls: 10  |  Max tool calls: 20  |  Max tokens: 100K  |  Max time: 60s  |  Max cost: $5
```

The LLM cannot be trusted to decide when to stop.

---

## 7. Recursive LLM Calls

Multi-agent chains can amplify exponentially:

```text
Depth 0: 1 agent → 3 calls  |  Depth 1: 2 agents → 6  |  Depth 2: 4 → 12  |  ...  |  Depth 5: 32 → 96
Total: 189 LLM calls from 1 user request
```

**Defense:** Max recursion depth (3), max agents per level (4), cycle detection, global shared token budget.

---

## 8. Cost vs. Availability — "Denial of Wallet"

| Dimension        | Availability Attack       | Economic Attack ("Denial of Wallet") |
| ---------------- | ------------------------- | ------------------------------------ |
| Detection time   | Minutes                   | Days to weeks                        |
| User impact      | Immediate outage          | None (service stays up)              |
| Financial impact | Limited                   | Potentially massive                  |
| Attacker risk    | High (noisy)              | Low (stealthy)                       |

A system can remain technically online while costs increase 10x. Traditional applications also face resource and economic abuse, but LLM workloads introduce unusually variable, potentially high per-request inference costs that make economic attacks particularly effective and harder to detect.

---

## 9. Testing

| Test                       | Expected Secure Behavior                  |
| -------------------------- | ----------------------------------------- |
| Max-length input           | Rejected or truncated                     |
| Exceed request rate        | 429 returned                              |
| Trigger many tool calls    | Agent stops at execution limit            |
| Multi-agent cycle          | Cycle detected and broken                 |
| Max RAG retrieval          | Context capped at budget                  |
| 100+ turn conversation     | History truncated or session limited      |
| $100+ in normal-looking requests | Cost alert triggered                |

---

## 10. Detection & Monitoring

> **Note:** The thresholds below are starting-point suggestions. Calibrate to your own baseline traffic, model costs, and risk tolerance.

| Metric                       | Typical Range (illustrative) | Suggested Alert Threshold |
| ---------------------------- | ---------------------------- | ------------------------- |
| Tokens per request           | 500–5,000                    | > 50,000                  |
| Requests per user per min    | 1–10                         | > 60                      |
| Cost per user per hour       | $0.01–$1                     | > $10                     |
| Agent iterations per request | 1–5                          | > 15                      |
| Daily API cost               | Baseline ±20%                | > 200% baseline           |

**Suggested escalation:** Daily cost exceeds 3x baseline → auto-throttle + page on-call.

---

## 11. Rate Limiting & Quotas

Enforce **three dimensions simultaneously:**

> **Note:** These tiers are illustrative examples. Design your own based on your cost model and user segments.

| Tier       | Requests/min | Tokens/min | Max cost/day | Agent iterations |
| ---------- | ------------ | ---------- | ------------ | ---------------- |
| Free       | 10           | 5,000      | $1           | 3                |
| Basic      | 30           | 20,000     | $10          | 5                |
| Pro        | 60           | 100,000    | $50          | 10               |
| Enterprise | Custom       | Custom     | Custom       | Custom           |

Use **adaptive limits** — tighten when GPU utilization > 80%.

---

## 12. Resource Budgets & Kill Switches

Every request needs a spending cap:

```text
Token budget:   Input 4K / Output 2K / Total 50K
Compute budget: Max inference 30s / Max total 120s
Agent budget:   Max 10 LLM calls / Max 20 tool calls / Max depth 3
Cost budget:    Max $5/request / Hard kill at $10
```

**Kill switches:** Per-request kill, per-user suspend, per-endpoint throttle, global throttle, emergency shutdown.

---

## 13. Hypothetical Scenario: The Runaway Agentic Loop

> **Note:** This is a hypothetical scenario constructed from failure patterns widely discussed in the AI engineering community. The cost figures are illustrative estimates based on GPT-4-class pricing at time of writing. It is not attributed to a specific organization or incident.

A research assistant agent received: *"Compile a comprehensive competitive analysis of every SaaS company in the CRM space."*

The agent searched for 200+ companies, made 6 LLM calls per company, then decided to verify, compile, review, and re-research — generating **~2,750 LLM calls over 14 hours** before an engineer noticed.

| Phase            | LLM Calls (est.) | Cost (est.)  |
| ---------------- | ----------------- | ------------ |
| Initial research | ~1,200            | ~$19,200     |
| Verification     | ~600              | ~$7,200      |
| Report + review  | ~150              | ~$3,500      |
| Re-research      | ~800              | ~$12,800     |
| **Total**        | **~2,750**        | **~$43K**    |

**Root causes:** No execution budget, no time limit, unbounded task scope, self-referential refinement loops, no cost monitoring.

**Lesson:** An LLM that can decide how much work to do will always decide to do more.

---

---

# The LLM08 ↔ LLM10 Connection

These attacks interact. Compromising the knowledge layer (LLM08) can weaponize the compute layer (LLM10):

```text
Adversarial query → Massive retrieval → Huge context → Expensive inference → Cost exhaustion
Poisoned document → Retrieved repeatedly → Large context → Expensive inference → Resource exhaustion
```

```text
              LLM APPLICATION
                     │
        ┌────────────┴────────────┐
        │                         │
   Knowledge Layer          Compute Layer
   (LLM08)                 (LLM10)
        │                         │
        └────────────┬────────────┘
                     ↓
              Business Impact
```

The defenses come down to the same discipline: **never trust the LLM to enforce security** — not for access control, not for resource limits. Implement controls at the infrastructure layer. Monitor continuously. Assume adversarial input.

The most sophisticated AI application in the world still depends on boring, reliable, well-implemented access control, rate limiting, and monitoring. That's not a bug. That's the point.

---

*Published September 2025 · OWASP Top 10 for LLM Applications 2025*
