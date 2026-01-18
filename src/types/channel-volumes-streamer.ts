import type { AudioChannel } from '@/enums'
import type { ChannelVolumeStreamer } from '@/types/channel-volume-streamer'

export type ChannelVolumesStreamer = {
	[AudioChannel.Master]: ChannelVolumeStreamer
} & {
	[K in AudioChannel]?: ChannelVolumeStreamer
}
