<template>
	<div class="pa-3">
		<p class="font-weight-bold">
			Leaderboard
		</p>
		<div v-for="(item, index) in leaderboard" :key="'leader-' + index">
			<p class="mb-0">
				{{ `${index + 1}: ${item.user} (${item.score})` }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ControlComponent extends Vue {
	public leaderboard: any = []

	mounted () {
		this.fetchLdBoard()
	}

	private async fetchLdBoard () {
		const messageRef = this.$fire.database.ref('leaderboard-temp')
		await messageRef.on('value', (snap: any) => {
			const val = snap.val()
			this.leaderboard = Object.keys(val)
				.map(k => val[k])
				.sort((a: any, b: any) => (a.score > b.score ? -1 : 1))
		})
	}
}
</script>
