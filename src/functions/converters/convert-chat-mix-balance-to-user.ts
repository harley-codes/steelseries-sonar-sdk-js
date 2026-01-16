/** convert [-1 to 1] to [0 to 100] */
export function convertChatMixBalanceToUser(balance: number): number {
	let result = ((balance + 1) / 2) * 100
	result = Math.floor(result)
	result = Math.min(Math.max(result, 0), 100)
	return result
}
