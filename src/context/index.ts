import * as cheerio from "cheerio";
import {
  BotError,
  MembersOnlyError,
  NoPermissionError,
  NoStreamRecordingError,
  UnavailableError,
} from "../errors";
import { runsToString } from "../utils";
import {
  PurpleStyle,
  YTInitialData,
  YTPlayabilityStatus,
} from "../interfaces/yt/context";
import { VideoObject } from "../interfaces/yt/metadata";

// OK duration=">0" => Archived (replay chat may be available)
// OK duration="0" => Live (chat may be available)
// LIVE_STREAM_OFFLINE => Offline (chat may be available)
function assertPlayability(
  playabilityStatus: YTPlayabilityStatus | undefined,
  data?: any
) {
  if (!playabilityStatus) {
    throw new Error("playabilityStatus missing");
  }

  const msg = playabilityStatus.reason || playabilityStatus.messages?.join(" ");
  switch (playabilityStatus.status) {
    case "ERROR":
      throw new UnavailableError(msg!);
    case "LOGIN_REQUIRED":
      if (
        playabilityStatus.reason === "Sign in to confirm you’re not a bot" ||
        playabilityStatus.skip?.playabilityErrorSkipConfig
          ?.skipOnPlayabilityError === false
      ) {
        throw new BotError(msg!);
      }
      throw new NoPermissionError(msg!);
    case "UNPLAYABLE": {
      if (
        "playerLegacyDesktopYpcOfferRenderer" in playabilityStatus.errorScreen!
      ) {
        throw new MembersOnlyError(msg!, data);
      }
      throw new NoStreamRecordingError(msg!);
    }
    case "LIVE_STREAM_OFFLINE":
    case "OK":
  }
}

export function findCfg(data: string) {
  const match = /ytcfg\.set\(({.+?})\);/.exec(data);
  if (!match) return;
  return JSON.parse(match[1]);
}

export function findIPR(data: string): unknown {
  const match = /var ytInitialPlayerResponse = (.+?);var meta/.exec(data);
  if (!match) return;
  return JSON.parse(match[1]);
}

export function findInitialData(data: string): YTInitialData | undefined {
  const match =
    /(?:var ytInitialData|window\["ytInitialData"\]) = (.+?);<\/script>/.exec(
      data
    );
  if (!match) return;
  return JSON.parse(match[1]);
}

export function findEPR(data: string) {
  return findCfg(data)?.PLAYER_VARS?.embedded_player_response;
}

export function findPlayabilityStatus(
  data: string
): YTPlayabilityStatus | undefined {
  const ipr = findIPR(data);
  return (ipr as any)?.playabilityStatus;
}
// embed disabled https://www.youtube.com/embed/JfJYHfrOGgQ
// unavailable video https://www.youtube.com/embed/YEAINgb2xfo
// private video https://www.youtube.com/embed/UUjdYGda4N4
// 200 OK

export async function parseMetadataFromEmbed(html: string) {
  const epr = findEPR(html);

  const ps = epr.previewPlayabilityStatus;
  assertPlayability(ps);

  const ep = epr.embedPreview;

  const prevRdr = ep.thumbnailPreviewRenderer;
  const vdRdr = prevRdr.videoDetails.embeddedPlayerOverlayVideoDetailsRenderer;
  const expRdr =
    vdRdr.expandedRenderer.embeddedPlayerOverlayVideoDetailsExpandedRenderer;

  const title = runsToString(prevRdr.title.runs);
  const thumbnail =
    prevRdr.defaultThumbnail.thumbnails[
      prevRdr.defaultThumbnail.thumbnails.length - 1
    ].url;
  const channelId = expRdr.subscribeButton.subscribeButtonRenderer.channelId;
  const channelName = runsToString(expRdr.title.runs);
  const channelThumbnail = vdRdr.channelThumbnail.thumbnails[0].url;
  const duration = Number(prevRdr.videoDurationSeconds);

  return {
    title,
    thumbnail,
    channelId,
    channelName,
    channelThumbnail,
    duration,
    status: ps.status,
    statusText: ps.reason,
  };
}

export function parseMetadataFromWatch(html: string) {
  const metadata = parseVideoMetadataFromHtml(html);
  const initialData = findInitialData(html)!;

  // TODO: initialData.contents.twoColumnWatchNextResults.conversationBar.conversationBarRenderer.availabilityMessage.messageRenderer.text.runs[0].text === 'Chat is disabled for this live stream.'
  const results =
    initialData.contents?.twoColumnWatchNextResults?.results.results!;

  const primaryInfo = results.contents?.find(
    (v) => v.videoPrimaryInfoRenderer
  )?.videoPrimaryInfoRenderer;
  const secondaryInfo = results.contents?.find(
    (v) => v.videoSecondaryInfoRenderer
  )?.videoSecondaryInfoRenderer;
  const videoOwner = secondaryInfo?.owner?.videoOwnerRenderer;
  const badges = primaryInfo?.badges || [];

  const channelId = videoOwner?.navigationEndpoint?.browseEndpoint?.browseId;
  const channelName =
    runsToString(videoOwner?.title?.runs || []) || metadata.author?.name;
  const title = runsToString(primaryInfo?.title?.runs || []) || metadata.name;
  const isLive = !metadata.publication?.endDate || false;
  const isUpcoming =
    primaryInfo?.dateText?.simpleText?.includes("Scheduled for") || false;
  const isMembersOnly =
    badges.some(
      (v) =>
        v.metadataBadgeRenderer.style === PurpleStyle.BadgeStyleTypeMembersOnly
    ) || false;

  try {
    const playabilityStatus = findPlayabilityStatus(html);
    // even if playabilityStatus missing you can still have chat
    if (playabilityStatus) {
      assertPlayability(playabilityStatus, { channelId, meta: metadata });
    }
  } catch (error) {
    // If members-only video is ended it should be able to get chat normally
    if (!(error instanceof MembersOnlyError && metadata.publication?.endDate)) {
      throw error;
    }
  }

  if (!channelId) {
    throw new Error("CHANNEL_ID_NOT_FOUND");
  }

  return {
    title,
    channelId,
    channelName,
    isLive,
    isUpcoming,
    isMembersOnly,
    metadata,
  };
}

/**
 * @see http://schema.org/VideoObject
 */
function parseVideoMetadataFromHtml(html: string): VideoObject {
  const $ = cheerio.load(html);
  const meta = parseVideoMetadataFromElement(
    $("[itemtype=http://schema.org/VideoObject]")?.[0]
  ) as VideoObject;
  return meta;
}

function parseVideoMetadataFromElement(
  root: any,
  meta: Record<string, any> = {}
) {
  root?.children?.forEach((child: any) => {
    const attributes = child?.attribs;
    const key = attributes?.itemprop;
    if (!key) {
      return;
    }

    if (child.children.length) {
      const value = parseVideoMetadataFromElement(child);
      if (meta[key]) {
        meta[key] = [meta[key], value];
      } else {
        meta[key] = value;
      }
      return;
    }

    const value = parseVideoMetaValueByKey(
      key,
      attributes?.href || attributes?.content
    );
    meta[key] = value;
  });

  return meta;
}

function parseVideoMetaValueByKey(key: string, value: string) {
  switch (key) {
    case "paid":
    case "unlisted":
    case "requiresSubscription":
    case "isFamilyFriendly":
    case "isLiveBroadcast":
      return /true/i.test(value);
    case "width":
    case "height":
    case "userInteractionCount":
      return Number(value);
  }
  return value;
}
