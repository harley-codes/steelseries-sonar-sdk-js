import type { AudioMode } from '@/enums'
import { SonarServerException } from '@/exceptions'
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
		throw new SonarServerException({ cause: error as Error })
	}

	if (response.ok) {
		const data = await response.json()
		if (data !== audioMode) {
			throw new SonarServerException({ message: 'Returned audio mode does not match requested mode' })
		}
		return data as AudioMode
	} else {
		const data = await response.text()
		throw new SonarServerException({ cause: new Error(data) })
	}
}
