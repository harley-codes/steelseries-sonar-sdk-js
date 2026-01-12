export type VolumeDataStreamer = {
	masters: ChannelDataStreamer
	devices: {
		game?: ChannelDataStreamer
		chatRender?: ChannelDataStreamer
		chatCapture?: ChannelDataStreamer
		media?: ChannelDataStreamer
		aux?: ChannelDataStreamer
	}
}

export type ChannelDataStreamer = {
	stream: {
		streaming: {
			volume: number
			isMuted: boolean
		}
		monitoring: {
			volume: number
			isMuted: boolean
		}
	}
}
