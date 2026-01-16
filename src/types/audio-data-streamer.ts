import type { AudioChannel } from '@/enums'

export type AudioDataStreamer = {
	[K in AudioChannel]?: ChannelAudioDataStreamer
}

export type ChannelAudioDataStreamer = {
	volumeStreamer: number
	volumeMonitoring: number
	isMutedStreamer: boolean
	isMutedMonitoring: boolean
}

export type StreamVolume = {
	volume: number
	isMuted: boolean
}
