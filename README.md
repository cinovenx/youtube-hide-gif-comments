# Hide YouTube Comment GIFs

A lightweight Tampermonkey userscript that hides GIFs / image attachments in YouTube comments.

YouTube recently added GIF comments (like TikTok / Discord). If you find them annoying or distracting, this script removes them while keeping text, likes, and layout intact.

## What it hides

Native YouTube comment attachments rendered as:

```html
<ytw-comment-image-attachment-view-model>
```

including fallback images from `i.ytimg.com/c_exp/`.

It does **not** touch:
- comment text
- avatars
- small emojis (`/s/gaming/emoji/`)

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) (Chrome / Edge / Firefox / Safari).
2. Open `youtube-hide-gif-comments.user.js` in this repo and click **Raw**, or copy its contents.
3. Tampermonkey → Create a new script → paste → Save.
4. Open any YouTube video and check the comments. GIFs are gone.

Direct install (after publishing): Tampermonkey → Utilities → Install from URL → paste the raw `.user.js` URL.

## How it works

- CSS rule with `display: none !important` for instant hiding.
- `MutationObserver` + `yt-navigate-finish` listener for YouTube SPA (infinite scroll, replies, Shorts drawer, navigation without reload).
- Defensive fallback selectors by image CDN in case YouTube renames the custom element.
- No UI, no toggle, no external requests. Always on.

## Compatibility

- `https://www.youtube.com/*`
- `https://music.youtube.com/*`
- Videos, Shorts, replies.

## License

MIT — see [LICENSE](LICENSE).
