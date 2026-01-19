import type { DeviceChannel } from '@/enums'
import { SonarRequestException } from '@/exceptions'
import type { ChangedDevice } from '@/sonar/models/devices/changed-device'

export async function changeAudioDevice(
	sonarEndpoint: string,
	deviceChannel: DeviceChannel,
	deviceId: string
): Promise<ChangedDevice[]> {
	let response: Response
	const url = new URL(`${sonarEndpoint}/classicRedirections/${deviceChannel}/deviceId/${deviceId}`)

	try {
		response = await fetch(url, { method: 'PUT' })
	} catch (error) {
		throw new SonarRequestException({
			innerException: error as Error
		})
	}

	if (!response.ok) {
		const error = await response.text()
		throw new SonarRequestException({ message: `Failed to get audio devices: ${error}` })
	}

	const unknownData = (await response.json()) as ChangedDevice[] | ChangedDevice

	const data = Array.isArray(unknownData) ? unknownData : [unknownData]

	const devices = data.filter((x) => x?.deviceId === deviceId)

	if (devices.length === 0) {
		throw new SonarRequestException({ message: 'The changed audio devices list is empty.' })
	}

	return devices
}
