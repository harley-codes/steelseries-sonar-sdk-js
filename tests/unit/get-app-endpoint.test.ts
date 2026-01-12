import { describe, expect, it, mock } from 'bun:test'
import { InvalidException, NotFoundException, UnsupportedException } from '../../src/exceptions'
import { getAppEndpoint } from '../../src/functions/endpoint/get-app-endpoint'

describe('getAppEndpoint', () => {
	it('throws UnsupportedException on unsupported OS', async () => {
		mock.module('node:os', () => ({
			platform: () => 'linux'
		}))
		expect(getAppEndpoint()).rejects.toThrow(UnsupportedException)
	})

	it('throws NotFoundException when appData file does not exist', async () => {
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
		expect(getAppEndpoint()).rejects.toThrow(NotFoundException)
	})

	it('throws InvalidException when appData file is invalid JSON', async () => {
		mock.module('node:os', () => ({
			platform: () => 'win32'
		}))
		mock.module('node:fs', () => ({
			promises: {
				readFile: async () => 'invalid json'
			}
		}))
		expect(getAppEndpoint()).rejects.toThrow(InvalidException)
	})

	it('throws NotFoundException when ggEncryptedAddress is missing', async () => {
		mock.module('node:os', () => ({
			platform: () => 'win32'
		}))
		mock.module('node:fs', () => ({
			promises: {
				readFile: async () => JSON.stringify({})
			}
		}))
		expect(getAppEndpoint()).rejects.toThrow(NotFoundException)
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
