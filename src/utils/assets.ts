// One place that turns a path inside public/ into a URL. Every image and audio
// track is served from public/ rather than imported, so nothing here is hashed
// or checked at build time: a wrong path is a 404 at runtime, on 72 images and
// 6 tracks. Eight components used to keep their own copy of BASE_URL in data();
// this is that copy, once.
const BASE = import.meta.env.BASE_URL;

export function assetUrl(path: string): string {
  return BASE + path.replace(/^\/+/, "");
}
