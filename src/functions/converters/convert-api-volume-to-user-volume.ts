import { VolumeFormat } from '@/enums'

export function convertApiVolumeToUserVolume(value: number, volumeFormat: VolumeFormat): number {
	switch (volumeFormat) {
		case VolumeFormat['0 to 100']: {
			const formattedValue = value * 100
			const clampedValue = Math.min(Math.max(formattedValue, 0), 100)
			return clampedValue
		}
		case VolumeFormat['0 to 1']: {
			const clampedValue = Math.min(Math.max(value, 0), 1)
			return clampedValue
		}
		default:
			return value
	}
}
