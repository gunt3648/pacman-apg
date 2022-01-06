<template>
	<div class="pac-page">
		<v-row v-if="config && playerConfig" class="pa-3">
			<v-col xl="8" md="8" sm="8" cols="12" class="pac-block pa-0">
				<div class="pac-block--top">
					<h1 class="display-inline">
						Ms. PACMAN
					</h1>
					<img src="../static/img/pacman-ghost.png" class="pac-img">
				</div>
			</v-col>
			<v-col xl="4" md="4" sm="4" cols="12" class="pa-0">
				<user-component
					:user-data="user"
					:twitch-config="config"
					class="display-inline"
				/>
			</v-col>
		</v-row>
		<v-row class="pac-full--body">
			<v-col xl="8" md="8" sm="12" cols="12" class="pa-0">
				<streaming-component :player-config="playerConfig" class="pac-border" />
				<v-row>
					<v-col md="8" cols="12">
						<div class="pa-3">
							<p v-if="playingState.isplaying&&playingState.available">You are playing the game. Current score: <span class="purple--text text--lighten-3 font-weight-bold">{{playingState.score}}</span>.</p>
							<p v-if="!playingState.isplaying&&playingState.available">The game has ended. Game score: <span class="purple--text text--lighten-3 font-weight-bold">{{playingState.score}}</span>. Restart to level 1 in a few seconds.</p>
							<p v-if="!playingState.available"> Game playing is currently <span class="purple--text text--lighten-3 font-weight-bold">unavailable</span>.</p>
						</div>
					</v-col>
				</v-row>
			</v-col>
			<v-col xl="4" md="4" sm="12" cols="12" class="pa-0">
				<chat-component :user-data="user" :commands="commands" />
			</v-col>
		</v-row>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ApiClient } from '@twurple/api'
import { HelixPrivilegedUser } from '@twurple/api/lib/api/helix/user/HelixPrivilegedUser'
import { AccessToken, RefreshingAuthProvider } from '@twurple/auth/lib'
import { $axios } from '~/utils/api'

import {
	TwitchPayload,
	TwitchConfig,
	TwitchAuth,
	TwitchPlayerConfig
} from '~/utils/pacman.interface'
import { getTwitchConfig, isEmpty, mapToken } from '~/utils/pacman.function'

@Component
export default class Index extends Vue {
	public config: TwitchConfig = null!
	public playerConfig: TwitchPlayerConfig | any = null!
	public user: HelixPrivilegedUser = null!
	public commands: any = null!
	public playingState: any = null!
	private apiClient!: ApiClient

	created () {
		this.loadConfigAndCommands()
	}

	mounted () {
		const urlParam: any = this.$route.query
		const twitchToken: TwitchAuth = JSON.parse(
			localStorage.getItem('twitchToken')!
		)
		if ((!isEmpty(urlParam) && urlParam.code) || !isEmpty(twitchToken)) {
			const payload: TwitchPayload = {
				...this.config,
				code: urlParam.code
			}
			this.initApiClient(payload)
		}
		this.fetchUser()
	}

	private async fetchUser () {
		this.user = await this.apiClient?.users.getMe()
	}

	private async initApiClient (twitchPayload: TwitchPayload) {
		try {
			let twitchToken: AccessToken = JSON.parse(
				localStorage.getItem('twitchToken')!
			)
			if (isEmpty(twitchToken)) {
				const temp = await $axios.$post(
					'https://id.twitch.tv/oauth2/token',
					twitchPayload
				)
				twitchToken = mapToken(temp)
				localStorage.setItem('twitchToken', JSON.stringify(twitchToken))
			}
			const authProvider = this.createAuthProvider(twitchToken)
			this.apiClient = new ApiClient({ authProvider })
			this.fetchUser()
		} catch {
			// retry
		}
	}

	private createAuthProvider (twitchToken: AccessToken) {
		return new RefreshingAuthProvider(
			{
				clientId: this.config.client_id,
				clientSecret: this.config.client_secret,
				onRefresh: (newTokenData) => {
					localStorage.setItem('twitchToken', JSON.stringify(newTokenData))
				}
			},
			twitchToken
		)
	}

	private async loadConfigAndCommands () {
		this.config = getTwitchConfig()
		this.playerConfig = await this.getPlayerConfig()
		await this.getCommands()
		await this.getPlayingState()
	}

	private getPlayerConfig () {
		const messageRef = this.$fire.database.ref('twitch-player')
		return messageRef.get().then(async (snap: any) => await snap.val())
	}

	private getCommands () {
		const messageRef = this.$fire.database.ref('commands-list')
		return messageRef.on('value',(snap: any) => {
			const val = snap.val()
			this.commands = Object.keys(val).map(k => val[k])
		})
	}
	
	private getPlayingState () {
		const messageRef = this.$fire.database.ref('currentscore')
		return messageRef.on('value',(snap: any) => {
			const val = snap.val()
			this.playingState = val
		})
	}
}
</script>

<style lang="scss" scoped>
.pac-full--body {
	.pac-border {
		border-top: #ce93d8 solid 2px;
		border-bottom: #ce93d8 solid 2px;
	}
}

.pac-img {
	position: absolute;
	height: 48px;
}

.pac-block {
	position: relative;
	width: 100%;
	height: 100%;
	white-space: nowrap;

	& h1 {
		font-size: 3em;
		line-height: 1em;
	}

	.display-inline {
		display: inline-block;
	}
}

@media only screen and (min-width: 960px) {
	.pac-full--body {
		height: calc(100vh - 72px);
		height: -moz-calc(100vh - 72px);
		height: -webkit-calc(100vh - 72px);
		overflow: hidden;
	}
}
</style>
