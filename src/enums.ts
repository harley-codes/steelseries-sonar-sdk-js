export enum SonarChannel {
	Master = 'master',
	Game = 'game',
	Chat = 'chatRender',
	Media = 'media',
	Aux = 'aux',
	Mic = 'chatCapture'
}

export enum AudioChannel {
	Master = 'master',
	Game = 'game',
	Chat = 'chat',
	Media = 'media',
	Aux = 'aux',
	Mic = 'mic'
}

export enum StreamerPath {
	Streaming = 'streaming',
	Monitoring = 'monitoring'
}

export enum AudioMode {
	Classic = 'classic',
	Streamer = 'stream'
}

export enum ChatMixState {
	Enabled = 'enabled',
	FiniteWheel = 'finiteWheel',
	DifferentDeviceSelected = 'differentDeviceSelected',
	NoDeviceSelected = 'noDeviceSelected'
}
