import type { DeviceChannel } from '@/enums'

export type ChangedDevice = {
	deviceId: string
	deviceChannel: Exclude<DeviceChannel, DeviceChannel.Output>
	isRunning: boolean
}
