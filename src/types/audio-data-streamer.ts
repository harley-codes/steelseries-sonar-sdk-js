import type { VolumeFormat } from '@/enums'

export type AudioDataStreamer = {
	master: ChannelAudioDataStreamer
	game?: ChannelAudioDataStreamer
	chat?: ChannelAudioDataStreamer
	media?: ChannelAudioDataStreamer
	aux?: ChannelAudioDataStreamer
	mic?: ChannelAudioDataStreamer
	volumeFormat: VolumeFormat
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
