<template>
	<div>
		<div v-for="(item, index) in leaderboard" :key="'leader-' + index">
			<p v-if="index < 10" class="mb-0">
				{{ `${index + 1}:` }}
				<span class="purple--text text--lighten-3">{{ item.user }}</span>&nbsp;{{ `(${item.score})` }}
			</p>
		</div>
		<p v-if="highscore" class="py-4">
			Ms.PACMAN Highscore: {{ highscore.score }}
		</p>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ControlComponent extends Vue {
	public leaderboard: any = []
	public highscore: any = null

	mounted () {
		this.fetchLdBoard()
		this.fetchHighscore()
	}

	private async fetchLdBoard () {
		const messageRef = this.$fire.database.ref('leaderboard')
		await messageRef.on('value', (snap: any) => {
			const val = snap.val()
			this.leaderboard = Object.keys(val)
				.map(k => val[k])
				.sort((a: any, b: any) => (a.score > b.score ? -1 : 1))
		})
	}

	private async fetchHighscore () {
		const messageRef = this.$fire.database.ref('highscore')
		await messageRef.on('value', (snap: any) => {
			this.highscore = snap.val()
		})
	}
}
</script>
