import { promises as fsAsync } from 'node:fs'
import { platform as getPlatform } from 'node:os'
import { join as joinPath } from 'node:path'
import { InitializeErrorReason, SonarInitializationException } from '@/exceptions'

const WINDOWS_PATHS = ['SteelSeries', 'SteelSeries Engine 3', 'coreProps.json']

type CoreProps = {
	ggEncryptedAddress: string
}

/**
 * Retrieves the SteelSeries GG application's encrypted address from the coreProps.json file.
 *
 * @returns A promise that resolves to the GG application's secure address string (e.g., "https://..."),
 *          as found in the ggEncryptedAddress property of coreProps.json.
 *
 * @throws {SonarInitializationException} If the GG server cannot be determined.
 *
 * @remarks
 * - Only supports Windows OS; throws on other platforms.
 * - Locates coreProps.json in the ProgramData directory under SteelSeries folders.
 * - Reads and parses the file, returning the encrypted address as a secure URL.
 */
export async function getAppEndpoint(): Promise<string> {
	const appDataPath = getPath()
	const fileContents = await getContents(appDataPath)
	const data = parseContents(fileContents)

	if (data.ggEncryptedAddress) {
		return `https://${data.ggEncryptedAddress}`
	}

	throw new SonarInitializationException({
		reason: InitializeErrorReason.BadConfig
	})
}

function getPath(): string {
	const os = getPlatform()
	switch (os) {
		case 'win32': {
			const programData = process.env.ProgramData ?? 'C:\\ProgramData'
			return joinPath(programData, ...WINDOWS_PATHS)
		}
		default:
			throw new SonarInitializationException({
				reason: InitializeErrorReason.OSUnsupported
			})
	}
}

async function getContents(path: string): Promise<string> {
	try {
		return await fsAsync.readFile(path, 'utf8')
	} catch (error) {
		throw new SonarInitializationException({
			reason: InitializeErrorReason.BadConfig,
			innerException: error as Error
		})
	}
}

function parseContents(contents: string): CoreProps {
	try {
		return JSON.parse(contents) as CoreProps
	} catch (error) {
		throw new SonarInitializationException({
			reason: InitializeErrorReason.BadConfig,
			innerException: error as Error
		})
	}
}
