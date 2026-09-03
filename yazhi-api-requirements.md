# Yazhi-API: Agent Requirements Document
## Multi-Lingual Indic Agent Space Backend & API System

This document outlines the technical specifications, system architecture, database design, and integration requirements for `yazhi-api`—the backend engine powering the Multi-Lingual Indic Agent Space (`chat.yazhi.dev`).

---

## 1. Vision & Architecture

The Multi-Lingual Indic Agent Space is a sovereign AI ecosystem powered by **Adhan-7B** and fine-tuned models optimized for 22+ Indic languages. To support a scalable, secure, and interactive interface, the `yazhi-api` must act as a low-latency gateway that routes requests, manages memory, injects domain context (based on the five classical *Thinai* landscapes), and coordinates real-time multi-lingual interactions.

### High-Level System Architecture

```
                       ┌─────────────────────────┐
                       │  Frontend (Next.js App) │
                       │    chat.yazhi.dev       │
                       └────────────┬────────────┘
                                    │ WebSockets / SSE / HTTPS
                                    ▼
                       ┌─────────────────────────┐
                       │       Yazhi-API         │
                       │    (FastAPI Gateway)    │
                       └──────┬───────────┬──────┘
                              │           │
           ┌──────────────────┘           └──────────────────┐
           ▼                                                 ▼
┌─────────────────────┐                            ┌─────────────────────┐
│  Agent Coordinator  │                            │    Memory Engine    │
│  (LangGraph / Llama)│                            │ (Postgres/pgvector) │
└──────────┬──────────┘                            └──────────┬──────────┘
           │                                                  │
           ├─────────────────────────┬────────────────────────┤
           ▼                         ▼                        ▼
┌─────────────────────┐   ┌─────────────────────┐  ┌─────────────────────┐
│    Adhan LLM v1     │   │   External Tools    │  │  Localization / NLU │
│ (7B Sovereign Host) │   │ (Agriculture/APIs)  │  │ (Transliteration/MT)│
└─────────────────────┘   └─────────────────────┘  └─────────────────────┘
```

---

## 2. Core Capabilities & Domain Contexts (Thinai Spaces)

`yazhi-api` must support domain-specific routing based on the **Five Thinai Landscapes** of classical Tamil literature, which maps beautifully onto real-world modern domains:

### 1. Marutham (Agriculture & Farming)
*   **Aesthetic Theme:** Paddy Field Green (`#b7a03c` / `#4f9d6b`)
*   **System Prompt Context:** Injects agricultural domain knowledge, native soil patterns, seasonal crop cycles, and historical rain patterns from classical literature combined with modern precision farming.
*   **Integrated Tools:** Weather API, Soil-moisture database, APMC price tickers.

### 2. Kurinji (Heritage, Poetry & Language)
*   **Aesthetic Theme:** Mountain Violet (`#8b7ae0`)
*   **System Prompt Context:** Injects classical Sangam literature, etymological roots, ancient grammar (Tolkappiyam), and multi-lingual transliteration.
*   **Integrated Tools:** Tamil/Sanskrit dictionary lookup, poem metrics analyzer.

### 3. Neytal (Marine Trade, Logistics & Enterprise)
*   **Aesthetic Theme:** Ocean Blue (`#4a8ab5`)
*   **System Prompt Context:** Injects maritime logistics, coastal economy, export-import laws, supply chain metrics, and port history (e.g., Poompuhar).
*   **Integrated Tools:** Sea routes API, cargo tracking simulator, export tariff database.

### 4. Mullai (Ecology, Forestry & Conservation)
*   **Aesthetic Theme:** Forest Green (`#4f9d6b`)
*   **System Prompt Context:** Focuses on biodiversity, native flora/fauna conservation, climate change mitigation, and forest medicine.
*   **Integrated Tools:** Wildlife database, deforestation alerts, native plant catalog.

### 5. Palai (Resilience, Strategy & Risk Management)
*   **Aesthetic Theme:** Desert Ochre/Red (`#c25b3c`)
*   **System Prompt Context:** Handles crisis management, personal/business resilience, survival guidelines, migration logistics, and strategic counseling.
*   **Integrated Tools:** Risk calculation, disaster relief feeds, psychological resilience bots.

---

## 3. API Endpoints Specification (REST)

All API responses must follow the strict JSON structure. Error handling must return standard RFC 7807 problem details in the requested language when possible.

### 3.1. List Available Agents
*   **Endpoint:** `GET /api/v1/agents`
*   **Response:**
```json
{
  "agents": [
    {
      "id": "marutham_agri",
      "name_ta": "மருதம் வேளாண் முகவர்",
      "name_en": "Marutham Agricultural Advisor",
      "domain": "agriculture",
      "languages": ["ta", "en", "hi", "te", "kn", "ml"],
      "description": "Fusing classical agricultural heritage with modern precision farming.",
      "avatar": "/avatars/aasi_1.png",
      "color": "#b7a03c"
    }
  ]
}
```

