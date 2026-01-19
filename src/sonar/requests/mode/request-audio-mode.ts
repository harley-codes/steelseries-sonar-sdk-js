import { SonarRequestException } from '@/exceptions'
import { AudioMode } from '@/sonar/models/audio-settings/enums/audio-mode'

export async function requestAudioMode(sonarEndpoint: string): Promise<AudioMode> {
	let response: Response
	const url = new URL(`${sonarEndpoint}/mode`)

	try {
		response = await fetch(url)
	} catch (error) {
		throw new SonarRequestException({ innerException: error as Error })
	}

	if (response.ok) {
		const data = (await response.json()) as AudioMode
		if (Object.values(AudioMode).includes(data)) {
			return data
		}
		throw new SonarRequestException({ message: 'Received unhandled audio mode from Sonar server' })
	} else {
		const data = await response.text()
		throw new SonarRequestException({ innerException: new Error(data) })
	}
}
