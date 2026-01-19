import type { DeviceDataFlow } from '@/sonar/models/audio-settings/enums/device-data-flow'
import type { DeviceDefaultRoles } from '@/sonar/models/audio-settings/enums/device-default-roles'
import type { DeviceRole } from '@/sonar/models/audio-settings/enums/device-role'
import type { DeviceState } from '@/sonar/models/audio-settings/enums/device-state'

export type AudioDevice = {
	id: string
	friendlyName: string
	dataFlow: DeviceDataFlow
	role: DeviceRole
	channels: number
	defaultRole: DeviceDefaultRoles
	fwUpdateRequired: boolean
	state: DeviceState
	/** `true` if {@link DeviceRole} ≠ {@link DeviceRole.None} */
	isVad: boolean
}
