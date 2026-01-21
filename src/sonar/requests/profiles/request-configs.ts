import { SonarRequestException } from '@/exceptions'
import type { Config } from '@/sonar/models/config/config'
import type { VirtualAudioDevice } from '@/sonar/models/config/enums/VirtualAudioDevice'

export async function requestConfigs(sonarAddress: string, channel: VirtualAudioDevice): Promise<Config[]> {
	let response: Response

	try {
		response = await fetch(`${sonarAddress}/configs?vad=${channel}`)
	} catch (error) {
		throw new SonarRequestException({ innerException: error as Error })
	}

	if (response.ok) {
		const data = (await response.json()) as Config[]
		if (!Array.isArray(data)) {
			throw new SonarRequestException({ message: 'Missing required data in response' })
		}
		return data
	} else {
		const data = (await response.json()) as { error: string }
		throw new SonarRequestException({ innerException: new Error(data?.error ?? data) })
	}
}
