export function convertVolumeToApi(value: number): number {
	let result = value / 100
	result = Math.min(Math.max(result, 0), 1)
	return result
}
