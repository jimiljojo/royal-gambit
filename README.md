# Royal Gambit

A 3D chess game for two people sharing one device, built with React, Three.js, and chess.js.

**[Play the live demo](https://royal-gambit.jimiljojo.workers.dev/)**

## Run locally

Install Node.js 20 or later, then run:

```sh
npm ci --legacy-peer-deps
npm run dev
```

Open the local URL printed by Vite. The demo needs a WebGL-capable browser. To create a static production build, run `npm run build`; the output is in `dist/`.

## Features

- Two-player local chess with legal move highlighting and promotion
- Move history, captured pieces, undo, board flip, and new game
- Chess rules reference

Games stay in the current browser session. The public demo does not include online play, an AI opponent, or the AI coach. This version does not require a database, an API key, or a Lovable subscription.

The live demo is deployed as a static asset upload to Cloudflare. Changes to this repository do not automatically update the live site.

## License

MIT. See [LICENSE](LICENSE).
