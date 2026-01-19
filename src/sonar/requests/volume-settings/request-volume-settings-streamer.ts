import { SonarRequestException } from '@/exceptions'
import type { VolumeSettingsStreamer } from '@/sonar/models/audio-settings/volume-settings-streamer'

export async function requestVolumeSettingsStreamer(sonarEndpoint: string): Promise<VolumeSettingsStreamer> {
	let response: Response
	try {
		const url = new URL(`${sonarEndpoint}/volumeSettings/streamer`)
		response = await fetch(url)
	} catch (error) {
		throw new SonarRequestException({ innerException: error as Error })
	}
	if (response.ok) {
		const data = (await response.json()) as VolumeSettingsStreamer
		if (data?.masters?.stream == null) {
			throw new SonarRequestException({ innerException: new Error('Missing required data in response.') })
		}
		return data
	} else {
		const data = (await response.json()) as { error: string }
		throw new SonarRequestException({ innerException: new Error(data?.error ?? data) })
	}
}
