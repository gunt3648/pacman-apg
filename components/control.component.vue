<template>
	<v-row v-if="commands">
		<v-col cols="12" class="py-0 pb-1">
			<p class="ma-0">
				Quick commands
			</p>
		</v-col>
		<v-col
			v-for="(item, index) in commands"
			:key="'btn' + index"
			md="3"
			cols="6"
			class="pa-0"
		>
			<div class="cmd-inpadding">
				<v-btn
					v-if="index < 8"
					:disabled="!(userData && userData.displayName)"
					color="#7B1FA2"
					block
					x-small
					class="cmd-button"
					@click="sendCommand(item)"
				>
					{{ item.name }}
				</v-btn>
			</div>
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

<style scoped>
.cmd-inpadding {
	padding-left: 4px;
	padding-right: 4px;
}

.cmd-button {
	width: 100%;
	margin-bottom: 4px;
}
</style>
