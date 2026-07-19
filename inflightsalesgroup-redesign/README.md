# Inflight Sales Group — redesign prototype

A hero-section prototype for a redesign of inflightsalesgroup.com. React + TypeScript + Vite + Tailwind CSS v4 + GSAP + lucide-react.

Concept: instead of a literal photo/video hero, the background is an animated abstract isometric seating map (`src/components/IsometricCabin.tsx`):

- Seats occasionally "light up" gold at random, as if a passenger just made a purchase.
- A trolley and a hostess drift down the aisle at irregular intervals.
- Occupied seats have a faint pulsing "phone glow," and each seat has a small seatback screen.
- Sparse gold particles drift upward across the scene as an abstraction of data moving through the air.
- The whole scene has a subtle mouse-driven parallax.

Copy in the hero (founding year, airline/continent counts) is drawn from public info about the real company; treat it as placeholder to be confirmed/refined with real content before this goes further.

## Run it

```sh
npm install
npm run dev
```

Then open the printed localhost URL. `npm run build` produces a static build in `dist/`.
