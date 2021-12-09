<template>
	<div class="pa-3">
		<p class="font-weight-bold">
			Leaderboard
		</p>
		<div v-for="(item, index) in leaderboard" :key="'leader-'+index">
			<p class="mb-0">
				{{ `${index+1}: ${item.user} (${item.score})` }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ControlComponent extends Vue {
  @Prop({ required: true }) leaderboard!: any
}
</script>
