import { describe, expect, it, mock } from 'bun:test'
import { InitializeErrorReason, SonarInitializationException } from '../../../src/exceptions'
import { getAppEndpoint } from '../../../src/functions/endpoint/get-app-endpoint'

describe('getAppEndpoint', () => {
	it('throws Unsupported Exception on unsupported OS', async () => {
		mock.module('node:os', () => ({
			platform: () => 'linux'
		}))
		const rejects = expect(getAppEndpoint()).rejects
		rejects.toThrow(SonarInitializationException)
		rejects.toMatchObject({ reason: InitializeErrorReason.OSUnsupported })
	})

	it('throws BadConfig Exception when appData file does not exist', async () => {
		mock.module('node:os', () => ({
			platform: () => 'win32'
		}))
		mock.module('node:fs', () => ({
			promises: {
				readFile: async () => {
					throw new Error('File not found')
				}
			}
		}))
		const rejects = expect(getAppEndpoint()).rejects
		rejects.toThrow(SonarInitializationException)
		rejects.toMatchObject({ reason: InitializeErrorReason.BadConfig })
	})

	it('throws BadConfig Exception when appData file is invalid JSON', async () => {
		mock.module('node:os', () => ({
			platform: () => 'win32'
		}))
		mock.module('node:fs', () => ({
			promises: {
				readFile: async () => 'invalid json'
			}
		}))
		const rejects = expect(getAppEndpoint()).rejects
		rejects.toThrow(SonarInitializationException)
		rejects.toMatchObject({ reason: InitializeErrorReason.BadConfig })
	})

	it('throws BadConfig Exception when ggEncryptedAddress is missing', async () => {
		mock.module('node:os', () => ({
			platform: () => 'win32'
		}))
		mock.module('node:fs', () => ({
			promises: {
				readFile: async () => JSON.stringify({})
			}
		}))
		const rejects = expect(getAppEndpoint()).rejects
		rejects.toThrow(SonarInitializationException)
		rejects.toMatchObject({ reason: InitializeErrorReason.BadConfig })
	})

	it('returns ggEncryptedAddress when file is valid', async () => {
		const mockAddress = 'encrypted-address-123'
		const expectedUrl = `https://${mockAddress}`
		mock.module('node:os', () => ({
			platform: () => 'win32'
		}))
		mock.module('node:fs', () => ({
			promises: {
				readFile: async () => JSON.stringify({ ggEncryptedAddress: mockAddress })
			}
		}))
		expect(getAppEndpoint()).resolves.toBe(expectedUrl)
	})
})
