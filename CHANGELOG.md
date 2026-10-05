# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - Unreleased

See [Migration from 2.x](README.md#migration-from-2x).

### Breaking

- Node.js ≥ 22.0.0 is required. Node 20 reached end-of-life in April 2026.
- `error()`, `warning()` and `notFound()` no longer send an error's `errors` property by default. It is sent only when `debug` or `exposeErrors` is `true`. ORM and validation libraries put internal details there (rejected values, model and column names).
- TypeScript: `FormattedResponseConfig` has a new required key, `exposeErrors`.

### Added

- `exposeErrors` config option (default `false`). Set it to `true` to keep the 2.x behavior.

### Changed

- CI no longer tests on Node 20. Build target is `node22`.

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

[3.0.0]: https://github.com/Kareylo/formatted-response/compare/v2.0.1...feature/v3
[2.0.1]: https://github.com/Kareylo/formatted-response/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/Kareylo/formatted-response/releases/tag/v2.0.0
