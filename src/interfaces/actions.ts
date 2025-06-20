import { Badges, SuperChat, Color } from "./misc";
import {
  YTLiveChatPaidMessageRenderer,
  YTLiveChatPaidStickerRenderer,
  YTText,
  YTSimpleTextContainer,
  YTLiveChatPollType,
  YTLiveChatPollChoice,
  YTRun,
} from "./yt/chat";

/**
 * Actions
 */

export type Action =
  | AddChatItemAction
  | AddSuperChatItemAction
  | AddSuperStickerItemAction
  | AddMembershipItemAction
  | AddMembershipMilestoneItemAction
  | AddPlaceholderItemAction
  | ReplaceChatItemAction
  | MarkChatItemAsDeletedAction
  | MarkChatItemsByAuthorAsDeletedAction
  | AddSuperChatTickerAction
  | AddSuperStickerTickerAction
  | AddMembershipTickerAction
  | AddBannerAction
  | RemoveBannerAction
  | AddRedirectBannerAction
  | AddIncomingRaidBannerAction
  | AddOutgoingRaidBannerAction
  | AddProductBannerAction
  | AddCallForQuestionsBannerAction
  | AddChatSummaryBannerAction
  | AddViewerEngagementMessageAction
  | ShowPanelAction
  | ShowPollPanelAction
  | ClosePanelAction
  | UpdatePollAction
  | AddPollResultAction
  | ShowTooltipAction
  | ModeChangeAction
  | MembershipGiftPurchaseAction
  | MembershipGiftRedemptionAction
  | ModerationMessageAction
  | RemoveChatItemAction
  | RemoveChatItemByAuthorAction
  | UnknownAction
  | ErrorAction;

export interface AddChatItemAction extends Badges {
  type: "addChatItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  /**
   * message can somehow be a blank (in quite rare occasion though).
   * We've observed `message: {}` three or four times.
   * In most cases just `action.message!` would works.
   */
  message?: YTRun[];
  /** rare but can be undefined */
  authorName?: string;
  authorChannelId: string;
  authorPhoto: string;
  contextMenuEndpointParams: string;

  /** @deprecated use `message` */
  rawMessage?: YTRun[];
}

export interface AddSuperChatItemAction
  extends SuperChat<YTLiveChatPaidMessageRenderer>,
    Badges {
  type: "addSuperChatItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  /** rare but can be undefined */
  authorName?: string;
  authorChannelId: string;
  authorPhoto: string;
  message: YTRun[] | null;

  /** @deprecated use `message` */
  rawMessage: YTRun[] | undefined;

  /** @deprecated flattened */
  superchat: SuperChat<YTLiveChatPaidMessageRenderer>;
}

export interface AddSuperStickerItemAction
  extends SuperChat<YTLiveChatPaidStickerRenderer>,
    Badges {
  type: "addSuperStickerItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  authorName: string;
  authorChannelId: string;
  authorPhoto: string;
  stickerUrl: string;
  stickerText: string;
  stickerDisplayWidth: number;
  stickerDisplayHeight: number;
}

export interface AddMembershipItemAction extends Badges {
  type: "addMembershipItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;

  // `level` is only shown when there's multiple levels available
  level?: string;

  /** rare but can be undefined */
  authorName?: string;
  authorChannelId: string;
  authorPhoto: string;
}

export interface AddMembershipMilestoneItemAction extends Badges {
  type: "addMembershipMilestoneItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;

  /** `level` is only shown when there's multiple levels available */
  level?: string;

  authorName?: string;
  authorChannelId: string;
  authorPhoto: string;

  /**
   * Membership duration in seconds
   */
  duration: number;

  /**
   * Human readable membership duration
   */
  durationText: string;

  /**
   * Milestone message
   */
  message: YTRun[] | null;
}

export interface AddPlaceholderItemAction {
  type: "addPlaceholderItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
}

export interface ReplaceChatItemAction {
  type: "replaceChatItemAction";
  targetItemId: string;
  replacementItem:
    | AddChatItemAction
    | AddPlaceholderItemAction
    | AddSuperChatItemAction;
}

export interface MarkChatItemAsDeletedAction {
  type: "markChatItemAsDeletedAction";
  retracted: boolean;
  targetId: string;
  executor?: string;
  timestamp: Date;
}

export interface MarkChatItemsByAuthorAsDeletedAction {
  type: "markChatItemsByAuthorAsDeletedAction";
  channelId: string;
  timestamp: Date;
}

export interface AddSuperChatTickerAction {
  type: "addSuperChatTickerAction";
  id: string;
  authorChannelId: string;
  authorPhoto: string;
  amountText: string;
  durationSec: number;
  fullDurationSec: number;
  contents: AddSuperChatItemAction;
  amountTextColor: Color;
  startBackgroundColor: Color;
  endBackgroundColor: Color;
}

export interface AddSuperStickerTickerAction {
  type: "addSuperStickerTickerAction";
  id: string;
  authorName: string;
  authorChannelId: string;
  authorPhoto: string;
  durationSec: number;
  fullDurationSec: number;
  tickerPackName: string;
  tickerPackThumbnail: string;
  contents: AddSuperStickerItemAction;
  startBackgroundColor: Color;
  endBackgroundColor: Color;
}

