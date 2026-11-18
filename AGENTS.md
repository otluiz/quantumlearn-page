<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep LexPubli styles scoped to `.lexpubli`; the existing LexLearn workspace must retain its own design tokens and data contracts.
- Render the three LexPubli concepts from one shared home and a validated optional `v` search parameter so content and interactions stay consistent.
- Home radar records are a labeled, session-only presentation of cited historical authorizations, not a live monitoring service; do not imply durable subscriptions without a connected service.
- Keep the LexLearn marketing landing under /lexlearn with its own scoped stylesheet; access pages share a presentation-only form and access-specific scoped CSS, always disclose the preview, prevent submission, and offer /app only as an explicit preview link while authentication is disconnected.
- Keep contest-oriented study fixtures separate from the document API; a session-only provider in /app shares contest and training-board selection across child routes, and contest/board changes reset practice state to prevent stale origins.
- Scope the LexLearn workspace palette to its /app wrapper and study stylesheet; use the landing's semantic palette without changing public-page styles or document data contracts.
- Keep preview question reports in the /app session provider, keyed by contest, training board, topic and origin; validate explanations before adding reports and block withdrawn questions without mutating answer keys. Question chat uses explicit cited fixtures, not the document API or uncited generated answers.
- Keep followed contests, study preferences and card review schedules in the existing preview provider; tools derive topics from the active itinerary, exports contain only session examples, and deletion clears local examples rather than implying account deletion.
