/**
 * Sonar audio mixing channels.
 * @property {@link AudioChannel.Master} - Master volume channel.
 * @property {@link AudioChannel.Game} - Game audio channel.
 * @property {@link AudioChannel.Chat} - Chat audio channel.
 * @property {@link AudioChannel.Media} - Media audio channel.
 * @property {@link AudioChannel.Aux} - Auxiliary audio channel.
 * @property {@link AudioChannel.Mic} - Microphone audio channel.
 */
export enum AudioChannel {
	Master = 'master',
	Game = 'game',
	Chat = 'chat',
	Media = 'media',
	Aux = 'aux',
	Mic = 'mic'
}

/**
 * Sonar Streamer Mode path.
 * @property {@link StreamerPath.Streaming} - What the audience will hear.
 * @property {@link StreamerPath.Monitoring} - What the owner will hear.
 */
export enum StreamerPath {
	Streaming = 'streaming',
	Monitoring = 'monitoring'
}

/**
 * Sonar mixing state.
 * @property {@link AudioMode.Classic} - Basic mixing.
 * @property {@link AudioMode.Streamer} - Advanced mixing - has stream/monitor path each channel.
 */
export enum AudioMode {
	Classic = 'classic',
	Streamer = 'stream'
}

/**
 * The state of CHATMIX availability.
 * @property {@link ChatMixState.Enabled} - CHATMIX is enabled and available.
 * @property {@link ChatMixState.FiniteWheel} - CHATMIX is available but the user cannot interact with it via software.
 * @property {@link ChatMixState.DifferentDeviceSelected} - CHATMIX is unavailable because a different output device is selected.
 * @property {@link ChatMixState.NoDeviceSelected} - CHATMIX is unavailable because no output device is selected.
 */
export enum ChatMixState {
	Enabled = 'enabled',
	FiniteWheel = 'finiteWheel',
	DifferentDeviceSelected = 'differentDeviceSelected',
	NoDeviceSelected = 'noDeviceSelected'
}

/**
 * Type of audio device.
 * @property {@link DeviceFlow.Output} - Device used to render audio (e.g. speakers, headphones).
 * @property {@link DeviceFlow.Input} - Device used to capture audio (e.g. microphones).
 */
export enum DeviceFlow {
	Output = 'output',
	Input = 'input'
}
