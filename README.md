# Countdown PWA

Countdown is a PWA for tracking event deadlines: add titles and target date-times, see remaining time with smart refresh (1s under 24h, 60s otherwise), and keep data in localStorage. Slate/indigo theme. Built with React, TypeScript, Vite, TailwindCSS, and DaisyUI.

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

### Google Analytics

Create a `.env` file with your GA4 Measurement ID:

```bash
VITE_GA_MEASUREMENT_ID=G-GM8TH3PZKZ
```

Google Analytics is only enabled in production builds. For GitHub Actions, add `VITE_GA_MEASUREMENT_ID` as a repository secret.

### With Docker

```bash
docker compose up -d
docker compose exec web npm start
```

## Production Build

```bash
npm run build
npm run preview
```

## Quality & Testing

- Lint: `npm run lint`
- Unit tests: `npm run test:ci`

## Features

- Multiple countdown events with create, edit, delete
- Absolute target stored as UTC ms; UI in local timezone
- States: upcoming, “C’est l’heure” window, then “depuis …” for past events
- Light/dark theme (DaisyUI + custom gradient)

---

## Contact

**Contact :** **Javid Mougamadou** — [Site web](https://javid-mougamadou.pro/) · [GitHub](https://github.com/javid-mougamadou) · [LinkedIn](https://www.linkedin.com/in/mougamadoujavid/) · [Discord](https://discord.gg/8rK6CKGb) · [Email](mailto:javid.mougamadou2@gmail.com)
