import { describe, expect, it } from 'bun:test'
import { getEndpointEndToEnd } from 'tests/helpers/get-endpoint-e2e'
import { DeviceChannel } from '@/enums'
import { setAudioDevice } from '@/functions/devices/set-audio-device'

const OUTPUT_DEVICE_ID = '{0.0.0.00000000}.{0e5b2eb2-8d10-4e5f-b757-59a3e15def98}'
const INPUT_DEVICE_ID = '{0.0.1.00000000}.{7b82ae46-28f8-4adb-bdd2-fa08863bc5b7}'

describe('setAudioDevice', () => {
	it('throws when input set to output', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		expect(setAudioDevice(sonarEndpoint, DeviceChannel.Mic, OUTPUT_DEVICE_ID)).rejects.toThrow()
	})

	it('returns set audio devices for all output', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await setAudioDevice(sonarEndpoint, DeviceChannel.Output, OUTPUT_DEVICE_ID)
		console.warn(result)
		expect(result.length).toBe(4)
	})

	it('returns set audio device for output-aux', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await setAudioDevice(sonarEndpoint, DeviceChannel.Aux, OUTPUT_DEVICE_ID)
		expect(result.length).toBe(1)
	})

	it('returns set audio device for input', async () => {
		const sonarEndpoint = await getEndpointEndToEnd()
		const result = await setAudioDevice(sonarEndpoint, DeviceChannel.Mic, INPUT_DEVICE_ID)
		expect(result.length).toBe(1)
	})
})
