<template>
	<div>
		<div v-if="userData && userData.displayName">
			<p class="mb-0">
				Welcome!
				<span class="purple--text text--lighten-3 font-weight-bold">{{
					userData.displayName
				}}</span>

				<a href="#" class="user-signout">Sign out</a>
			</p>
		</div>
		<div v-else>
			<p class="mb-0">
				Welcome! Please login to Twitch before sending commands.
			</p>
			<a :href="authUrl">Connect to Twitch</a>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { HelixPrivilegedUser } from '@twurple/api/lib'
import { TwitchConfig } from '~/utils/pacman.interface'

@Component
export default class UserComponent extends Vue {
	@Prop() userData!: HelixPrivilegedUser
	@Prop({ required: true }) twitchConfig!: TwitchConfig
	authUrl!: string

	created () {
		this.authUrl = this.generateUrl()
	}

	private generateUrl (): string {
		return `https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=${this.twitchConfig.client_id}&redirect_uri=${this.twitchConfig.redirect_uri}&scope=user:read:email`
	}
}
</script>

<style lang="scss" scoped>
.user-signout {
	margin-left: 20px;
}
</style>
