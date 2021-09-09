#!/usr/bin/env/node

import { Masterchat, runsToString } from "..";
import { fetchMetadataFromEmbed } from "../services/context";

function log(...obj: any) {
  console.log(...obj);
}

async function main({
  videoId,
  useCredentials = false,
}: {
  videoId: string;
  useCredentials?: boolean;
}) {
  console.log(videoId);
  const m_embed = await fetchMetadataFromEmbed(videoId);
  console.log(JSON.stringify(m_embed));

  const mc = new Masterchat(videoId, m_embed!.channelId, {
    credentials: useCredentials ? credentials : undefined,
  });
}

const videoId = process.argv[2] || process.env.MC_MSG_TEST_ID;
if (!videoId) {
  throw new Error("missing videoId");
}

const credentials = process.env.MC_MSG_TEST_CREDENTIALS;

main({ videoId });
