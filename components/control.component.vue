<template>
	<v-row v-if="commands">
		<v-col cols="12" class="pt-0 pb-2">
			<p class="ma-0 cmd-header">
				Quick commands
				<v-dialog v-model="dialog" width="800">
					<template #activator="{ on, attrs }">
						<v-btn
							class="my-1 cmd-setting-btn"
							text
							x-small
							color="white"
							v-bind="attrs"
							v-on="on"
						>
							<v-icon left size="14" class="mx-0">
								mdi-cog
							</v-icon>
							Setting
						</v-btn>
					</template>
					<v-card>
						<v-card-title class="text-h5">
							Commands Setting
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
							<template #[`item.name`]="{ item }">
								{{ item.name.toUpperCase() }}
							</template>
							<template #[`item.shortcut`]="{ item }">
								<v-simple-checkbox
									v-model="item.shortcut"
									:disabled="!(userData && userData.displayName)"
								/>
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
.cmd-header {
	position: relative;

	.cmd-setting-btn {
		position: absolute;
		right: 0;
	}
}

.cmd-inpadding {
	padding-left: 4px;
	padding-right: 4px;
}

.cmd-button {
	width: 100%;
	margin-bottom: 4px;
}

@media only screen and (max-width: 959px) {
	.cmd-setting-btn {
		display: none;
	}
}
</style>
