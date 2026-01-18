export async function changeChatMixBalance(sonarEndpoint: string, chatBalance: number) {
	const url = new URL(`${sonarEndpoint}/chatMix?balance=${chatBalance}`)
	return await fetch(url, {
		method: 'PUT'
	})
}
