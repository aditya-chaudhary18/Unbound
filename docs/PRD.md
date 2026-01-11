# Product Requirements Document: Unbound

| Field | Value |
|-------|-------|
| **Project Name** | Unbound |
| **Version** | 1.0 (MVP) |
| **Status** | In Development |
| **Last Updated** | January 2026 |

---

## 1. Executive Summary

Unbound is an interactive documentation platform that transforms static PDF textbooks into dynamic, web-based learning experiences. By combining structural extraction (Docling) with a context-aware AI tutor (RAG), Unbound bridges the gap between passive reading and active learning.

### 1.1 Problem Statement

**Static Consumption**: PDFs are rigid. Learners cannot easily navigate deep hierarchies or ask questions about specific concepts without context switching.

**Lack of Feedback**: Self-studying from a book lacks a feedback loop (quizzes, clarification).

**Navigation Issues**: Scrolling through 500+ page PDFs to find specific "sub-chapters" is inefficient.

### 1.2 Solution

A platform where users upload a PDF, and the system:

- **Extracts Structure**: Converts the PDF into a website with a proper sidebar (Table of Contents)
- **Embeds Intelligence**: Attaches a local memory Chat Agent to the content
- **Active Learning**: Offers modes like "Socratic Tutor" and auto-generated quizzes

---

## 2. User Personas

### The Self-Learner (Primary)
A university student or developer trying to master a complex topic (e.g., "Operating Systems" or "React Documentation"). They want to learn faster and test their understanding.

### The Educator
A teacher who wants to convert their course notes/PDFs into an interactive website for students.

---

## 3. Functional Requirements

### 3.1 Core Features (MVP)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| **F-01** | PDF Ingestion | User can upload a PDF. System parses it using Docling to extract text, headers, and reading order. | P0 |
| **F-02** | Structure Mapping | System generates a JSON tree (Chapters > Sub-chapters) for the Left Sidebar navigation. | P0 |
| **F-03** | Web Reader UI | A clean, responsive UI that renders the book content in Markdown/HTML. | P0 |
| **F-04** | RAG Chat Agent | A Right Sidebar chat interface that can answer questions based only on the book's content. | P0 |
| **F-05** | Teaching Modes | User can toggle AI personas: "Beginner" (Simple analogies), "Socratic" (Asks questions back), "Advanced" (Technical depth). | P1 |
| **F-06** | Quiz Generation | "Generate Quiz" button creates 5 MCQs based on the currently viewed chapter. | P1 |

### 3.2 User System

**Auth**: Email/Password or Social Login (via Clerk or NextAuth).

**Library**: Dashboard showing all uploaded books and their processing status.

**Persistence**: Chat history is saved per book.

---

## 4. Technical Architecture

### 4.1 High-Level Flow

1. **Client**: Uploads PDF to Node.js Backend
2. **Node.js**: Saves file to S3/Storage → Adds job to Queue → Returns "Processing" status
3. **Python Worker**: Picks up job → Runs Docling → Extracts Markdown & Hierarchy → Generates Embeddings → Updates DB
4. **Client**: Polls status → Receives "Ready" → Renders Book

### 4.2 Tech Stack

**Frontend**: Next.js (App Router), Tailwind CSS, Lucide React (Icons)

**Backend (Orchestration)**: Node.js (Express), Prisma (ORM)

**Backend (AI/Data)**: Python (FastAPI), Docling (PDF Parsing), LangChain (RAG logic)

**Database**: PostgreSQL (User data/Book metadata), Qdrant/Chroma (Vector embeddings)

**Storage**: AWS S3 (or MinIO/UploadThing) for storing raw PDFs and parsed images

---

## 5. UI/UX Guidelines

### 5.1 The "Reader" Layout

#### Left Sidebar (Navigation)
- Collapsible tree structure
- Active state highlighting (shows which chapter you are reading)

#### Center (Content)
- Typography optimized for long-form reading (Serif fonts, comfortable line-height)
- Images extracted from PDF rendered inline

