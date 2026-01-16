import { AudioMode } from '@/enums'
import { SonarException } from '@/exceptions'

const DEFAULT_ERROR_TEXT = 'Failed to get audio mode.'

/**
 * Gets audio data for all channels.
 * @param sonarEndpoint Sonar endpoint URL
 * @returns classic or streamer mode
 */
export async function getAudioMode(sonarEndpoint: string): Promise<AudioMode> {
	let response: Response

	try {
		response = await fetch(`${sonarEndpoint}/mode`)
	} catch (error) {
		throw new SonarException(DEFAULT_ERROR_TEXT, error as Error)
	}
	if (response.ok) {
		const data = (await response.json()) as AudioMode
		if (Object.values(AudioMode).includes(data)) {
			return data
		}
		throw new SonarException(DEFAULT_ERROR_TEXT)
	} else {
		const data = await response.text()
		throw new SonarException(DEFAULT_ERROR_TEXT, new Error(data))
	}
}
