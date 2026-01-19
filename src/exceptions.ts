type RequestErrorProps = {
	message?: string
	innerException?: Error
}

export enum InitializeErrorReason {
	BadConfig = 'Bad Config',
	OSUnsupported = 'OS Unsupported',
	NotEnabled = 'Not Enabled',
	NotRunning = 'Not Running',
	NotReady = 'Not Ready',
	NotResponding = 'Not Responding',
	NotAvailable = 'Not Available'
}

type InitializeErrorProps = {
	message?: string
	innerException?: Error
	reason: InitializeErrorReason
}

/** Base exception for all handled Sonar related exception. */
export abstract class SonarException extends Error {
	constructor(message: string, cause?: Error) {
		super(message, { cause })
		super.name = new.target.name
	}
}

/** Thrown when the server responds in an unexpected way. */
export class SonarRequestException extends SonarException {
	constructor(error?: RequestErrorProps) {
		super(error?.message ?? 'There was an issue communicating with the Sonar service.', error?.innerException)
	}
}

/** Thrown when the server cannot be determined. */
export class SonarInitializationException extends SonarException {
	public reason: InitializeErrorReason
	constructor(error: InitializeErrorProps) {
		const message = `${error?.message ?? `There was an issue finding the Sonar service: ${error.reason}.`}${error?.innerException ? ' See inner exception.' : ''}`
		super(message, error?.innerException)
		this.reason = error.reason
	}
}
