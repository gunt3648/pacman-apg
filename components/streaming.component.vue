<template>
	<div class="mb-4 video-wrapper" :v-if="playerConfig">
		<iframe
			class="video-player"
			:src="generateUrl(playerConfig)"
			frameborder="0"
			scrolling="no"
			layout="video-with-chat"
		/>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { TwitchPlayerConfig } from '~/utils/pacman.interface'

@Component
export default class UserComponent extends Vue {
	@Prop({ required: true }) playerConfig!: TwitchPlayerConfig

	created () {}

	private generateUrl (config: TwitchPlayerConfig): string {
		if (config) { return `https://player.twitch.tv/?channel=${this.playerConfig.channel}&parent=${this.playerConfig.parent}&muted=${this.playerConfig.muted}&font-size=small` } else { return null! }
	}
}
</script>

<style lang="scss" scoped>
.video-wrapper {
	width: 100%;
	padding-top: 56.9%;
	position: relative;

	.video-player {
		position: absolute;
		top: 0;

		width: 100%;
		height: 100%;
	}
}
</style>
