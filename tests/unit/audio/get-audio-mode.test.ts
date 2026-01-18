import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { AudioMode } from '@/enums'
import { SonarServerException } from '@/exceptions'
import { getAudioMode } from '@/functions/audio/get-audio-mode'

let originalFetch: typeof fetch

const request = () => getAudioMode('https://localhost')

describe('getAudioMode', () => {
	beforeEach(() => {
		originalFetch = globalThis.fetch
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('throws SonarException when response not 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: false,
				text: async () => 'Some error occurred'
			}) as Response) as unknown as typeof fetch

		expect(request()).rejects.toThrow(SonarServerException)
	})

	it('throws SonarException when response 200 but not data', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({})
			}) as Response) as unknown as typeof fetch

		expect(request()).rejects.toThrow(SonarServerException)
	})

	it('return classic when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => AudioMode.Classic
			}) as Response) as unknown as typeof fetch

		expect(request()).resolves.toBe(AudioMode.Classic)
	})

	it('return streamer when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => AudioMode.Streamer
			}) as Response) as unknown as typeof fetch

		expect(request()).resolves.toBe(AudioMode.Streamer)
	})
})
