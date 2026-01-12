import { getAppEndpoint } from '../../src/functions/endpoint/get-app-endpoint'
import { getSonarEndpoint } from '../../src/functions/endpoint/get-sonar-endpoint'

export async function getEndpointEndToEnd() {
	const appEndpoint = await getAppEndpoint()
	const sonarEndpoint = await getSonarEndpoint(appEndpoint)
	return sonarEndpoint
}
