<template>
	<v-row class="py-6" :v-if="config && playerConfig">
		<v-col xl="12" md="12" sm="12" cols="12" class="pac-block pa-0">
			<div class="pac-block--top">
				<h1 class="display-inline">
					Ms. PACMAN
				</h1>
				<user-component
					:user-data="user"
					:twitch-config="config"
					class="display-inline"
				/>
			</div>
		</v-col>
		<v-col xl="8" md="12" sm="12" cols="12" class="pa-0">
			<streaming-component :player-config="playerConfig" />
		</v-col>
		<v-col v-if="user" cols="12">
			<control-component :user-data="user" :commands="commands" />
		</v-col>
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
	TwitchAuth,
	TwitchPlayerConfig
} from '~/utils/pacman.interface'
import { getTwitchConfig, isEmpty, mapToken } from '~/utils/pacman.function'

@Component
export default class Index extends Vue {
	public config: TwitchConfig = null!
	public playerConfig: TwitchPlayerConfig | any = null!
	public commands: any = null!
	public user: HelixPrivilegedUser = null!

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
		this.commands = await this.getCommands()
	}

	private getPlayerConfig () {
		const messageRef = this.$fire.database.ref('twitch-player')
		return messageRef.get().then(async (snap: any) => await snap.val())
	}

	private getCommands () {
		const messageRef = this.$fire.database.ref('commands-list')
		return messageRef.get().then(async (snap: any) => {
			const val = await snap.val()
			return Object.keys(val).map(k => val[k])
		})
	}
}
</script>

<style lang="scss" scoped>
.pac-block {
  width: 100%;
  height: 100%;
  min-height: 7em;
  white-space: nowrap;
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
    line-height: 1em;
  }

  .display-inline {
    display: inline-block;
  }
}
</style>
