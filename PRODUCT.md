# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Single static `index.html` — no build step, no npm, no framework, no dependencies. Confirmed by the user. Deployable as-is to Vercel, Netlify, or GitHub Pages. Data lives in a sibling `routers.json` fetched at runtime.

## Users

Developers who have exhausted the quota on a paid coding assistant (Claude Code, Codex, Cline, Cursor) and are hunting for more inference credit. They arrive skeptical, usually from Reddit, Discord, HN, or a YouTube video. They already know that every link on a board like this is an affiliate link, and they already know that some of these gateways are resellers of unclear provenance. They are scanning for two things at once: how much credit, and whether the gateway can be trusted.

Secondary user: the site owner, who is the only person with access to the admin panel and who adds, edits, and removes routers as offers appear and expire.

## Product Purpose

FetchRouter is a board of AI gateways that give free credit on signup. It puts every offer's credit amount, model catalogue, login requirement, and — critically — its verification status in one comparable place, so a visitor can narrow the field before spending an OAuth grant or a real signup on a gateway that turns out to be dead, restricted, or fictional. Success is a visitor who clicks through to a gateway already knowing what they are getting and what the site could not confirm about it.

## Positioning

The board publishes its own uncertainty. Every entry carries a verification verdict — verified, unverified, or disputed — and an offer the owner could not confirm against a non-affiliate source is labeled as such and ranked accordingly, even though the site earns from the click either way. A competitor optimizing purely for click-through cannot truthfully copy that, because it requires publishing information that costs money.

## Operating Context

- Visitors mostly arrive on mobile from a link in a chat or comment thread, then re-open on desktop when they are actually ready to sign up.
- Offers are volatile: amounts change, gateways go dark, referral terms shift, models get pulled. The board is expected to be wrong eventually, so entries need a visible "last checked" and an easy path to correction.
- Every outbound link carries the owner's referral code, appended via a per-gateway query parameter whose name differs by gateway (`aff`, `ref`, `invite_code`).
- The owner maintains the board in bursts: a new offer surfaces, they add it in one sitting, publish, and do not touch it for a week.

## Capabilities and Constraints

- Catalogue of gateways, each with: name, category, description, tag chips, model list, model-type class, login requirement, verification verdict, credit value in USD (nullable — some offers are token grants or unstated), rating, featured flag, base URL, and referral-parameter name.
- Visitor-facing: search across gateway name and model, filters, sorting, and a highlighted best-current-offer.
- Admin panel: add, edit, duplicate, and delete routers through a form. Gated behind a URL fragment, not a password — it protects nothing on the server because there is no server, and the gate exists to keep the panel out of a casual visitor's way, not to secure anything.
- Admin edits persist to `localStorage` in the owner's own browser only. Publishing is a deliberate second step: export `routers.json`, commit it, redeploy. Confirmed by the user; this is why no backend exists.
- Because admin state is browser-local, the owner's unpublished draft and the live board can diverge. The interface must make that divergence visible rather than letting the owner believe they have published.
- Referral codes are the owner's to supply. The seeded catalogue ships with every referral code blank.

## Brand Commitments

- Name: **FetchRouter** (user-chosen).
- The site is an affiliate board and says so plainly rather than burying it. Disclosure is a design element, not a footer obligation.

## Evidence on Hand

- Ten real gateways, read from the Router Watch bundle on 2026-08-31: Agent Router, Bluesminds, Bai, Xiaomi Mimo, GoRouter, TaBiAi, JustDoWork, Hcnsec, KKToken, See Kai — with their credit amounts, model lists, login requirements, tags, and verification verdicts. These are third-party reported figures, not figures FetchRouter verified itself, and the board must not present them as its own verification.
- No referral codes, no traffic data, no testimonials, no press. None of these may be fabricated.
- "Last checked" dates are seeded as the date the data was read (2026-08-31) and are the owner's to maintain.

## Product Principles

1. **Publish the doubt.** An unverified amount is more useful to the visitor than a confident one, and the verdict gets the same visual weight as the dollar figure.
2. **The dollar amount is not the ranking.** A $200 offer nobody could confirm ranks below a $70 offer that works. Sorting defaults must reflect that.
3. **Cost the click honestly.** Say what a signup actually costs — a GitHub OAuth grant, an account age requirement, a coding-agent-only restriction — next to what it pays.
4. **The owner is one person in a hurry.** Adding a router must be a single form in a single sitting, and publishing must be impossible to do by accident or to forget silently.
5. **Volatility is the subject.** Offers expire; the board is a snapshot with a date on it, and it should read like one.

## Accessibility & Inclusion

No standard was specified by the user. Treat WCAG 2.2 AA as the floor: the verification verdict must be legible without relying on color alone, the board must be operable by keyboard end to end, and the catalogue must remain usable at 200% zoom and in a screen reader as a real table or list, not a grid of unlabeled cards.
