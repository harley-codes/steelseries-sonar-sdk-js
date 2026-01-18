import type { AudioChannel } from '@/enums'
import type { ChannelVolumeClassic } from '@/types/channel-volume-classic'

export type ChannelVolumesClassic = {
	[AudioChannel.Master]: ChannelVolumeClassic
} & {
	[K in Exclude<AudioChannel, 'master'>]?: ChannelVolumeClassic
}
