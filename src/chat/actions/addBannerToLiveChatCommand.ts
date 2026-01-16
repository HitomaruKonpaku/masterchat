import { toUnknownAction } from "..";
import {
  AddBannerAction,
  AddIncomingRaidBannerAction,
  AddOutgoingRaidBannerAction,
  AddProductBannerAction,
  AddChatSummaryBannerAction,
  AddCallForQuestionsBannerAction,
} from "../../interfaces/actions";
import { YTAddBannerToLiveChatCommand } from "../../interfaces/yt/chat";
import { debugLog, endpointToUrl, stringify, tsToDate } from "../../utils";
import { parseBadges } from "../badge";
import { pickThumbUrl } from "../utils";

export function parseAddBannerToLiveChatCommand(
  payload: YTAddBannerToLiveChatCommand
) {
  // add pinned item
  const bannerRdr = payload["bannerRenderer"]["liveChatBannerRenderer"];

  // banner
  const actionId = bannerRdr.actionId;
  const targetId = bannerRdr.targetId;
  const viewerIsCreator = bannerRdr.viewerIsCreator;
  const isStackable = bannerRdr.isStackable;
  const bannerType = bannerRdr.bannerType;

  // contents
  const contents = bannerRdr.contents;

  if ("liveChatTextMessageRenderer" in contents) {
    const rdr = contents.liveChatTextMessageRenderer;
    const id = rdr.id;
    const message = rdr.message.runs;
    const timestampUsec = rdr.timestampUsec;
    const timestamp = tsToDate(timestampUsec);
    const authorName = stringify(rdr.authorName);
    const authorPhoto = pickThumbUrl(rdr.authorPhoto);
    const authorChannelId = rdr.authorExternalChannelId;
    const badges = parseBadges(rdr);

    // header
    const header = bannerRdr.header!.liveChatBannerHeaderRenderer;
    const title = header.text.runs;

    if (!authorName) {
      debugLog(
        "[action required] Empty authorName found at addBannerToLiveChatCommand",
        JSON.stringify(rdr)
      );
    }

    const parsed: AddBannerAction = {
      type: "addBannerAction",
      actionId,
      targetId,
      id,
      title,
      message,
      timestampUsec,
      timestamp,
      authorName,
      authorPhoto,
      authorChannelId,
      ...badges,
      viewerIsCreator,
      contextMenuEndpointParams:
        rdr.contextMenuEndpoint?.liveChatItemContextMenuEndpoint.params,
    };
    return parsed;
  }

  if ("liveChatBannerRedirectRenderer" in contents) {
    const rdr = contents.liveChatBannerRedirectRenderer;
    const targetVideoId =
      "watchEndpoint" in rdr.inlineActionButton.buttonRenderer.command
        ? rdr.inlineActionButton.buttonRenderer.command.watchEndpoint.videoId
        : undefined;

    const photo = pickThumbUrl(rdr.authorPhoto);

    if (targetVideoId) {
      // Outgoing
      const targetName = rdr.bannerMessage.runs[1].text;
      const payload: AddOutgoingRaidBannerAction = {
        type: "addOutgoingRaidBannerAction",
        actionId,
        targetId,
        bannerType,
        targetName,
        targetPhoto: photo,
        targetVideoId,
        bannerMessage: rdr.bannerMessage,
      };
      return payload;
    } else {
      // Incoming
      const sourceName = rdr.bannerMessage.runs[0].text;
      const payload: AddIncomingRaidBannerAction = {
        type: "addIncomingRaidBannerAction",
        actionId,
        targetId,
        bannerType,
        sourceName,
        sourcePhoto: photo,
        bannerMessage: rdr.bannerMessage,
      };
      return payload;
    }
  }

  if ("liveChatProductItemRenderer" in contents) {
    const rdr = contents.liveChatProductItemRenderer;
    const title = rdr.title;
    const description = rdr.accessibilityTitle;
    const thumbnail = rdr.thumbnail.thumbnails[0].url;
    const price = rdr.price;
    const vendorName = rdr.vendorName;
    const creatorMessage = rdr.creatorMessage;
    const creatorName = rdr.creatorName;
    const authorPhoto = pickThumbUrl(rdr.authorPhoto);
    const url = endpointToUrl(rdr.onClickCommand)!;

    if (!url) {
      debugLog(
        `Empty url at liveChatProductItemRenderer: ${JSON.stringify(rdr)}`
      );
    }

    const dialogMessage =
      rdr.informationDialog.liveChatDialogRenderer.dialogMessages;
    const isVerified = rdr.isVerified;

    const payload: AddProductBannerAction = {
      type: "addProductBannerAction",
      actionId,
      targetId,
      viewerIsCreator,
      isStackable,
      title,
      description,
      thumbnail,
      price,
      vendorName,
      creatorMessage,
      creatorName,
      authorPhoto,
      url,
      dialogMessage,
      isVerified,
    };
    return payload;
  }

  if ("liveChatCallForQuestionsRenderer" in contents) {
    const rdr = contents.liveChatCallForQuestionsRenderer;
    const creatorAvatar = rdr.creatorAvatar.thumbnails[0].url;
    const creatorAuthorName = stringify(rdr.creatorAuthorName);
    const questionMessage = rdr.questionMessage.runs;

    const parsed: AddCallForQuestionsBannerAction = {
      type: "addCallForQuestionsBannerAction",
      actionId,
      targetId,
      isStackable,
      bannerType,
      creatorAvatar,
      creatorAuthorName,
      questionMessage,
    };
    return parsed;
  }

  if ("liveChatBannerChatSummaryRenderer" in contents) {
    const rdr = contents.liveChatBannerChatSummaryRenderer;
    const id = rdr.liveChatSummaryId;
    const timestampUsec = id.split("_").at(-1)!;
    const timestamp = tsToDate(timestampUsec);
    const chatSummary = rdr.chatSummary.runs;

    const parsed: AddChatSummaryBannerAction = {
      type: "addChatSummaryBannerAction",
      id,
      actionId,
      targetId,
      isStackable,
      bannerType,
      timestampUsec,
      timestamp,
      chatSummary,
    };
    return parsed;
  }

  debugLog(
    `[action required] Unrecognized content type found in parseAddBannerToLiveChatCommand: ${JSON.stringify(
      payload
    )}`
  );

  return toUnknownAction(payload);
}
