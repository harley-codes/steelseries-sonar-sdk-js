import type { VolumeInfoClassic } from '@/sonar/models/audio-settings/volume-info-classic'

export type VolumeSettingsClassic = {
	masters: {
		classic: VolumeInfoClassic
	}
	devices: Record<
		string,
		{
			classic: VolumeInfoClassic
		}
	>
}
