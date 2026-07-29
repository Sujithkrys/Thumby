# Scope Lock — Thumby

## Must-have

- Authentication
- Design system — tokens defined once (see the validated prototype for exact values, not re-specified here)
- Gallery browse
- Image generation — prompt input, quality tier, reference via gallery thumbnail OR user-uploaded image, aspect ratio
- Categories
- Generation cost cap per user (the generation API in use has no free tier)
- Internal upload page for adding gallery content — allow-listed to the two founders, single form (image, prompt, category, title)

## Should-have

- Favourites
- Profile / generation history
- Image to prompt
- Payment/credits — deferred until 7-day return behavior is actually validated

## Non-negotiables (ship regardless of time pressure)

- Every endpoint that reads or writes a specific user's data checks both authentication and record ownership
- Upload confirmation checkbox affirming rights to the uploaded image, required before an upload-referenced generation can submit
- Reporting mechanism on generated output
- Account disable / content removal capability for the two founders
- Uploaded images stored with access scoped to the uploading user only — never publicly listable
- The generation cap is enforced server-side, not just shown in the UI
- Secrets live only in environment variables

## Won't-have

- Editing output images / stickers / manual text / handwriting
- Upscaling
- Filters
- Multi-model support beyond whichever single model is fixed for launch
- Community-submitted prompts
- Video generation
- Microservices
- Full admin dashboard (user management, analytics, moderation, bulk tooling) — replaced by the minimal internal upload page above
- Conversational intent-inference / auto-generation — future-labeled, same treatment as MCP
