import twitchJson from '~/twitch.config.json'
import { AccessToken } from '@twurple/auth/lib';
import { TwitchAuth, TwitchConfig } from './pacman.interface';

export const getTwitchConfig = (): TwitchConfig => {
  return twitchJson;
}

export const mapToken = (token: TwitchAuth): AccessToken => {
  return {
    accessToken: token.access_token,
    expiresIn: token.expires_in,
    obtainmentTimestamp: token.obtainment_timestamp ??= new Date().getTime(),
    refreshToken: token.refresh_token,
    scope: token.scope
  };
}

export const isEmpty = (obj: any): boolean => {
  for(var prop in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return obj === undefined || obj === null || JSON.stringify(obj) === JSON.stringify({});
}

export const getTimeInDifferentTZ = (tzString: string) => {
  return new Date().toLocaleString("en-US", {
    timeZone: tzString,
    hour12: false
  });
}