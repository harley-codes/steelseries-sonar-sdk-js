import { ChatMixState } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import { convertChatMixBalanceToApi } from '@/functions/converters/convert-chat-mix-balance-to-api'
import { convertChatMixBalanceToUser } from '@/functions/converters/convert-chat-mix-balance-to-user'
import type { ChatMixData as SonarChatMixData } from '@/sonar/models/audio-settings/chatmix-data'
import { changeChatMixBalance } from '@/sonar/requests/chatmix/change-chat-mix-balance'
import type { ChatMixData } from '@/types/chat-mix-data'

/**
 * Set CHATMIX balance between audio(0%) and chat(100%).
 * @param sonarEndpoint Sonar endpoint URL
 * @param chatBalance Balance as 0 - 100,
 */
export async function setChatMixBalance(sonarEndpoint: string, chatBalance: number): Promise<ChatMixData> {
	let response: Response

	try {
		const balance = convertChatMixBalanceToApi(chatBalance)
		response = await changeChatMixBalance(sonarEndpoint, balance)
	} catch (error) {
		throw new SonarRequestException({ innerException: error as Error })
	}

	if (response.ok) {
		const data = (await response.json()) as SonarChatMixData
		if (data?.balance == null || data?.state == null) {
			throw new SonarRequestException({ message: 'Missing required data in response' })
		}
		const chatMixData: ChatMixData = {
			chatBalance: convertChatMixBalanceToUser(data.balance),
			state: data.state,
			isEnabled: data.state === ChatMixState.Enabled
		}
		return chatMixData
	} else {
		const data = (await response.json()) as { Message?: string }
		throw new SonarRequestException({ message: data.Message })
	}
}
