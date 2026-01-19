import { ChatMixState } from '@/enums'
import { convertChatMixBalanceToApi } from '@/functions/converters/convert-chat-mix-balance-to-api'
import { convertChatMixBalanceToUser } from '@/functions/converters/convert-chat-mix-balance-to-user'
import { changeChatMixBalance } from '@/sonar/requests/chatmix/change-chat-mix-balance'
import type { ChatMixData } from '@/types/chat-mix-data'

/**
 * Set CHATMIX balance between audio(0%) and chat(100%).
 * @param sonarEndpoint Sonar endpoint URL
 * @param chatBalance Balance as 0 - 100,
 */
export async function setChatMixBalance(sonarEndpoint: string, chatBalance: number): Promise<ChatMixData> {
	const balance = convertChatMixBalanceToApi(chatBalance)
	const data = await changeChatMixBalance(sonarEndpoint, balance)

	const chatMixData: ChatMixData = {
		chatBalance: convertChatMixBalanceToUser(data.balance),
		state: data.state,
		isEnabled: data.state === ChatMixState.Enabled
	}
	return chatMixData
}
