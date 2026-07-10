# AGENTS.md

## Project Context

This repository is a UI prototype for the 統一生機 official website adjustment project.

The prototype is used to clarify:

- Page structure
- User-facing flows
- Required fields
- UI states
- Mock data presentation
- Future Vuetify implementation scope

It is not the final production implementation.

## Core Working Principle

Do not fill the visible UI with engineering reminders.

User-facing screens should feel like a real website prototype. Avoid showing terms such as:

- API
- backend
- mock
- OAuth
- integration pending
- formal flow needs support
- engineering note

If technical limitations, API needs, mock data assumptions, or backend requirements need to be recorded, place them in documentation or tickets, not in the visible UI.

## Technology Context

Current prototype:

- Vue 2
- TypeScript
- Tailwind CSS
- Vuex

Target formal project direction:

- Vue 2
- Vuetify

When creating or adjusting UI in this prototype, use the existing Tailwind patterns. When writing planning documents, include Vuetify mapping suggestions where useful.

## Work Rhythm

Use an alternating workflow:

1. Functional Ticket
2. Design Pass
3. Functional Ticket
4. Design Pass

Functional tickets define what appears on the page:

- Fields
- Routes
- Components
- Empty states
- User actions
- Mock data structure
- Acceptance criteria

Design passes define how repeated UI patterns stay consistent:

- Color usage
- Typography hierarchy
- Card structure
- Button hierarchy
- Form density
- Empty state style
- Mobile behavior
- Vuetify component mapping

## Current Phase Strategy

Completed or in progress:

- Phase 1: PDF content entry points
- Phase 4: Member center information architecture
- Phase 5: Product price presentation

Important separation:

- Membership, discounts, checkout, product prices, PDF content, inspection reports, and member center should be split into phased tickets.
- Do not mix discount calculation, checkout logic, and UI display unless the ticket explicitly asks for it.
- For price presentation tickets, adjust UI display only. Do not change checkout totals or discount calculations unless explicitly requested.

## UI Prototype Rules

For visible UI:

- Use polished user-facing language.
- Prefer real customer-facing labels over internal status notes.
- Use empty states that sound like website content, not project placeholders.
- Keep actions clickable in prototype when useful for design review.
- Use mock interactions for UI state changes when appropriate.
- Avoid explaining what is not implemented inside the page.

For documentation:

- It is acceptable to mention API needs, backend dependencies, mock data, and future Vuetify mapping.
- Keep implementation limitations in docs, not screens.
- Record acceptance criteria clearly per ticket.

## Design Consistency Rules

Before adding new UI patterns, check existing patterns first:

- Account summary cards
- Product cards
- PDF cards
- Empty states
- Form fields
- Mobile account navigation
- Price display blocks

Prefer extending an existing pattern over creating a new style.

Use the current brand token classes where possible:

- `brand-primary`
- `brand-dark`
- `brand-bg`
- `brand-surface`
- `brand-accent`

Do not introduce a new dominant color palette without a design-token update.

## Vuetify Mapping Guidance

The prototype uses Tailwind, but final implementation is expected to use Vuetify.

When documenting future implementation, map prototype patterns to Vuetify components such as:

- `v-container`
- `v-row`
- `v-col`
- `v-card`
- `v-btn`
- `v-chip`
- `v-tabs`
- `v-dialog`
- `v-text-field`
- `v-select`
- `v-checkbox`
- `v-data-table`

Do not rewrite the prototype into Vuetify unless the task explicitly asks for it.

## Verification

After code changes, run:

```bash
npm run build
```

Known build warnings about large existing image assets may remain. They are not necessarily related to UI-flow changes.

## Documentation Files

Important project planning documents live in `docs/`, including:

- Phase 1 PDF tickets and acceptance criteria
- Phase 4 member center planning
- Phase 5 product price presentation planning

Update the relevant document when completing a new ticket or design pass.
