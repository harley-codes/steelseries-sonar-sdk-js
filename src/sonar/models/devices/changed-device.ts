import type { DeviceChannel } from '@/enums'

export type ChangedDevice = {
	id: Exclude<DeviceChannel, DeviceChannel.Output>
	deviceId: string
	isRunning: boolean
}
