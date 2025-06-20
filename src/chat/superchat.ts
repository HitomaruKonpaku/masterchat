import {
  SuperChat,
  SUPERCHAT_COLOR_MAP,
  SUPERCHAT_SIGNIFICANCE_MAP,
  SuperChatColorFields,
} from "../interfaces/misc";
import {
  YTLiveChatPaidMessageRenderer,
  YTLiveChatPaidStickerRenderer,
} from "../interfaces/yt/chat";
import { debugLog, stringify } from "../utils";
import { parseColorCode } from "./utils";

const AMOUNT_REGEXP = /[\d.,]+/;

const SYMBOL_TO_TLS_MAP: Record<string, string> = {
  $: "USD",
  "£": "GBP",
  "¥": "JPY",
  "JP¥": "JPY",
  "₩": "KRW",
  "₪": "ILS",
  "€": "EUR",
  "₱": "PHP",
  "₹": "INR",
  A$: "AUD",
  CA$: "CAD",
  HK$: "HKD",
  MX$: "MXN",
  NT$: "TWD",
  NZ$: "NZD",
  R$: "BRL",
};

export function toTLS(symbolOrTls: string): string {
  return SYMBOL_TO_TLS_MAP[symbolOrTls] ?? symbolOrTls;
}

export function parseAmountText(purchaseAmountText: string) {
  const input = stringify(purchaseAmountText);
  const amountString = AMOUNT_REGEXP.exec(input)![0].replace(/,/g, "");

  const amount = parseFloat(amountString);
  const currency = toTLS(input.replace(AMOUNT_REGEXP, "").trim());
  return { amount, currency };
}

export function parseSuperChat<
  T extends YTLiveChatPaidMessageRenderer | YTLiveChatPaidStickerRenderer
>(renderer: T): SuperChat<T> {
  const { amount, currency } = parseAmountText(
    stringify(renderer.purchaseAmountText)
  );

  const originalColor =
    "headerBackgroundColor" in renderer
      ? renderer.headerBackgroundColor.toString()
      : renderer.backgroundColor.toString();
  const color =
    SUPERCHAT_COLOR_MAP[originalColor as keyof typeof SUPERCHAT_COLOR_MAP];
  const significance = SUPERCHAT_SIGNIFICANCE_MAP[color];

  if (!color) {
    debugLog(
      "[action required] Can't find the color:",
      JSON.stringify(renderer)
    );
  }

  const colorFields = Object.fromEntries(
    Object.entries(renderer)
      .filter(([key]) => key.endsWith("Color"))
      .map(([key, value]) => [key, parseColorCode(value)])
  ) as SuperChatColorFields<T>;

  return {
    amount,
    currency,
    color,
    significance,
    ...colorFields,
  };
}
