import type { ChatMixState } from '@/sonar/models/audio-settings/enums/chat-mix-state'

export type ChatMixData = {
	balance: number
	state: ChatMixState
}
