# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-10-05

### Added

- `status(code, message, data?)`: sends any status code from 100 to 599. Below 400 the third argument is `data`; from 400 up it is parsed as an error, like `error()`. The message suffix defaults to the code's IANA name (`.CONFLICT`).
- Named methods: `created`, `accepted`, `noContent`, `badRequest`, `unauthorized`, `forbidden`, `conflict`, `unprocessableContent`, `tooManyRequests`, `internalServerError`, `serviceUnavailable`.
- `FormattedResponse.HttpStatus`: every code in the IANA HTTP Status Code Registry, by name (`HttpStatus.CREATED === 201`).
- Optional `statuses` config key to override the suffix or `type` per code: `{ statuses: { 409: { suffix: '.TAKEN' } } }`.
- Types `HttpStatusCode`, `HttpStatusName`, `StatusOverride` and `StatusResponse` in `formatted-response/types`.

## [2.0.1] - 2026-10-01

### Security

- `deepMerge` ignores `__proto__`, `constructor` and `prototype` keys in the config passed to the constructor.

### Fixed

- `repository.url` in `package.json` matches the GitHub repository casing.

### Documentation

- README warns that an error's `errors` property is sent to clients regardless of `debug`.

### Internal

- Releases publish through npm trusted publishing (OIDC). GitHub Actions are pinned to full commit SHAs, and Dependabot keeps them updated.

## [2.0.0] - 2026-09-22

Rewrite in TypeScript, published as dual ESM + CommonJS. Requires Node.js ≥ 20.19. See [Migration from 1.x](README.md#migration-from-1x) for the breaking changes.

[2.1.0]: https://github.com/Kareylo/formatted-response/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/Kareylo/formatted-response/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/Kareylo/formatted-response/releases/tag/v2.0.0
