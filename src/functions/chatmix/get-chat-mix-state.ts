import { ChatMixState } from '@/enums'
import { convertChatMixBalanceToUser } from '@/functions/converters/convert-chat-mix-balance-to-user'
import { requestChatMixState } from '@/sonar/requests/chatmix/request-chat-mix-state'
import type { ChatMixData } from '@/types/chat-mix-data'

/**
 * Gets CHATMIX state and data.
 * @param sonarEndpoint Sonar endpoint URL
 * @returns balance as 0 - 100,
 */
export async function getChatMixState(sonarEndpoint: string): Promise<ChatMixData> {
	const data = await requestChatMixState(sonarEndpoint)

	const chatMixData: ChatMixData = {
		chatBalance: convertChatMixBalanceToUser(data.balance),
		state: data.state,
		isEnabled: data.state === ChatMixState.Enabled
	}
	return chatMixData
}
