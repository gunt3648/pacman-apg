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
		target.getDate() === compare.getDate();
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

export const mapCommands = (cmd: string) => {
	let msg = null;
	if (cmd.startsWith('/')) msg = cmd.split('/')[1]
	if (msg === 'up') return {id: '1', name: 'up' }
	else if (msg === 'down') return {id: '2', name: 'down' }
	else if (msg === 'left') return {id: '3', name: 'left' }
	else if (msg === 'right') return {id: '4', name: 'right' }
	else if (msg === 'freezeghosts') return {id: '5', name: 'freeze ghosts' }
	else if (msg === 'remove2pellets') return {id: '6', name: 'remove 2 pellets' }
	else if (msg === 'superpellet') return {id: '7', name: 'supper pellet' }
	else if (msg === 'killghosts') return {id: '8', name: 'kill ghosts' }
	else if (msg === 'ignoreghosts') return {id: '9', name: 'ignore ghosts' }
	else if (msg === 'slowdown') return {id: '10', name: 'slow down' }
	
}