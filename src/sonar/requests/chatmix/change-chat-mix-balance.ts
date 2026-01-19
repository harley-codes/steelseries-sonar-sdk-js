import { SonarRequestException } from '@/exceptions'
import type { ChatMixData } from '@/sonar/models/audio-settings/chatmix-data'

export async function changeChatMixBalance(sonarEndpoint: string, chatBalance: number) {
	const url = new URL(`${sonarEndpoint}/chatMix?balance=${chatBalance}`)
	let response: Response
	try {
		response = await fetch(url, {
			method: 'PUT'
		})
	} catch (error) {
		throw new SonarRequestException({ innerException: error as Error })
	}

	if (response.ok) {
		const data = (await response.json()) as ChatMixData
		if (data?.balance == null || data?.state == null) {
			throw new SonarRequestException({ message: 'Missing required data in response' })
		}
		return data
	} else {
		const data = (await response.json()) as { Message?: string }
		throw new SonarRequestException({ message: data.Message })
	}
}
