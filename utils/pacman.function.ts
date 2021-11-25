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
	for (var prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
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

export const isSameDay = (target: Date, compare: Date) => {
	return isSameMonth(target, compare) &&
		target.getDay() === compare.getDay();
}

export const isSameMonth = (target: Date, compare: Date) => {
	return isSameYear(target, compare) &&
		target.getMonth() === compare.getMonth()
}

export const isSameYear = (target: Date, compare: Date) => {
	return target.getFullYear() === compare.getFullYear()
}

export const mapMonth = (month: number|string) => {
	const dict = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return dict[month as number]
}

export const getDisplayTime = (date: Date) => {
	const hr = (date.getHours() < 10 ? '0' : '') + date.getHours()
	const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
	return hr + ":" + min
}