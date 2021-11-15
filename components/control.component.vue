<template>
	<div>
		<v-btn color="error" block @click="doSomething">
			Button
		</v-btn>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ControlComponent extends Vue {
	async doSomething () {
		const messageRef = this.$fire.database.ref('commands')
		try {
			await messageRef.push({
				message: 'Hello!'
			})
		} catch (e) {
			alert(e)
		}
	}
}
</script>

<style>
</style>
