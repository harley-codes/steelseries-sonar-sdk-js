export function convertVolumeToApi(value: number): number {
	const formattedValue = value / 100
	const clampedValue = Math.min(Math.max(formattedValue, 0), 1)
	return clampedValue
}
