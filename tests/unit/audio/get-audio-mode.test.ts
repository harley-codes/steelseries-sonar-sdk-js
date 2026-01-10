import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { AudioMode } from '@/enums'
import { SonarException } from '@/exceptions'
import { getAudioMode } from '@/functions/audio/get-audio-mode'

let originalFetch: typeof fetch

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

		expect(getAudioMode('')).rejects.toThrow(SonarException)
	})

	it('throws SonarException when response 200 but not data', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => ({})
			}) as Response) as unknown as typeof fetch

		expect(getAudioMode('')).rejects.toThrow(SonarException)
	})

	it('return classic when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => AudioMode.Classic
			}) as Response) as unknown as typeof fetch

		expect(getAudioMode('')).resolves.toBe(AudioMode.Classic)
	})

	it('return streamer when response 200', async () => {
		globalThis.fetch = (async () =>
			({
				ok: true,
				json: async () => AudioMode.Streamer
			}) as Response) as unknown as typeof fetch

		expect(getAudioMode('')).resolves.toBe(AudioMode.Streamer)
	})
})
