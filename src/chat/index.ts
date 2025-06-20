import { Action, ErrorAction, UnknownAction } from "../interfaces/actions";
import { YTAction } from "../interfaces/yt/chat";
import { debugLog, omitTrackingParams } from "../utils";
import { parseAddBannerToLiveChatCommand } from "./actions/addBannerToLiveChatCommand";
import { parseAddChatItemAction } from "./actions/addChatItemAction";
import { parseAddLiveChatTickerItemAction } from "./actions/addLiveChatTickerItemAction";
import { parseCloseLiveChatActionPanelAction } from "./actions/closeLiveChatActionPanelAction";
import { parseMarkChatItemAsDeletedAction } from "./actions/markChatItemAsDeletedAction";
import { parseMarkChatItemsByAuthorAsDeletedAction } from "./actions/markChatItemsByAuthorAsDeletedAction";
import { parseRemoveBannerForLiveChatCommand } from "./actions/removeBannerForLiveChatCommand";
import { parseReplaceChatItemAction } from "./actions/replaceChatItemAction";
import { parseShowLiveChatActionPanelAction } from "./actions/showLiveChatActionPanelAction";
import { parseShowLiveChatTooltipCommand } from "./actions/showLiveChatTooltipCommand";
import { parseUpdateLiveChatPollAction } from "./actions/updateLiveChatPollAction";

/**
 * Parse raw action object and returns Action
 */
export function parseAction(action: YTAction): Action {
  try {
    const filteredActions = omitTrackingParams(action);
    const type = Object.keys(
      filteredActions
    )[0] as keyof typeof filteredActions;

    switch (type) {
      case "addChatItemAction": {
        const parsed = parseAddChatItemAction(action[type]!);
        if (parsed) return parsed;
        break;
      }

      case "markChatItemsByAuthorAsDeletedAction":
        return parseMarkChatItemsByAuthorAsDeletedAction(action[type]!);

      case "markChatItemAsDeletedAction":
        return parseMarkChatItemAsDeletedAction(action[type]!);

      case "addLiveChatTickerItemAction": {
        const parsed = parseAddLiveChatTickerItemAction(action[type]!);
        if (parsed) return parsed;
        break;
      }

      case "replaceChatItemAction":
        return parseReplaceChatItemAction(action[type]!);

      case "addBannerToLiveChatCommand":
        return parseAddBannerToLiveChatCommand(action[type]!);

      case "removeBannerForLiveChatCommand":
        return parseRemoveBannerForLiveChatCommand(action[type]!);

      case "showLiveChatTooltipCommand":
        return parseShowLiveChatTooltipCommand(action[type]!);

      case "showLiveChatActionPanelAction":
        return parseShowLiveChatActionPanelAction(action[type]!);

      case "updateLiveChatPollAction":
        return parseUpdateLiveChatPollAction(action[type]!);

      case "closeLiveChatActionPanelAction":
        return parseCloseLiveChatActionPanelAction(action[type]!);

      default: {
        debugLog(
          "[action required] Unrecognized action type:",
          JSON.stringify(action)
        );
      }
    }

    return toUnknownAction(action);
  } catch (error: any) {
    debugLog(
      "[action required] Error occurred while parsing action:",
      error.message || error,
      JSON.stringify(action)
    );
    return toErrorAction(action, error);
  }
}

/**
 * Unknown action used for unexpected payloads. You should implement an appropriate action parser as soon as you discover this action in the production.
 */
export function toUnknownAction(payload: unknown): UnknownAction {
  return {
    type: "unknown",
    payload,
  };
}

export function toErrorAction(payload: unknown, error: unknown): ErrorAction {
  return {
    type: "error",
    error,
    payload,
  };
}
