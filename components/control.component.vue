<template>
	<v-row :v-if="commands">
		<v-col v-for="(item, index) in commands" :key="index" cols="3">
			<v-btn color="error" block @click="sendCommand(item)">
				{{ item.move }}
			</v-btn>
		</v-col>
	</v-row>
</template>

<script lang="ts">
import { HelixPrivilegedUser } from '@twurple/api/lib'
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { getTimeInDifferentTZ } from '~/utils/pacman.function'

@Component
export default class ControlComponent extends Vue {
	@Prop({ required: true }) commands!: any
	@Prop() userData!: HelixPrivilegedUser

	async sendCommand (message: any) {
		const messageRef = this.$fire.database.ref('commands')
		await messageRef.push({
			...message,
			timestamp: getTimeInDifferentTZ('UTC'),
			sender: this.userData.displayName
		})
	}
}
</script>

<style>
</style>
