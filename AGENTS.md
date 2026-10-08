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

## Application architecture
- Keep the fishing experience at the index route with a dedicated browser-only state hook; this isolates simulated gameplay from presentation and future integration.
- Use generated lake and mascot assets as separate image layers; this preserves character identity while allowing independent scene animation.
- Keep all theme colors and scene styling in the global semantic token system; this keeps casino controls and game states visually consistent.
- Demo outcomes follow an explicit scripted sequence with preview modes and a reaction-window timeout; this keeps the requested tension separate from any future real-money game logic.
