import { FETCH_OPTIONS_PUT } from '@/consts/fetch-options-put'
import type { AudioMode } from '@/enums'
import { SonarException } from '@/exceptions'

const DEFAULT_ERROR_TEXT = 'Failed to set audio mode.'

/**
 * Gets audio data for all channels.
 * @param sonarEndpoint Sonar endpoint URL
 * @param audioMode Target audio mode
 * @returns classic or streamer mode
 */
export async function setAudioMode(sonarEndpoint: string, audioMode: AudioMode): Promise<AudioMode> {
	let response: Response

	try {
		response = await fetch(`${sonarEndpoint}/mode/${audioMode}`, FETCH_OPTIONS_PUT)
	} catch (error) {
		throw new SonarException(DEFAULT_ERROR_TEXT, error as Error)
	}

	if (response.ok) {
		const data = await response.json()
		if (data !== audioMode) {
			throw new SonarException(`${DEFAULT_ERROR_TEXT} Expected mode to be '${audioMode}', but currently '${data}'.`)
		}
		return data as AudioMode
	} else {
		const data = await response.text()
		throw new SonarException(DEFAULT_ERROR_TEXT, new Error(data))
	}
}
