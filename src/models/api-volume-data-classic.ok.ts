export type VolumeDataClassic = {
	masters: {
		classic: ChannelDataClassic
	}
	devices: {
		game?: ChannelDataClassic
		chatRender?: ChannelDataClassic
		chatCapture?: ChannelDataClassic
		media?: ChannelDataClassic
		aux?: ChannelDataClassic
	}
}

export type ChannelDataClassic = {
	volume: number
	isMuted: boolean
}
