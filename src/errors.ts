import { VideoObject } from "./interfaces";

export type EndReason =
  | "privated" // Privated by streamer
  | "deleted" // Deleted by streamer
  | "disabled" // Chat disabled by streamer
  | "aborted" // Aborted by user
  | null; // Stream ended normally

export type ErrorCode =
  | "unavailable" // Deleted video OR wrong video id
  | "disabled" // Live chat is disabled
  | "private" // No permission (private)
  | "bot" // Bot detected
  | "membersOnly" // No permission (members-only)
  | "unarchived" // Live stream recording is not available
  | "denied" // Access denied (429)
  | "invalid"; // Invalid request

export interface MembersOnlyErrorData {
  channelId?: string;
  meta?: VideoObject;
}

export class MasterchatError<T = any> extends Error {
  public code: ErrorCode;
  public data?: T;

  constructor(code: ErrorCode, msg: string, data?: T) {
    super(msg);
    this.code = code;
    this.data = data;

    Object.setPrototypeOf(this, MasterchatError.prototype);
  }
}

export class UnavailableError extends MasterchatError {
  constructor(msg: string) {
    super("unavailable", msg);
    Object.setPrototypeOf(this, UnavailableError.prototype);
  }
}

export class DisabledChatError extends MasterchatError {
  constructor(msg: string) {
    super("disabled", msg);
    Object.setPrototypeOf(this, DisabledChatError.prototype);
  }
}

export class NoPermissionError extends MasterchatError {
  constructor(msg: string) {
    super("private", msg);
    Object.setPrototypeOf(this, NoPermissionError.prototype);
  }
}

export class BotError extends MasterchatError {
  constructor(msg: string) {
    super("bot", msg);
    Object.setPrototypeOf(this, BotError.prototype);
  }
}

export class MembersOnlyError extends MasterchatError<MembersOnlyErrorData> {
  constructor(msg: string, data?: MembersOnlyErrorData) {
    super("membersOnly", msg, data);
    Object.setPrototypeOf(this, MembersOnlyError.prototype);
  }
}

export class NoStreamRecordingError extends MasterchatError {
  constructor(msg: string) {
    super("unarchived", msg);
    Object.setPrototypeOf(this, NoStreamRecordingError.prototype);
  }
}

export class AccessDeniedError extends MasterchatError {
  constructor(msg: string) {
    super("denied", msg);
    Object.setPrototypeOf(this, AccessDeniedError.prototype);
  }
}

export class InvalidArgumentError extends MasterchatError {
  constructor(msg: string) {
    super("invalid", msg);
    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}

export class AbortError extends Error {}
