# SteelSeries Sonar SDK [![Tests](https://github.com/harley-codes/steelseries-sonar-sdk-js/actions/workflows/tests.yml/badge.svg)](https://github.com/harley-codes/steelseries-sonar-sdk-js/actions/workflows/tests.yml) [![Codecov](https://codecov.io/github/harley-codes/steelseries-sonar-sdk-js/graph/badge.svg?token=TBF8WTZ19B)](https://codecov.io/github/harley-codes/steelseries-sonar-sdk-js)

An SDK for interacting with the SteelSeries Sonar software.

## How It Works
When Sonar is installed via the SteelSeries GG software - it exposes an API on localhost. The port used is unique every time Sonar is started up. This means the lifecycle of the port can change while you computer is running; depending on logout, app-crash, etc. An entry point in the GG software exposes a second endpoint in the users app data, this endpoint does not change and can be used to get the active endpoint for Sonar.

The SDK provides methods for getting the active Sonar endpoint, along with various wrapper functions to simplify the request/response payloads, along with QOL preferences.

## Credit
Building this SDK would not have been as simple without the work of [wex/sonar-rev](https://github.com/wex/sonar-rev). Their work on reverse engineering how Sonar works was paramount.

## Known Limitation
Changes made with this SDK are not immediately visible in the SteelSeries GG software. Both the SDK and GG software communicate directly with the Sonar Service API, but the GG UI does not do any polling to auto-refresh when changes are made externally. To see the latest state in GG, you must close and reopen the GG window.

_I don't think this will matter to anybody - but feel obliged to mention it._

## SDK Usage

#### **Initialize**
Get the GG endpoint, then get the Sonar endpoint. Getting the Sonar endpoint request can optionally be cached to assist with certain types of application environments. When using the cached option, if an attempt to get the Sonar endpoint fails, the cache timeout will be reset.

```typescript
const appEndpoint = await getAppEndpoint()
const sonarEndpoint = await getSonarEndpoint(appEndpoint)
const sonarEndpoint = await getSonarEndpointCached(appEndpoint, 60 = default)
```

#### **Audio Mode**
Sonar can be running in either classic or streamer mode. Depending on this factor, you will need to use different methods when setting or retrieving audio.
```typescript
const mode = await getAudioMode(sonarEndpoint)
const mode = await setAudioMode(sonarEndpoint, AudioMode.Classic)
```

#### **Audio Data - Classic**
Get the audio data for Sonar when in classic mode.
```typescript
// GET
const audioData = await getAudioDataClassic(sonarEndpoint)
const auxData = audioData[AudioChannel.Aux]
// SET
const auxData = await setChannelVolumeClassic(sonarEndpoint, 75, AudioChannel.Aux)
const auxData = await setChannelMuteClassic(sonarEndpoint, false, AudioChannel.Aux)
```

#### **Audio Data - Streamer**
Get the audio data for Sonar when in streamer mode. Different to classic, the volume data is nested deeper into a division of 'Streaming' and 'Monitoring'.
```typescript
// GET
const audioData = await getAudioDataStream(sonarEndpoint)
const auxMonitoringData = audioData
	[AudioChannel.Aux]
	[StreamerPath.Monitoring]
// SET
const auxData = await setChannelVolumeStreamer(
	sonarEndpoint, 75,
	AudioChannel.Aux,
	StreamerPath.Monitoring)
const auxData = await setChannelMuteStreamer(
	sonarEndpoint, false,
	AudioChannel.Aux,
	StreamerPath.Monitoring)
```

#### **CHATMIX**
You can change the balance between game, and chat output volume. This requires that CHATMIX is available. If the CHATMIX is being controlled via a Sonar DAC for example, it is not available to be changed via software and will throw an exception.
```typescript
// GET
const chatmixData = await getChatMixState(sonarEndpoint)
// SET
if (chatmixData.state == ChatMixState.Enabled){
	const chatmixData = await setChatMixState(sonarEndpoint, 75)
}
```

#### **Audio Devices**
You can get all available audio hardware, and set specific channels to use that device. Additionally you can also target all output channels when passing the target channel parameter.
```typescript
// GET
const allDevices = getAudioDevices(sonarEndpoint)
const outputDevices = getAudioDevices(sonarEndpoint, DeviceFlow.Output)
// SET
const updatedChannel = setAudioDevice(
	sonarEndpoint,
	DeviceChannel.Output,
	outputDevices[0].id)
```

#### **EQ/Config Profiles**
Configuration make up all the settings when changing options in a specified channel. This can be useful to switch out EQ balances. When setting a profile, you only need an ID as each profile is unique to Channel.
```typescript
// GET
const selectedProfiles = getSelectedProfiles(sonarEndpoint)
const selectedAuxProfile = currentProfiles.find(x => x.Channel === ProfileChannel.Aux)
const favoriteAuxProfiles = getChannelProfiles(sonarEndpoint, ProfileChannel.Aux, true)
// SET
const selectedAuxProfile = setSelectedProfile(sonarEndpoint, favoriteAuxProfiles[0].id)
```

#### **Exception Handling**
Exceptions are broken up into initialization and requests.

`SonarInitializationException` provides a reason to easily determine if it failed to get the config, or if there is an issue with Sonar.
```typescript
catch(error){
	if(error instanceof SonarInitializationException){
		console.error({
			error.message,
			error.reason,
			error.innerException
		})
	}
	if(error instanceof SonarRequestException){
		console.error({
			error.message,
			error.innerException
		})
	}
}
```
