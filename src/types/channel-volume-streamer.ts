import type { StreamerPath } from '@/enums'
import type { ChannelVolumeStreamerPath } from '@/types/channel-volume-streamer-path'

export type ChannelVolumeStreamer = {
	[K in StreamerPath]: ChannelVolumeStreamerPath
}
