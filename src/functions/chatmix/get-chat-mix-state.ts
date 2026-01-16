import { ChatMixState } from '@/enums'
import { SonarException } from '@/exceptions'
import { convertChatMixBalanceToUser } from '@/functions/converters/convert-chat-mix-balance-to-user'
import type { ApiChatMixData } from '@/models/api-chat-mix-data'
import type { ChatMixData } from '@/types/chat-mix-data'

const DEFAULT_ERROR_TEXT = 'Failed to get CHATMIX data.'

/**
 * Gets CHATMIX state and data.
 * @param sonarEndpoint Sonar endpoint URL
 * @returns balance as 0 - 100,
 */
export async function getChatMixState(sonarEndpoint: string): Promise<ChatMixData> {
	let response: Response

	try {
		response = await fetch(`${sonarEndpoint}/chatMix`)
	} catch (error) {
		throw new SonarException(DEFAULT_ERROR_TEXT, error as Error)
	}

	if (response.ok) {
		const data = (await response.json()) as ApiChatMixData
		if (data?.balance == null || data?.state == null) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Missing required data in response.`)
		}
		const chatMixData: ChatMixData = {
			chatBalance: convertChatMixBalanceToUser(data.balance),
			state: data.state,
			isEnabled: data.state === ChatMixState.Enabled
		}
		return chatMixData
	} else {
		const data = await response.text()
		throw new SonarException(DEFAULT_ERROR_TEXT, new Error(data))
	}
}
