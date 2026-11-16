<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

<!-- AGENT-MEMORY:BEGIN -->
- Skin catalog lives in `src/lib/skins.ts`; real wiki images are CDN pointers `src/assets/skins/<id>.webp.asset.json` picked up by `import.meta.glob`, so a new skin needs a row plus a pointer with the same id.
- Upgrade math (chance, win check, wheel rotation) stays pure in `src/lib/upgrade.ts` with tests beside it; UI only calls it.
- Cases live in `src/lib/cases.ts` (pure roll/price math, tested); case price derives from the drop pool expected value so return stays at RETURN_RATE. Case pools filter on skin `rank` (rarity), not price, so pools stay stable when market prices change.
- Skin `value` is Robux at 1 Robux = 1 US cent (`src/lib/money.ts`), taken from StarPets USD prices; money, deposit and promo rules are pure functions with tests beside them.
- Inventory, Robux wallet and redeemed promo codes are per-browser localStorage (no backend yet); deposits credit the wallet directly until a real payment provider is connected.
<!-- AGENT-MEMORY:END -->
