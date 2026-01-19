import { DeviceFlow } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import type { AudioDevice as SonarAudioDevice } from '@/sonar/models/audio-settings/audio-device'
import { DeviceDataFlow } from '@/sonar/models/audio-settings/enums/device-data-flow'
import { requestAudioDevices } from '@/sonar/requests/audio-devices/request-audio-devices'
import type { AudioDevice } from '@/types/audio-device'

export async function getAudioDevices(sonarEndpoint: string, deviceType?: DeviceFlow): Promise<AudioDevice[]> {
	let response: Response

	try {
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
		response = await requestAudioDevices(sonarEndpoint, { deviceDataFlow, removeSteelSeriesVAD: true })
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
