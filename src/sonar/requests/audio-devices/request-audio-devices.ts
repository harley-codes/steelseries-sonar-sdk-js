import { SonarRequestException } from '@/exceptions'
import type { DeviceDataFlow } from '@/sonar/models/audio-settings/enums/device-data-flow'
import type { AudioDevice as SonarAudioDevice } from '@/sonar/models/devices/audio-device'

type Params = {
	deviceDataFlow?: DeviceDataFlow
	onlySteelSeriesVAD?: boolean
	removeSteelSeriesVAD?: boolean
}

export async function requestAudioDevices(sonarEndpoint: string, params: Params): Promise<SonarAudioDevice[]> {
	const { deviceDataFlow, onlySteelSeriesVAD = false, removeSteelSeriesVAD = false } = params

	const url = new URL(`${sonarEndpoint}/audioDevices`)
	url.searchParams.append('onlySteelSeriesVAD', String(onlySteelSeriesVAD))
	url.searchParams.append('removeSteelSeriesVAD', String(removeSteelSeriesVAD))
	if (deviceDataFlow !== undefined) {
		url.searchParams.append('deviceDataFlow', deviceDataFlow.toString())
	}

	let response: Response
	try {
		response = await fetch(url)
	} catch (error) {
		throw new SonarRequestException({
			innerException: error as Error
		})
	}

	if (!response.ok) {
		const error = await response.text()
		throw new SonarRequestException({ message: `Failed to get audio devices: ${error}` })
	}

	const data = (await response.json()) as SonarAudioDevice[]

	if (!Array.isArray(data)) {
		throw new SonarRequestException({ message: 'Invalid audio devices response format.' })
	}

	return data
}
