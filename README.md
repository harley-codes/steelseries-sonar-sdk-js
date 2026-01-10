# Unofficial - SteelSeries Sonar SDK (WIP) [![Tests](https://github.com/harley-codes/steelseries-sonar-sdk-js/actions/workflows/tests.yml/badge.svg)](https://github.com/harley-codes/steelseries-sonar-sdk-js/actions/workflows/tests.yml) [![Codecov](https://codecov.io/github/harley-codes/steelseries-sonar-sdk-js/graph/badge.svg?token=TBF8WTZ19B)](https://codecov.io/github/harley-codes/steelseries-sonar-sdk-js)

An SDK for interacting with the SteelSeries Sonar software.

### Known Limitation
Changes made with this SDK are not immediately visible in the SteelSeries GG software. Both the SDK and GG software communicate directly with the Sonar Service API, but the GG UI does not do any polling to auto-refresh when changes are made externally. To see the latest state in GG, you must close and reopen the GG window. 

_I don't think this will matter to anyobody - but feel obliged to mention it._
