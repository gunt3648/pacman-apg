<template>
	<v-row :v-if="commands">
		<v-col v-for="(item, index) in commands" :key="index" cols="3">
			<v-btn color="error" block @click="doSomething(item)">
				{{ item.move }}
			</v-btn>
		</v-col>
	</v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ControlComponent extends Vue {
	@Prop({ required: true }) commands!: any

	async doSomething (message: any) {
		const messageRef = this.$fire.database.ref('commands')
		await messageRef.push(message)
	}
}
</script>

<style>
</style>
