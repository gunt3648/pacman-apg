<template>
	<v-row v-if="commands">
		<v-col cols="12" class="py-0 pb-1">
			<p class="ma-0">
				Quick commands
				<v-dialog v-model="dialog" width="800">
					<template #activator="{ on, attrs }">
						<v-btn
							class="ma-1 cmd-small-btn"
							width="16"
							height="16"
							outlined
							fab
							color="white"
							v-bind="attrs"
							v-on="on"
						>
							<v-icon size="14">
								mdi-help
							</v-icon>
						</v-btn>
					</template>
					<v-card>
						<v-card-title class="text-h5">
							Available commands
						</v-card-title>
						<v-text-field
							v-model="search"
							append-icon="mdi-magnify"
							label="Search for commands"
							single-line
							hide-details
							class="mx-6 my-2"
						/>

						<v-data-table
							dense
							:headers="headers"
							:footer-props="footers"
							:items="commands"
							:search="search"
							item-key="name"
							height="360"
							class="mx-6"
						>
							<template #[`item.shortcut`]="{ item }">
								<v-simple-checkbox v-model="item.shortcut" :disabled="!(userData && userData.displayName)" />
							</template>
						</v-data-table>
						<v-card-actions>
							<v-spacer />
							<v-btn color="white" text @click="dialog = false">
								Close
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</p>
		</v-col>
		<v-col
			v-for="(item, index) in commands.filter((val) => filterCommands(val))"
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
	public dialog: boolean = false
	public headers: any[] = [
		{ text: 'ID', align: 'start', filterable: false, value: 'id' },
		{ text: 'Commands', value: 'name' },
		{
			text: 'Description',
			sortable: false,
			filterable: false,
			value: 'description'
		},
		{ text: 'Quick commands', value: 'shortcut' }
	]
	public footers: any = {
		'disable-items-per-page': true
	}
	public search: string = ''

	filterCommands (val: any) {
		return val?.shortcut
	}

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

<style lang="scss" scoped>
.cmd-inpadding {
	padding-left: 4px;
	padding-right: 4px;
}

.cmd-button {
	width: 100%;
	margin-bottom: 4px;
}
</style>
