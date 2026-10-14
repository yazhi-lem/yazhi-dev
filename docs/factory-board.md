# Factory board (Bubbles UI): spec

A public view of the Yazhi launch plan, built with the Bubble interface.
Data comes from the Software Factory HTTP API on api.yazhi.dev.

## API contract (read-only from this site)

`GET /v1/factory/projects` returns:

```ts
type IterationStatus = "planned" | "active" | "in_review" | "done" | "blocked";
interface Iteration { number: number; start: string; end: string; goal: string;
  deliverables: string; exit_criteria: string; linear_issues: number[]; status: IterationStatus }
interface Milestone { name: string; date: string }
interface Project { id: string; name: string; launch: string; linear_project: string;
  iterations: Iteration[]; milestones: Milestone[] }
```

`GET /v1/factory/next?today=YYYY-MM-DD` returns `{project_id, project_name, launch, iteration} | null`.
`GET /v1/factory/load` returns `{capacity: number, load: {iteration, items, over}[]}`.

## UI

- **Board:** one bubble per project, in launch order.
  - Size: open iterations remaining.
  - Ring: share of iterations done.
  - Fill: status of the current iteration (planned grey, active blue,
    in_review amber, done green, blocked red).
  - Label: name + launch date.
- **"Now" bubble:** highlights the result of `/next`.
- **Detail sheet** (opens on tap): iteration timeline in 2-week columns with the goal, exit criteria
  and Linear issue numbers, plus milestones as pins.
- **Load strip:** iterations as small dots, red when `over`.
- Read-only: no write calls from the public site. Tamil and English labels, keyboard
  and screen-reader accessible. Respects reduced motion.

## Agent Factory lane

Iterations have `kind: "build" | "revenue"`. Revenue iterations get a
distinct bubble outline and sort first in the "Now" view. The public board
shows only iteration goals and status, never client names or amounts.
