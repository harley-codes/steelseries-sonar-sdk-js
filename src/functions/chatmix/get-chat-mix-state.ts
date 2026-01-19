import { ChatMixState } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import { convertChatMixBalanceToUser } from '@/functions/converters/convert-chat-mix-balance-to-user'
import type { ChatMixData as SonarChatMixData } from '@/sonar/models/audio-settings/chatmix-data'
import { requestChatMixState } from '@/sonar/requests/chatmix/request-chat-mix-state'
import type { ChatMixData } from '@/types/chat-mix-data'

/**
 * Gets CHATMIX state and data.
 * @param sonarEndpoint Sonar endpoint URL
 * @returns balance as 0 - 100,
 */
export async function getChatMixState(sonarEndpoint: string): Promise<ChatMixData> {
	let response: Response

	try {
		response = await requestChatMixState(sonarEndpoint)
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
		const data = await response.text()
		throw new SonarRequestException({ innerException: new Error(data) })
	}
}