### 3.2. Initialize Chat Session
*   **Endpoint:** `POST /api/v1/chats`
*   **Request:**
```json
{
  "agent_id": "marutham_agri",
  "language": "ta",
  "user_id": "usr_901248"
}
```
*   **Response:**
```json
{
  "session_id": "sess_8941294812",
  "agent_id": "marutham_agri",
  "language": "ta",
  "created_at": "2026-08-04T13:38:30Z",
  "welcome_message": "வணக்கம்! மருதம் வேளாண் முகவர் உங்களை வரவேற்கிறது. மண்ணின் வளம் காப்போம்!"
}
```

### 3.3. Send Message (Unary fallback)
*   **Endpoint:** `POST /api/v1/chats/{session_id}/messages`
*   **Request:**
```json
{
  "message": "மழை குறைவாக பெய்தால் எந்த பயிர் நடலாம்?",
  "stream": false
}
```
*   **Response:**
```json
{
  "message_id": "msg_90124",
  "role": "agent",
  "content": "மழை குறைவாக பெய்யும் காலங்களில், குறைந்த நீர் தேவைப்படும் தானியங்களான கம்பு அல்லது சோளம் போன்ற பயிர்களை நடுவது சிறந்தது.",
  "timestamp": "2026-08-04T13:38:40Z",
  "tools_used": []
}
```

---

## 4. Real-time Streaming Protocol (WebSocket / SSE)

For rich interactive agent experiences, typing indicators, tool execution updates, and tokens must stream in real-time.

*   **URL:** `ws://api.chat.yazhi.dev/v1/chats/{session_id}/ws`
*   **Handshake Query Params:** `token=JWT_STRING`

### 4.1. Client Message Frame
```json
{
  "event": "user_message",
  "data": {
    "text": "What are the soil requirements for Marutham land?"
  }
}
```

### 4.2. Server Response Frames

**1. Typing / Thinking Token Stream:**
```json
{
  "event": "token",
  "data": {
    "text": "Marutham"
  }
}
```

**2. Tool Execution Update:**
```json
{
  "event": "tool_start",
  "data": {
    "tool_name": "soil_database_lookup",
    "parameters": { "soil_type": "alluvial" }
  }
}
```

**3. Stream Complete:**
```json
{
  "event": "complete",
  "data": {
    "message_id": "msg_92149",
    "full_text": "Marutham land is characterized by fertile alluvial soil..."
  }
}
```

---

## 5. Persistent Memory System (Akam & Puram context)

To make agent interactions highly custom, we utilize a dual-memory model:
1.  **Akam (Inner / Private Memory):** Short-term context, personal user tone, emotional sentiment, and immediate interaction state. Persisted in Redis with an expiry of 2 hours.
2.  **Puram (Outer / Public Memory):** Long-term historical facts, user's previous farm queries, geological coordinates, past exports, and factual knowledge. Persisted using vector embeddings in PostgreSQL + `pgvector`.

### Database Schema Draft (SQL)

```sql
-- Chat Sessions Table
CREATE TABLE sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    agent_id VARCHAR(64) NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(64) REFERENCES sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    token_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Puram Vector Memory Table (For RAG)
CREATE TABLE user_long_term_memories (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    memory_text TEXT NOT NULL,
    domain_tag VARCHAR(30), -- 'agriculture', 'poetry', etc.
    embedding VECTOR(1536),  -- adhan-embed-v1 dimensions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ON user_long_term_memories USING hnsw (embedding vector_cosine_ops);
```

---

## 6. Multi-Lingual & Script Localization Engine

Since we serve 22+ Indic scripts with Adhan-7B, `yazhi-api` must incorporate:
1.  **Automatic Script Detection:** Inspects incoming Unicode blocks to determine the active input script and matches it with the session language.
2.  **Dynamic Script Transliteration:** For users who type Hindi in Tamil script (or Tamil in Latin characters - Tanglish), the api should auto-resolve or provide phonetic transliteration when queries hit domain databases.
3.  **Unified Encoding Standard:** Strict UTF-8 compliance across database and inference drivers to prevent Tamil vowel sign truncation (`kombu`, loop elements, etc.).

---

## 7. Performance & Inference SLAs

*   **First Token Latency (TTFT):** `< 350ms` (over WebSocket/SSE).
*   **Generation Throughput:** `> 35 tokens/second`.
*   **Maximum Context Window:** `8192` tokens.
*   **WebSocket Keep-Alive:** `30` seconds ping interval.
