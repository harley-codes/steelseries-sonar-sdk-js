import type { DeviceChannel } from '@/enums'
import { changeAudioDevice } from '@/sonar/requests/audio-devices/change-audio-device'
import type { ChangedDevice } from '@/types/changed-device'

export async function setAudioDevice(
	sonarEndpoint: string,
	deviceChannel: DeviceChannel,
	deviceId: string
): Promise<ChangedDevice[]> {
	const data = await changeAudioDevice(sonarEndpoint, deviceChannel, deviceId)

	const result: ChangedDevice[] = data.map((x) => ({
		deviceId: x.deviceId,
		deviceChannel: x.id,
		isRunning: x.isRunning
	}))

	return result
}
