<template>
	<div class="chat-background">
		<div class="chat-header px-4 py-2">
			<h2>{{ toggleLdboard ? 'LEADERBOARD' : 'STREAM CHAT' }}</h2>
			<div class="chat-toggle-btn mx-4 my-3">
				<v-switch
					v-model="toggleLdboard"
					color="purple lighten-3"
					:label="`Leaderboard: ${toggleLdboard ? 'ON' : 'OFF'}`"
					hide-details
					class="ma-0"
				/>
			</div>
		</div>
		<div v-if="chatHistory" id="msgContainer" class="chat-display px-4">
			<p
				v-for="(item, index) in chatHistory"
				:key="'chat-msg-' + index"
				class="chat-message"
			>
				<span class="grey--text text--lighten-3 chat-timestamp">
					{{ displayTimestamp(item.timestamp) }}
				</span>
				<span>
					<span
						class="font-weight-bold"
						:class="
							item.sender !== 'Ms Pacman'
								? 'purple--text text--lighten-3'
								: 'red--text'
						"
					>{{ item.sender }}:&nbsp;
					</span>
					<span> {{ item.message }}</span>
				</span>
			</p>
			<p class="black--text" hidden>
				end
			</p>
		</div>
		<div class="chat-input px-4 mb-4">
			<div v-if="userData && userData.displayName" class="py-0 mt-sm">
				<p v-if="commandsMode">
					Typing
					<span class="purple--text text--lighten-3 font-weight-bold">commands
					</span>
				</p>
				<p v-else>
					Sending messages as
					<span class="purple--text text--lighten-3 font-weight-bold">{{
						userData.displayName
					}}</span>
				</p>
			</div>
			<div v-else class="py-0 mt-sm">
				<p>Chat is disabled. Please log in.</p>
			</div>
			<div class="py-0">
				<v-text-field
					v-model="chatMessage"
					placeholder="Say something..."
					solo
					outlined
					hide-details
					append-icon="mdi-send"
					:disabled="!(userData && userData.displayName)"
					:rules="[rule]"
					color="purple lighten-3"
					@click:append="sendMessage"
					@keyup.enter="sendMessage"
					@keyup="checkCommandsMode"
				/>
			</div>
			<div class="py-0 mt-6">
				<control-component :user-data="userData" :commands="commands" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { HelixPrivilegedUser } from '@twurple/api/lib'
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import {
	getDisplayTime,
	getTimeInDifferentTZ,
	isSameDay,
	isSameYear,
	mapCommands,
	mapMonth
} from '~/utils/pacman.function'
import { ChatMessage } from '~/utils/pacman.interface'

@Component
export default class UserComponent extends Vue {
	@Prop({ required: true }) commands!: any
	@Prop() userData!: HelixPrivilegedUser
	public rule = (value: string) => value.length <= 40
	public chatMessage: string = ''
	public chatHistory: ChatMessage[] = []
	public chatCooldown: boolean = false
	public commandsMode: boolean = false
	public toggleLdboard: boolean = false

	mounted () {
		this.scrollToBottom()
		this.fetchChatHistory()
	}

	public async sendMessage () {
		if (this.chatMessage && this.chatMessage.length <= 40) {
			if (this.chatMessage.startsWith('/')) {
				const extractedCmd = mapCommands(this.chatMessage)
				if (extractedCmd) {
					const messageRef = this.$fire.database.ref('commands')
					await messageRef.push({
						...extractedCmd,
						timestamp: getTimeInDifferentTZ('UTC'),
						sender: this.userData.displayName
					})
				} else {
					alert('Invalid command.')
				}
				this.chatMessage = ''
			} else {
				const messageRef = this.$fire.database.ref('chats')
				const message: ChatMessage = {
					message: this.chatMessage,
					sender: this.userData.displayName,
					timestamp: getTimeInDifferentTZ('UTC')
				}
				await messageRef.push(message)
				this.chatMessage = ''
			}
		}
	}

	public displayTimestamp (timestamp: string) {
		const date = new Date(timestamp + ' UTC')
		const today = new Date()
		if (isSameDay(date, today)) {
			return getDisplayTime(date)
		} else if (isSameYear(date, today)) {
			return mapMonth(date.getMonth()) + ' ' + date.getDate()
		}
		return 'n.d.'
	}

	public checkCommandsMode () {
		this.commandsMode = this.chatMessage.startsWith('/')
	}

	private async fetchChatHistory () {
		const messageRef = this.$fire.database.ref('chats')
		await messageRef.on('value', (snap: any) => {
			const val = snap.val()
			this.chatHistory = Object.keys(val).map(k => val[k])
			setTimeout(() => this.scrollToBottom(), 100)
		})
	}

	private scrollToBottom () {
		const element = document.getElementById('msgContainer')
		if (element) {
			element.scrollTop = element.scrollHeight
		}
	}
}
</script>

<style lang="scss" scoped>
.chat-background {
	height: 100%;
	position: relative;
	border: #ce93d8 solid 2px;
	border-right: none;
	border-bottom: none;

	.chat-header {
		position: relative;

		.chat-toggle-btn {
			position: absolute;
			top: 0;
			right: 0;
		}
	}

	.chat-display {
		height: calc(100vh - 374px);
		height: -moz-calc(100vh - 374px);
		height: -webkit-calc(100vh - 374px);
		overflow-y: scroll;
		overflow-x: hidden;
		margin-bottom: 20px;
	}

	.chat-input {
		width: 100%;
		position: relative;
		bottom: 0;
	}

	.chat-message {
		position: relative;
		width: 100%;
		margin: 0;
		word-wrap: break-word;
	}

	.chat-timestamp {
		display: inline-block;
		min-width: 50px;
	}
}

@media only screen and (max-width: 1140px) {
	.chat-header .chat-toggle-btn {
		display: none;
	}
}

@media only screen and (max-width: 959px) {
	.chat-display {
		display: none;
	}

	.chat-input .mt-sm {
		margin-top: 20px;
	}
}

::-webkit-scrollbar {
	background: none;
	width: 5px;
}

::-webkit-scrollbar-thumb {
	background: #ce93d8;
	border-radius: 10px;
}
</style>
