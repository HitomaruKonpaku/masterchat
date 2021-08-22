import {
  YTChatErrorStatus,
  YTRun,
  YTLiveChatPaidStickerRenderer,
  YTLiveChatMembershipItemRenderer,
  YTLiveChatPlaceholderItemRenderer,
  YTReplaceChatItemAction,
  YTLiveChatTickerPaidMessageItemRenderer,
  YTLiveChatTickerPaidStickerItemRenderer,
  YTLiveChatTickerSponsorItemRenderer,
  YTLiveChatBannerRenderer,
  YTRemoveBannerForLiveChatCommand,
  YTTooltipRenderer,
  YTLiveChatViewerEngagementMessageRenderer,
  YTLiveChatActionPanelRenderer,
  YTCloseLiveChatActionPanelAction,
  YTLiveChatPollRenderer,
} from "../../types/chat";

export const SUPERCHAT_SIGNIFICANCE_MAP = {
  blue: 1,
  lightblue: 2,
  green: 3,
  yellow: 4,
  orange: 5,
  magenta: 6,
  red: 7,
} as const;

/**
 * Map from headerBackgroundColor to color name
 */
export const SUPERCHAT_COLOR_MAP = {
  "4279592384": "blue",
  "4278237396": "lightblue",
  "4278239141": "green",
  "4294947584": "yellow",
  "4293284096": "orange",
  "4290910299": "magenta",
  "4291821568": "red",
} as const;

/**
 * Errors
 */

export interface YTLiveError {
  message: string;
  status: FetchChatErrorStatus | YTChatErrorStatus;
}

export enum FetchChatErrorStatus {
  LiveChatDisabled = "LIVE_CHAT_DISABLED",
  Unavailable = "UNAVAILABLE",
}

/**
 * Components
 */

export type OmitTrackingParams<T> = Omit<
  T,
  "clickTrackingParams" | "trackingParams"
>;

export interface Membership {
  status: string;
  since?: string;
  thumbnail: string;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  opacity: number;
}

export type SuperChatSignificance =
  typeof SUPERCHAT_SIGNIFICANCE_MAP[keyof typeof SUPERCHAT_SIGNIFICANCE_MAP];

export type SuperChatColor =
  typeof SUPERCHAT_COLOR_MAP[keyof typeof SUPERCHAT_COLOR_MAP];

export interface SuperChat {
  amount: number;
  currency: string;
  color: SuperChatColor;
  significance: SuperChatSignificance;
  headerBackgroundColor: Color;
  headerTextColor: Color;
  bodyBackgroundColor: Color;
  bodyTextColor: Color;
}

/**
 * Continuation
 */

export interface ReloadContinuation {
  token: string;
}

export type ReloadContinuationItems = {
  top: ReloadContinuation;
  all: ReloadContinuation;
};

export interface TimedContinuation extends ReloadContinuation {
  timeoutMs: number;
}

/**
 * Actions
 */

export type Action =
  | AddChatItemAction
  | AddSuperChatItemAction
  | AddSuperStickerItemAction
  | AddMembershipItemAction
  | AddPlaceholderItemAction
  | ReplaceChatItemAction
  | MarkChatItemAsDeletedAction
  | MarkChatItemsByAuthorAsDeletedAction
  | AddSuperChatTickerAction
  | AddSuperStickerTickerAction
  | AddMembershipTickerAction
  | AddBannerAction
  | RemoveBannerAction
  | AddViewerEngagementMessageAction
  | ShowTooltipAction
  | ShowLiveChatActionPanelAction
  | CloseLiveChatActionPanelAction
  | UpdateLiveChatPollAction
  | ModeChangeAction;

export interface AddChatItemAction {
  type: "addChatItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  rawMessage: YTRun[];
  authorName: string;
  authorChannelId: string;
  authorPhoto: string;
  membership?: Membership;
  isOwner: boolean;
  isModerator: boolean;
  isVerified: boolean;
  contextMenuEndpointParams: string;
}

export interface AddSuperChatItemAction {
  type: "addSuperChatItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  rawMessage: YTRun[] | undefined;
  authorName: string;
  authorChannelId: string;
  authorPhoto: string;
  superchat: SuperChat;
}

export interface AddSuperStickerItemAction
  extends YTLiveChatPaidStickerRenderer {
  type: "addSuperStickerItemAction";
}

export interface AddMembershipItemAction
  extends YTLiveChatMembershipItemRenderer {
  type: "addMembershipItemAction";
}

export interface AddPlaceholderItemAction
  extends YTLiveChatPlaceholderItemRenderer {
  type: "addPlaceholderItemAction";
}

export interface ReplaceChatItemAction extends YTReplaceChatItemAction {
  type: "replaceChatItemAction";
}

export interface MarkChatItemAsDeletedAction {
  type: "markChatItemAsDeletedAction";
  retracted: boolean;
  targetId: string;
  timestamp: Date;
}

export interface MarkChatItemsByAuthorAsDeletedAction {
  type: "markChatItemsByAuthorAsDeletedAction";
  channelId: string;
  timestamp: Date;
}

export interface AddSuperChatTickerAction
  extends OmitTrackingParams<YTLiveChatTickerPaidMessageItemRenderer> {
  type: "addSuperChatTickerAction";
}

export interface AddSuperStickerTickerAction
  extends OmitTrackingParams<YTLiveChatTickerPaidStickerItemRenderer> {
  type: "addSuperStickerTickerAction";
}

export interface AddMembershipTickerAction
  extends OmitTrackingParams<YTLiveChatTickerSponsorItemRenderer> {
  type: "addMembershipTickerAction";
}

export interface AddBannerAction extends YTLiveChatBannerRenderer {
  type: "addBannerAction";
}

export interface RemoveBannerAction extends YTRemoveBannerForLiveChatCommand {
  type: "removeBannerAction";
}

export interface ShowTooltipAction extends YTTooltipRenderer {
  type: "showTooltipAction";
}

export interface AddViewerEngagementMessageAction
  extends YTLiveChatViewerEngagementMessageRenderer {
  type: "addViewerEngagementMessageAction";
}

export interface ShowLiveChatActionPanelAction
  extends YTLiveChatActionPanelRenderer {
  type: "showLiveChatActionPanelAction";
}

export interface CloseLiveChatActionPanelAction
  extends YTCloseLiveChatActionPanelAction {
  type: "closeLiveChatActionPanelAction";
}

export interface UpdateLiveChatPollAction extends YTLiveChatPollRenderer {
  type: "updateLiveChatPollAction";
}

export enum LiveChatMode {
  MembersOnly = "MEMBERS_ONLY",
  Slow = "SLOW",
  SubscribersOnly = "SUBSCRIBERS_ONLY",
  Unknown = "UNKNOWN",
}

export interface ModeChangeAction {
  type: "modeChangeAction";
  mode: LiveChatMode;
  enabled: boolean;
  description: string;
}

export interface UnknownAction {
  type: "unknown";
  payload: unknown;
}

/**
 * Response
 */

export interface SucceededChatResponse {
  actions: Action[];
  continuation: TimedContinuation | undefined;
  error: null;
}

export interface FailedChatResponse {
  error: YTLiveError;
}
