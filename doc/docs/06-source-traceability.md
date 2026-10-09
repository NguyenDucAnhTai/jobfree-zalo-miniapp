# Source manifest and caveats

Reference repository: https://github.com/TriTin3011/harness-jobfree (read-only; files fetched from remote default branch on 2026-10-09).

| Source path | Purpose | Caution |
|---|---|---|
| `docs/JOBFREE-PRD-CHI-TIET-VI.md` | Product scope, actors, core flows | Baseline includes sections pending QA |
| `docs/01-domain/business-rules-vi.md` | Role, verification, catalog, publish, matching, cancellation | Backend-authoritative; not frontend permission |
| `docs/02-workflows/lifecycle-state-machine-v2-vi.md` | Canonical aggregate states and transitions | Draft awaiting review; preferred over superseded files |
| `docs/06-ui/00-sketch-source.md` | Sketch manifest, counts and hash | Original binary/raster not accessible in handoff |
| `docs/06-ui/01-design-tokens.md` | Colors, type, spacing, elevation | Typography has recorded discrepancy |
| `docs/06-ui/02-employer-screen-inventory.md` | 66 Employer frames | State classifications inferred from names |
| `docs/06-ui/03-worker-screen-inventory.md` | 21 Worker frames | Missing state variants; approximation required |
| `docs/06-ui/04-prototype-flows.md` | Prototype navigation evidence | Unresolved links and unverified trigger behavior |
| `docs/06-ui/05-screen-backend-map.md` | Screen→entity/action/error mapping | Proposed capabilities ≠ deployed APIs |
| `docs/04-api/employer-api-contracts-v1-vi.md` | Employer contract reference | Do not connect production |
| `docs/04-api/worker-api-contracts-v1-vi.md` | Worker contract reference | Do not connect production |
| `coordination/decisions/PRD-0001.decisions.json` | PO decisions | Append-only in harness; do not modify |

## Known gaps
1. Sketch original `.sketch` and full-frame screenshots not included.
2. PRD/decision ledger may evolve; refresh before backend integration.
3. This pack is a curated **implementation handoff**, not a lossless export of every source document.
4. UI role switcher is ZMP-specific scope from PO and differs from Android baseline.
5. API paths/DTOs and actual backend implementation are not verified.
