// Pixel font for the screens, HUD and obstacle badges (SIL Open Font License,
// see public/fonts/tiny5). The game waits for it so nothing is drawn in a
// fallback font first; if it fails to load, the fallback is used instead
export const PIXEL_FONT = '"Tiny5", system-ui, sans-serif';

const face = new FontFace("Tiny5", "url(/fonts/tiny5/tiny5-latin.woff2)");

try {
  document.fonts.add(await face.load());
} catch {
  console.warn("Pixel font failed to load; using the fallback font");
}
