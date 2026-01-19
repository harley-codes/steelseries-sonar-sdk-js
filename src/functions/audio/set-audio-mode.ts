import type { AudioMode } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import { changeAudioMode } from '@/sonar/requests/mode/change-audio-mode'

/**
 * Gets audio data for all channels.
 * @param sonarEndpoint Sonar endpoint URL
 * @param audioMode Target audio mode
 * @returns classic or streamer mode
 */
export async function setAudioMode(sonarEndpoint: string, audioMode: AudioMode): Promise<AudioMode> {
	let response: Response

	try {
		response = await changeAudioMode(sonarEndpoint, audioMode)
	} catch (error) {
		throw new SonarRequestException({ innerException: error as Error })
	}

	if (response.ok) {
		const data = await response.json()
		if (data !== audioMode) {
			throw new SonarRequestException({ message: 'Returned audio mode does not match requested mode' })
		}
		return data as AudioMode
	} else {
		const data = await response.text()
		throw new SonarRequestException({ innerException: new Error(data) })
	}
}
