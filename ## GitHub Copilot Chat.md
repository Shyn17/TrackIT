## GitHub Copilot Chat

- Extension: 0.44.2 (prod)
- VS Code: 1.116.0 (560a9dba96f961efea7b1612916f89e5d5d4d679)
- OS: win32 10.0.26200 x64
- GitHub Account: Shyn17

## Network

User Settings:
```json
  "http.systemCertificatesNode": true,
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 20.207.73.85 (2451 ms)
- DNS ipv6 Lookup: Error (92 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (2 ms)
- Electron fetch (configured): timed out after 10 seconds
- Node.js https: timed out after 10 seconds
- Node.js fetch: timed out after 10 seconds

Connecting to https://api.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.113.22 (254 ms)
- DNS ipv6 Lookup: Error (185 ms): getaddrinfo ENOTFOUND api.githubcopilot.com
- Proxy URL: None (5 ms)
- Electron fetch (configured): timed out after 10 seconds
- Node.js https: timed out after 10 seconds
- Node.js fetch: timed out after 10 seconds

Connecting to https://copilot-proxy.githubusercontent.com/_ping:
- DNS ipv4 Lookup: 4.237.22.41 (54 ms)
- DNS ipv6 Lookup: Error (154 ms): getaddrinfo ENOTFOUND copilot-proxy.githubusercontent.com
- Proxy URL: None (48 ms)
- Electron fetch (configured): timed out after 10 seconds
- Node.js https: timed out after 10 seconds
- Node.js fetch: timed out after 10 seconds

Connecting to https://mobile.events.data.microsoft.com: timed out after 10 seconds
Connecting to https://dc.services.visualstudio.com: HTTP 404 (6564 ms)
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: HTTP 200 (1623 ms)
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: HTTP 200 (1103 ms)
Connecting to https://default.exp-tas.com: HTTP 400 (1106 ms)

Number of system certificates: 76

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).