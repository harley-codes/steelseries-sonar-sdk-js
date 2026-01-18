import type { VolumeInfoStreamer } from '@/sonar/models/audio-settings/volume-info-streamer'

export type VolumeSettingsStreamer = {
	masters: {
		stream: VolumeInfoStreamer
	}
	devices: Record<
		string,
		{
			stream: VolumeInfoStreamer
		}
	>
}
