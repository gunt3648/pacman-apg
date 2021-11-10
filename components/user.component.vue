<template>
	<div class="mb-4">
		<div v-if="userData && userData.displayName">
			<p>
				Welcome!
				<span class="purple--text text--lighten-3 font-weight-bold">{{
					userData.displayName
				}}</span>
			</p>
			<a href="#">Sign out</a>
		</div>
		<div v-else>
			<p>Welcome! Please login to Twitch before requesting control.</p>
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
</style>
