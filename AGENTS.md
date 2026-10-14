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

## Rules

- FAQ/accordions use native `details`/`summary`, not the shadcn Accordion: the Accordion provider crashed the page to a blank screen at runtime in this stack.
- Business data (name, city, WhatsApp, Instagram) lives only in the constants at the top of `src/routes/index.tsx`, so it can be updated in one place.
- Catalog photo names and categories are definitive in `src/assets/photos.ts` (`nomesPorFoto` / `cats`) and must never be overridden by LocalStorage drafts — content reads merge them back from that file, and the auditoria draft key is versioned so stale browser data can't reintroduce old names. Why: the client personally reviewed and confirmed the final catalog names.
