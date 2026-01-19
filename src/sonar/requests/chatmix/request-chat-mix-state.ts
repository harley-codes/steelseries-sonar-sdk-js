import { SonarRequestException } from '@/exceptions'
import type { ChatMixData } from '@/sonar/models/audio-settings/chatmix-data'

export async function requestChatMixState(sonarEndpoint: string): Promise<ChatMixData> {
	const url = new URL(`${sonarEndpoint}/chatMix`)
	let response: Response

	try {
		response = await fetch(url)
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
		const data = await response.text()
		throw new SonarRequestException({ innerException: new Error(data) })
	}
}