#### Right Sidebar (Tutor)
- Fixed position (always visible)
- Chat interface looks like a messaging app (bubbles)
- "Mode Toggle" dropdown at the top

### 5.2 Interactions

**Highlight to Ask**: (Future Feature) User highlights text → Pop-up "Explain this" button

**Quiz Mode**: Overlays a modal or splits the screen to show questions

---

## 6. Non-Functional Requirements

**Performance**: PDF Parsing must ideally complete within 2-5 minutes for an average 300-page book.

**Accuracy**: The Table of Contents extracted must match the visual hierarchy of the PDF >90% of the time.

**Cost Efficiency**: Use local embeddings (HuggingFace) or cheap models (GPT-4o-mini) to keep per-book costs low.

---

## 7. Roadmap

### Phase 1: The "Reader" (Weeks 1-2)
- Setup Monorepo
- Implement Docling pipeline
- Build basic "View Book" page with hardcoded data to test UI

### Phase 2: The "Brain" (Weeks 3-4)
- Implement Vector DB ingestion
- Connect Python FastAPI to Node.js
- Build the RAG pipeline

### Phase 3: Polish & Public (Weeks 5-6)
- Add Auth
- Implement "Socratic Mode" prompting
- Deploy to Vercel/Railway

---

## 8. Success Metrics

### Product Metrics
- **Upload Success Rate**: >95% of PDFs process without errors
- **Chat Engagement**: Average 10+ messages per session
- **Quiz Completion**: >60% of generated quizzes are completed
- **Time on Platform**: Average 20+ minutes per session

### Technical Metrics
- **Processing Time**: <3 minutes for 300-page book
- **RAG Accuracy**: >85% of responses cite correct context
- **Uptime**: 99.5% availability

### Business Metrics
- **User Retention**: >40% Week-1 retention
- **Conversion Rate**: 10% free → paid within 30 days
- **NPS Score**: >50

---

## 9. Future Enhancements (Post-MVP)

### Phase 4: Collaboration Features
- **Shared Annotations**: Users can highlight and share notes
- **Study Groups**: Multiple users can chat together about the same book
- **Teacher Dashboard**: Analytics on student engagement

### Phase 5: Advanced AI Features
- **Adaptive Learning**: AI adjusts difficulty based on quiz performance
- **Voice Mode**: Ask questions via voice input
- **Multi-modal Support**: Videos, audio files embedded in docs

### Phase 6: Platform Expansion
- **Mobile Apps**: Native iOS/Android apps
- **Browser Extension**: Convert any online PDF instantly
- **API Access**: Allow developers to integrate Unbound into their platforms
- **White-label Solution**: Custom branding for institutions

---

## 10. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Poor PDF parsing accuracy | High | Medium | Use Docling + fallback to LlamaParse; implement manual correction tool |
| High AI costs at scale | High | Medium | Implement smart caching, use cheaper models for simple queries |
| Slow processing times | Medium | Medium | Add job queue with priority, show accurate progress estimates |
| Copyright concerns | High | Low | Clear ToS about user-owned content, implement takedown system |
| Lack of user adoption | High | Medium | Focus on niche (CS textbooks), build in public, influencer partnerships |

---

## Appendix A: Competitor Analysis

| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|------------|---------------|
| **ChatGPT + PDF** | General purpose, widely known | No structure preservation, limited context | Preserved book structure, chapter-aware context |
| **Notion AI** | Great for note-taking | Not optimized for books | Purpose-built for learning from textbooks |
| **GitBook** | Excellent docs platform | Requires manual creation | Automatic conversion from PDF |
| **Coursera** | Structured courses | Expensive, not self-directed | Cheaper, use your own materials |

---

## Appendix B: Open Questions

1. Should we support formats beyond PDF (EPUB, MOBI)?
2. How do we handle books with heavy mathematical notation?
3. Should the free tier allow public books that we can index for SEO?
4. What's our content moderation policy for uploaded books?
5. Do we need OCR for scanned PDFs, or only digital-native PDFs?

---
