import { AudioMode } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import { requestAudioMode } from '@/sonar/requests/mode/request-audio-mode'

/**
 * Gets audio data for all channels.
 * @param sonarEndpoint Sonar endpoint URL
 * @returns classic or streamer mode
 */
export async function getAudioMode(sonarEndpoint: string): Promise<AudioMode> {
	let response: Response

	try {
		response = await requestAudioMode(sonarEndpoint)
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
