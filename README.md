# Ascend — landing site

Marketing/download page for the Ascend Android game. Features the real,
playable game embedded in a phone-frame mockup (not a screenshot — it's
the actual `StackGameEmbed` component, same physics as the app), a
download button pointed at your GitHub Release, feature highlights, and
sideload install instructions.

## Before you deploy — edit one file

Open `lib/config.ts` and fill in your details:

```ts
export const GITHUB_USERNAME = "your-username";
export const GITHUB_REPO = "ascend";
export const APK_FILENAME = "ascend.apk";
```

The download button uses GitHub's "latest release" direct-asset URL
pattern:
```
https://github.com/<user>/<repo>/releases/latest/download/<filename>
```
This always resolves to whatever asset with that exact filename is
attached to your most recent Release — so as long as you keep uploading
your APK with the same filename on each release, you never have to touch
this link again.

**Important:** the filename in `APK_FILENAME` must exactly match the
filename you upload as a release asset on GitHub (case-sensitive).

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

Same as the game itself:
```bash
npm install -g vercel
vercel
```
or import the repo at https://vercel.com/new — Next.js is auto-detected.

## Files

- `lib/config.ts` — the one file you need to edit before deploying
- `app/page.tsx` — all landing page content (hero, features, install steps)
- `components/PhoneFrame.tsx` — the device-mockup frame around the demo
- `components/StackGameEmbed.tsx` — the actual game, adapted to render inside
  a bounded container instead of the full viewport (sizes itself via
  `ResizeObserver` against its parent rather than `window`)
- `app/layout.tsx` — fonts (Big Shoulders Display + Space Mono, same as the app)

## Notes

- The embedded demo saves its own best score to the visitor's browser
  `localStorage` — separate from whatever best score they have in the
  installed Android app (different storage, different origin).
- If you rename the APK on future releases, update `APK_FILENAME` in
  `lib/config.ts` to match, then redeploy.
