import { SonarRequestException } from '@/exceptions'
import type { AudioMode } from '@/sonar/models/audio-settings/enums/audio-mode'

export async function changeAudioMode(sonarEndpoint: string, audioMode: AudioMode): Promise<AudioMode> {
	let response: Response
	const url = new URL(`${sonarEndpoint}/mode/${audioMode}`)
	try {
		response = await fetch(url, {
			method: 'PUT'
		})
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
