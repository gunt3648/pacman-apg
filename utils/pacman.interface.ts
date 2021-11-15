export interface Query {
	code: string,
	scope: string
}

export interface TwitchPayload {
	client_id: string,
	client_secret: string,
	redirect_uri: string,
	grant_type: string
	code?: string,
}

export interface TwitchConfig {
	client_id: string,
	client_secret: string,
	grant_type: string,
	redirect_uri: string
}

export interface TwitchUser {
	id: string,
	login: string,
	display_name: string,
	type: string,
	broadcaster_type: string,
	description: string,
	profile_image_url: string,
	offline_image_url: string,
	view_count: number,
	email: string,
	created_at: string
}

export interface TwitchAuth {
	access_token: string,
	expires_in: number,
	refresh_token: string,
	scope: string[],
	token_type?: string,
	obtainment_timestamp?: any
}

export interface TwitchPlayerConfig {
	channel: string,
	parent: string,
	muted: boolean
}