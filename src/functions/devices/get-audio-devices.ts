import { DeviceFlow } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import { DeviceDataFlow } from '@/sonar/models/audio-settings/enums/device-data-flow'
import { requestAudioDevices } from '@/sonar/requests/audio-devices/request-audio-devices'
import type { AudioDevice } from '@/types/audio-device'

export async function getAudioDevices(sonarEndpoint: string, deviceType?: DeviceFlow): Promise<AudioDevice[]> {
	let deviceDataFlow: DeviceDataFlow
	switch (deviceType) {
		case DeviceFlow.Input:
			deviceDataFlow = DeviceDataFlow.Capture
			break
		case DeviceFlow.Output:
			deviceDataFlow = DeviceDataFlow.Render
			break
		case undefined:
			deviceDataFlow = DeviceDataFlow.All
			break
	}
	const data = await requestAudioDevices(sonarEndpoint, { deviceDataFlow, removeSteelSeriesVAD: true })

	const audioDevices: AudioDevice[] = data.map((device) => ({
		id: device.id,
		name: device.friendlyName,
		type: getDeviceTypeFromDataFlow(device.dataFlow)
	}))

	return audioDevices
}

function getDeviceTypeFromDataFlow(dataFlow: DeviceDataFlow): DeviceFlow {
	switch (dataFlow) {
		case DeviceDataFlow.Capture:
			return DeviceFlow.Input
		case DeviceDataFlow.Render:
			return DeviceFlow.Output
		default:
			throw new SonarRequestException({ message: `Unknown device data flow: ${dataFlow}` })
	}
}
