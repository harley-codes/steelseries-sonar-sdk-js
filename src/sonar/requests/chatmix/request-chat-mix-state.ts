export async function requestChatMixState(sonarEndpoint: string) {
	const url = new URL(`${sonarEndpoint}/chatMix`)
	return await fetch(url)
}
