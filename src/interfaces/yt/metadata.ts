export interface Person {
  url: string;
  name: string;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface InteractionCounter {
  interactionType: string;
  userInteractionCount: number;
}

export interface PublicationEvent {
  isLiveBroadcast: boolean;
  startDate?: string;
  endDate?: string;
}

export interface VideoObject {
  url: string;
  name: string;
  description: string;
  requiresSubscription: boolean;
  identifier: string;
  duration: string;
  author: Person;
  thumbnailUrl: string;
  thumbnail: Thumbnail;
  embedUrl: string;
  playerType: string;
  width: number;
  height: number;
  isFamilyFriendly: boolean;
  regionsAllowed: string;
  interactionStatistic?: InteractionCounter | InteractionCounter[];
  keywords?: string;
  datePublished: string;
  uploadDate: string;
  genre?: string;
  publication?: PublicationEvent;
}
