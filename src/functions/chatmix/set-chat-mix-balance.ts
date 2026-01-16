import { FETCH_OPTIONS_PUT } from '@/consts/fetch-options-put'
import { ChatMixState } from '@/enums'
import { SonarException } from '@/exceptions'
import { convertChatMixBalanceToApi } from '@/functions/converters/convert-chat-mix-balance-to-api'
import { convertChatMixBalanceToUser } from '@/functions/converters/convert-chat-mix-balance-to-user'
import type { ApiChatMixData } from '@/models/api-chat-mix-data'
import type { ChatMixData } from '@/types/chat-mix-data'

const DEFAULT_ERROR_TEXT = 'Failed to set CHATMIX balance.'

/**
 * Set CHATMIX balance between audio(0%) and chat(100%).
 * @param sonarEndpoint Sonar endpoint URL
 * @param chatBalance Balance as 0 - 100,
 */
export async function setChatMixBalance(sonarEndpoint: string, chatBalance: number): Promise<ChatMixData> {
	let response: Response

	try {
		const balance = convertChatMixBalanceToApi(chatBalance)
		response = await fetch(`${sonarEndpoint}/chatMix?balance=${balance}`, FETCH_OPTIONS_PUT)
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
		const data = (await response.json()) as { Message?: string }
		throw new SonarException(data?.Message ?? DEFAULT_ERROR_TEXT)
	}
}
