import type { DeviceDataFlow } from '@/sonar/models/audio-settings/enums/device-data-flow'
import type { DeviceDefaultRoles } from '@/sonar/models/audio-settings/enums/device-default-roles'
import type { DeviceRole } from '@/sonar/models/audio-settings/enums/device-role'
import type { State } from '@/sonar/models/audio-settings/enums/state.enum'

export type AudioDevice = {
	id: string
	friendlyName: string
	dataFlow: DeviceDataFlow
	role: DeviceRole
	channels: number
	defaultRole: DeviceDefaultRoles
	fwUpdateRequired: boolean
	state: State
	/** `true` if {@link DeviceRole} ≠ {@link DeviceRole.None} */
	isVad: boolean
}
