import type { VolumeFormat } from '@/enums'

export type AudioDataClassic = {
	master: ChannelAudioDataClassic
	game?: ChannelAudioDataClassic
	chat?: ChannelAudioDataClassic
	media?: ChannelAudioDataClassic
	aux?: ChannelAudioDataClassic
	mic?: ChannelAudioDataClassic
	volumeFormat: VolumeFormat
}

export type ChannelAudioDataClassic = {
	volume: number
	isMuted: boolean
}
