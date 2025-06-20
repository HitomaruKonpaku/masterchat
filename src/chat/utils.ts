import { Color } from "../interfaces/misc";
import { YTThumbnailList } from "../interfaces/yt/chat";

export function pickThumbUrl(thumbList: YTThumbnailList): string {
  return thumbList.thumbnails[thumbList.thumbnails.length - 1].url;
}

export function parseColorCode(code: number): Color {
  if (code > 4294967295) {
    throw new Error(`Invalid color code: ${code}`);
  }

  const b = code & 0xff;
  const g = (code >>> 8) & 0xff;
  const r = (code >>> 16) & 0xff;
  const opacity = code >>> 24;

  return { r, g, b, opacity };
}

const magnitudes = new Map([
  ["K", 1000 ** 1],
  ["M", 1000 ** 2],
  ["G", 1000 ** 3],
  ["T", 1000 ** 4],
  ["P", 1000 ** 5],
  ["E", 1000 ** 6],
] as const);

const unitRegex = /(?<value>[0-9]+(\.[0-9]*)?)(?<suffix>([KMGTPE]))?/;

export function unitsToNumber(text: string) {
  const unitsMatch = text.match(unitRegex);

  if (!unitsMatch?.groups) {
    return NaN;
  }

  const parsedValue = parseFloat(unitsMatch.groups.value);

  if (!unitsMatch.groups?.suffix) {
    return parsedValue;
  }

  const magnitude = magnitudes.get(unitsMatch.groups.suffix as never);

  if (!magnitude) {
    throw new Error("UnitRegex is wrong some how");
  }

  return parseInt((parsedValue * magnitude).toFixed(1));
}
