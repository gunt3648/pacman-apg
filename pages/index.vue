<template>
	<v-row class="py-6">
		<v-col xl="6" md="7" class="pac-block pa-0">
			<h1 class="pac-block--bottom">
				Ms. PACMAN
			</h1>
		</v-col>
		<v-col xl="4" md="5" offset-xl="2" class="pac-block pa-0">
			<user-component
				:user-data="user"
				:twitch-config="config"
				class="pac-block--bottom"
			/>
		</v-col>
		<streaming-component />
	</v-row>
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
	TwitchAuth
} from '~/utils/pacman.interface'
import { getTwitchConfig, isEmpty, mapToken } from '~/utils/pacman.function'

@Component
export default class Index extends Vue {
	private config: TwitchConfig = getTwitchConfig()
	private apiClient!: ApiClient
	public user: HelixPrivilegedUser = null!

	created () {
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
	}

	mounted () {
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
}
</script>

<style lang="scss" scoped>
.pac-block {
	width: 100%;
	height: 7em;
	position: relative;

	&--top,
	&--bottom {
		line-height: 1em;
		position: absolute;
	}

	&--top {
		top: 0;
	}

	&--bottom {
		bottom: 0;
	}

	& h1 {
		font-size: 7em;
	}
}
</style>
