# Masterchat

[![npm](https://badgen.net/npm/v/masterchat)](https://npmjs.org/package/masterchat)
[![npm: total downloads](https://badgen.net/npm/dt/masterchat)](https://npmjs.org/package/masterchat)

YouTube Live Chat client for JavaScript.

- [Documentation](https://holodata.github.io/masterchat/classes/index.Masterchat.html)

## Install

```
npm i masterchat
```

## Examples

### Iterate live chats

```js
import { Masterchat, runsToString } from "masterchat";

async function main() {
  try {
    const live = await Masterchat.init("<videoId>");

    for await (const { actions } of live.iterate()) {
      const chats = actions.filter(
        (action) => action.type === "addChatItemAction"
      );

      for (const chat of chats) {
        console.log(chat.authorName, runsToString(chat.rawMessage));
      }
    }
  } catch (err) {
    console.log(err.code);
    // "disabled" => Live chat is disabled
    // "membersOnly" => No permission (members-only)
    // "private" => No permission (private video)
    // "unavailable" => Deleted OR wrong video id
    // "unarchived" => Live stream recording is not available
    // "denied" => Access denied
    // "invalid" => Invalid request
    // "unknown" => Unknown error
  }
}

main();
```

### Download replay chat as JSONLines

```js
import { Masterchat, convertRunsToString } from "masterchat";
import { appendFile } from "fs/promises";

async function main() {
  const replay = await Masterchat.init("<videoId>");

  for await (const { actions } of replay.iterate()) {
    const chats = actions.filter(
      (action) => action.type === "addChatItemAction"
    );

    const jsonl = chats.map((chat) => JSON.stringify(chat)).join("\n");

    await appendFile("./chats.jsonl", jsonl + "\n");
  }
}

main();
```

### Auto-moderator

```js
import { Masterchat, runsToString } from "masterchat";
import { isSpam } from "spamreaper";

async function main() {
  // `credentials` is an object containing YouTube session cookie or a base64-encoded JSON string of them
  const credentials = {
    SAPISID: "<value>",
    APISID: "<value>",
    HSID: "<value>",
    SID: "<value>",
    SSID: "<value>",
  };

  const live = await Masterchat.init("<videoId>", { credentials });

  for await (const { actions } of live.iterate({
    ignoreFirstResponse: true,
  })) {
    for (const action of actions) {
      if (action.type !== "addChatItemAction") continue;

      if (isSpam(runsToString(action.rawMessage))) {
        await live.remove(action.contextMenuEndpointParams);
      }
    }
  }
}

main();
```

## Advanced Tips

### Faster instantiation

To skip loading watch page, use:

```js
const live = new Masterchat(videoId, channelId, isReplay);
```

instead of:

```js
const live = await Masterchat.init(videoId);
```

The former won't populate metadata. If you need metadata, call:

```js
await live.populateMetadata(); // will query watch page
console.log(live.metadata);
```

### Fetch credentials

```bash
cd extra/credentials-fetcher
npm i
npm start
```

## CLI

[![npm](https://badgen.net/npm/v/masterchat-cli)](https://npmjs.org/package/masterchat-cli)
[![npm: total downloads](https://badgen.net/npm/dt/masterchat-cli)](https://npmjs.org/package/masterchat-cli)

See YouTube Live Chat through flexible filtering engine.

- [Documentation](https://github.com/holodata/masterchat-cli/blob/master/README.md)
- [Source](https://github.com/holodata/masterchat-cli)

```
npm i -g masterchat-cli
```

## Desktop

For a desktop app, see [Komet](https://github.com/holodata/komet).

## Roadmap

- [x] Release `masterchat`
- [x] Release `masterchat-cli`
- [x] Auth support
- [x] Ability to send chat
- [x] Moderation functionality

## Contribute

- Use masterchat with your product and [report bugs](https://github.com/holodata/masterchat/issues/new)
- Squash [TODOs](https://github.com/holodata/masterchat/search?l=TypeScript&q=TODO)

See [Contribution Guide](./CONTRIBUTING.md) for more information.

## Community

Ask questions in `#masterchat` channel on [holodata Discord server](https://holodata.org/discord).