export interface AddMembershipTickerAction {
  type: "addMembershipTickerAction";
  id: string;
  authorChannelId: string;
  authorPhoto: string;
  durationSec: number;
  fullDurationSec: number;
  detailText: YTText;
  // TODO: check if AddMembershipMilestoneItemAction is actually appeared
  // TODO: wrap normal actions with TickerContent type
  contents:
    | AddMembershipItemAction
    | AddMembershipMilestoneItemAction
    | MembershipGiftPurchaseTickerContent;
  detailTextColor: Color;
  startBackgroundColor: Color;
  endBackgroundColor: Color;
}

export interface AddBannerAction extends Badges {
  type: "addBannerAction";
  actionId: string;
  targetId: string;
  id: string;
  title: YTRun[];
  message: YTRun[];
  timestamp: Date;
  timestampUsec: string;
  authorName: string;
  authorChannelId: string;
  authorPhoto: string;
  viewerIsCreator: boolean;
  contextMenuEndpointParams?: string;
}

export interface RemoveBannerAction {
  type: "removeBannerAction";
  targetActionId: string;
}

export interface AddRedirectBannerAction {
  type: "addRedirectBannerAction";
  actionId: string;
  targetId: string;
  authorName: string;
  authorPhoto: string;
}

export interface AddIncomingRaidBannerAction {
  type: "addIncomingRaidBannerAction";
  actionId: string;
  targetId: string;
  sourceName: string;
  sourcePhoto: string;
}

export interface AddOutgoingRaidBannerAction {
  type: "addOutgoingRaidBannerAction";
  actionId: string;
  targetId: string;
  targetName: string;
  targetPhoto: string;
  targetVideoId: string;
}

export interface AddProductBannerAction {
  type: "addProductBannerAction";
  actionId: string;
  targetId: string;
  viewerIsCreator: boolean;
  isStackable?: boolean;
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  vendorName: string;
  creatorMessage: string;
  creatorName: string;
  authorPhoto: string;
  url: string;
  dialogMessage: YTSimpleTextContainer[];
  isVerified: boolean;
}

export interface AddCallForQuestionsBannerAction {
  type: "addCallForQuestionsBannerAction";
  actionId: string;
  targetId: string;
  isStackable?: boolean;
  bannerType?: string;
  creatorAvatar: string;
  creatorAuthorName: string;
  questionMessage: YTRun[];
}

export interface AddChatSummaryBannerAction {
  type: "addChatSummaryBannerAction";
  id: string;
  actionId: string;
  targetId: string;
  isStackable?: boolean;
  bannerType?: string;
  timestamp: Date;
  timestampUsec: string;
  chatSummary: YTRun[];
}

export interface ShowTooltipAction {
  type: "showTooltipAction";
  targetId: string;
  detailsText: YTText;
  suggestedPosition: string;
  dismissStrategy: string;
  promoConfig: any;
  dwellTimeMs?: number;
}

export interface AddViewerEngagementMessageAction {
  type: "addViewerEngagementMessageAction";
  id: string;
  message: YTText;
  actionUrl?: string;
  timestamp: Date;
  timestampUsec: string;
}

// generic action for unknown panel type
export interface ShowPanelAction {
  type: "showPanelAction";
  panelToShow: any;
}

export interface ClosePanelAction {
  type: "closePanelAction";
  targetPanelId: string;
  skipOnDismissCommand: boolean;
}

export interface ShowPollPanelAction {
  type: "showPollPanelAction";
  targetId: string;
  id: string;
  pollType: YTLiveChatPollType;
  question?: string;
  choices: YTLiveChatPollChoice[];
  authorName: string;
  authorPhoto: string;
}

export interface UpdatePollAction {
  type: "updatePollAction";
  id: string;
  pollType: YTLiveChatPollType;
  authorName: string;
  authorPhoto: string;
  question?: string;
  choices: YTLiveChatPollChoice[];
  elapsedText: string;
  voteCount: number;
}

export interface AddPollResultAction {
  type: "addPollResultAction";
  id: string;
  question?: YTRun[];
  /** @deprecated use `voteCount` */
  total: string;
  voteCount: number;
  choices: PollChoice[];
}

export interface PollChoice {
  text: YTRun[];
  voteRatio: number;
  votePercentage: string;
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

export interface MembershipGiftPurchaseAction extends Badges {
  type: "membershipGiftPurchaseAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  channelName: string; // MEMO: is it limited for ¥500 membership?
  amount: number; // 5, 10, 20
  authorName: string;
  authorChannelId: string;
  authorPhoto: string;
  image: string; // always https://www.gstatic.com/youtube/img/sponsorships/sponsorships_gift_purchase_announcement_artwork.png
}

export type MembershipGiftPurchaseTickerContent = Omit<
  MembershipGiftPurchaseAction,
  "timestamp" | "timestampUsec"
>;

export interface MembershipGiftRedemptionAction extends Badges {
  type: "membershipGiftRedemptionAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  senderName: string; // author was gifted a membership by sender
  authorName: string;
  authorChannelId: string;
  authorPhoto: string;
}

export interface ModerationMessageAction {
  type: "moderationMessageAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  message: YTRun[];
}

export interface RemoveChatItemAction {
  type: "removeChatItemAction";
  targetId: string;
  timestamp: Date;
}

export interface RemoveChatItemByAuthorAction {
  type: "removeChatItemByAuthorAction";
  channelId: string;
  timestamp: Date;
}

export interface UnknownAction {
  type: "unknown";
  payload: unknown;
}

export interface ErrorAction {
  type: "error";
  error: unknown;
  payload: unknown;
}
