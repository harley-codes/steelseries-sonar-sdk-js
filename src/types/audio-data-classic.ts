import type { AudioChannel } from '@/enums'

export type AudioDataClassic = {
	[K in AudioChannel]?: ChannelAudioDataClassic
}

export type ChannelAudioDataClassic = {
	volume: number
	isMuted: boolean
}
