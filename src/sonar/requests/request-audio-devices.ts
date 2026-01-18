import type { DeviceDataFlow } from '@/sonar/models/audio-settings/enums/device-data-flow'

type Params = {
	deviceDataFlow?: DeviceDataFlow
	onlySteelSeriesVAD?: boolean
	removeSteelSeriesVAD?: boolean
}

export async function requestAudioDevices(sonarEndpoint: string, params: Params): Promise<Response> {
	const { deviceDataFlow, onlySteelSeriesVAD = false, removeSteelSeriesVAD = false } = params

	const url = new URL(`${sonarEndpoint}/audioDevices`)
	url.searchParams.append('onlySteelSeriesVAD', String(onlySteelSeriesVAD))
	url.searchParams.append('removeSteelSeriesVAD', String(removeSteelSeriesVAD))
	if (deviceDataFlow !== undefined) {
		url.searchParams.append('deviceDataFlow', deviceDataFlow.toString())
	}
	return await fetch(url)
}
