/** convert [0 to 100] to [-1 to 1] */
export function convertChatMixBalanceToApi(balance: number): number {
	let result = (balance / 100) * 2 - 1
	result = Math.min(Math.max(result, -1), 1)
	return result
}
