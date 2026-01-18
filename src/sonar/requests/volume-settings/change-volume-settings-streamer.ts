import { SonarServerException } from '@/exceptions'
import type { SonarChannel } from '@/sonar/models/audio-settings/enums/sonar-channel'
import type { StreamingPath } from '@/sonar/models/audio-settings/enums/streaming-path'
import type { VolumeSettingsStreamer } from '@/sonar/models/audio-settings/volume-settings-streamer'

export async function changeVolumeSettingsStreamer(
	sonarEndpoint: string,
	volume: number,
	channel: SonarChannel,
	path: StreamingPath
): Promise<VolumeSettingsStreamer> {
	let response: Response
	try {
		const url = new URL(`${sonarEndpoint}/volumeSettings/streamer/${path}/${channel}/volume/${volume}`)
		response = await fetch(url, { method: 'PUT' })
	} catch (error) {
		throw new SonarServerException({ cause: error as Error })
	}
	if (response.ok) {
		const data = (await response.json()) as VolumeSettingsStreamer
		if (data?.masters?.stream == null) {
			throw new SonarServerException({ cause: new Error('Missing required data in response.') })
		}
		return data
	} else {
		const data = (await response.json()) as { error: string }
		throw new SonarServerException({ cause: new Error(data?.error ?? data) })
	}
}
