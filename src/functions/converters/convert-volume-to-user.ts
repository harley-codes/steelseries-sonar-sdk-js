export function convertVolumeToUser(value: number): number {
	let result = value * 100
	result = Math.min(Math.max(result, 0), 100)
	result = Math.floor(result)
	return result
}
