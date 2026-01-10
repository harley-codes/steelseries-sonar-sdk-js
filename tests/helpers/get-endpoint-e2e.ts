import { getAppEndpoint } from '../../src/functions/get-app-endpoint'
import { getSonarEndpoint } from '../../src/functions/get-sonar-endpoint'

export async function getEndpointEndToEnd() {
	const appEndpoint = await getAppEndpoint()
	const sonarEndpoint = await getSonarEndpoint(appEndpoint)
	return sonarEndpoint
}
