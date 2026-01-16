export type ApiVolumeDataClassic = {
	masters: {
		classic: ApiChannelDataClassic
	}
	devices: {
		game?: ApiChannelDataClassic
		chatRender?: ApiChannelDataClassic
		chatCapture?: ApiChannelDataClassic
		media?: ApiChannelDataClassic
		aux?: ApiChannelDataClassic
	}
}

export type ApiChannelDataClassic = {
	volume: number
	isMuted: boolean
}
