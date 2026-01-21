import { SonarRequestException } from '@/exceptions'
import type { SonarChannel } from '@/sonar/models/audio-settings/enums/sonar-channel'
import type { StreamingPath } from '@/sonar/models/audio-settings/enums/streaming-path'
import type { VolumeSettingsStreamer } from '@/sonar/models/audio-settings/volume-settings-streamer'

export async function changeVolumeMuteStreamer(
	sonarEndpoint: string,
	isMuted: boolean,
	deviceRole: SonarChannel,
	path: StreamingPath
): Promise<VolumeSettingsStreamer> {
	let response: Response
	try {
		const url = new URL(`${sonarEndpoint}/volumeSettings/streamer/${path}/${deviceRole}/isMuted/${isMuted}`)
		response = await fetch(url, { method: 'PUT' })
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
