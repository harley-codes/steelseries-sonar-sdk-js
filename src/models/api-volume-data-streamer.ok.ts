export type ApiVolumeDataStreamer = {
	masters: ApiChannelDataStreamer
	devices: {
		game?: ApiChannelDataStreamer
		chatRender?: ApiChannelDataStreamer
		chatCapture?: ApiChannelDataStreamer
		media?: ApiChannelDataStreamer
		aux?: ApiChannelDataStreamer
	}
}

export type ApiChannelDataStreamer = {
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
