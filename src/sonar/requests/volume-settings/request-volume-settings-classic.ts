import { SonarServerException } from '@/exceptions'
import type { VolumeSettingsClassic } from '@/sonar/models/audio-settings/volume-settings-classic'

export async function requestVolumeSettingsClassic(sonarEndpoint: string): Promise<VolumeSettingsClassic> {
	let response: Response
	try {
		const url = new URL(`${sonarEndpoint}/volumeSettings/classic`)
		response = await fetch(url)
	} catch (error) {
		throw new SonarServerException({ cause: error as Error })
	}
	if (response.ok) {
		const data = (await response.json()) as VolumeSettingsClassic
		if (data?.masters?.classic == null) {
			throw new SonarServerException({ cause: new Error('Missing required data in response.') })
		}
		return data
	} else {
		const data = (await response.json()) as { error: string }
		throw new SonarServerException({ cause: new Error(data?.error ?? data) })
	}
}
