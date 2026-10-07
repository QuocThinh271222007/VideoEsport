# Cinematic Esports Trailer v4 — Production Plan

Target: 150 seconds maximum, 1920×1080, 60fps. This is a cinematic recruitment trailer, not a slide presentation.

## Editorial timeline

| Time | Beat | Picture | Voice |
|---|---|---|---|
| 00–10 | Cold open | black → arena lights → rapid gameplay inserts | "Có những khoảnh khắc..." |
| 10–34 | VALORANT | rigged agent performance + gameplay windows + impact cuts | teamwork / decision making |
| 34–58 | Free Fire | character/action montage + battle-royale gameplay | speed / survival |
| 58–82 | Liên Quân | hero action + team-fight gameplay | five positions / one objective |
| 82–108 | Team | intercut all three games; increasingly fast montage | club/community message |
| 108–132 | Climax | strongest gameplay beats + character attacks | invitation |
| 132–150 | Resolve | team lineup, brand, CTA | final line + music resolve |

## Character animation requirement

v4 must not use whole-image wobble as the primary illusion of movement. Character shots use a hierarchical 2D rig whenever separated layers exist: root → pelvis/chest → neck/head; shoulder → upper arm → forearm → hand; hip → thigh → shin → foot. Key poses include anticipation, step, arm extension, recoil/follow-through and recovery. Secondary motion is reserved for cloth/hair/effects.

If a source artwork cannot be safely segmented, it may be used as a short parallax/transition plate, never presented as a fully rigged performance.

## Gameplay integration

Gameplay is represented by local files under `public/assets/gameplay/`. The renderer must degrade gracefully when a clip is absent. Do not silently download or redistribute third-party video. `docs/gameplay-sources.json` records approved source/ownership and the intended trim window. Prefer footage captured by the club/user or publisher-provided media whose terms permit the intended use.

Expected optional files:

- `public/assets/gameplay/valorant.mp4`
- `public/assets/gameplay/free-fire.mp4`
- `public/assets/gameplay/lien-quan.mp4`

## Audio

Music remains the existing licensed Scott Buckley track unless replaced. Narration is mixed above music with automatic ducking. SFX should emphasize cuts, impacts, dashes and UI transitions, but avoid constant noise.

Narration master is `docs/narration-vi.txt`. Generated narration must not be committed if the provider license/account terms do not permit redistribution.

## Acceptance criteria

1. Runtime duration <= 150 s and no slide/card sequence as the dominant visual language.
2. At least three distinct camera grammars: wide reveal, close performance, gameplay/full-screen action.
3. Character performance visibly articulates limbs when rig assets exist.
4. Gameplay clips are integrated through a deterministic timeline and can be replaced without changing scene code.
5. Voice script and timing cues are versioned; music ducks under narration.
6. Missing gameplay/voice assets produce an explicit preview placeholder rather than a broken render.
7. `npm run check` remains the pre-render gate.