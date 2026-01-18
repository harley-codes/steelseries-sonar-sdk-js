export async function requestAudioMode(sonarEndpoint: string) {
	const url = new URL(`${sonarEndpoint}/mode`)
	return await fetch(url)
}
