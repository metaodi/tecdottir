# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project follows [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]

## [1.3.1] - 2022-06-23
### Fixed
- Make sure tests work even if env variable is missing

## [1.3.0] - 2022-06-23
### Added
- Add instructions to setup a local database

### Changed
- Use `timestamp_cet desc` as default on Swagger UI, but keep `timestamp_cet asc` as default, if no `sort` parameter is given

### Fixed
- Fix sorting as pg does not allow parameters for `ORDER BY`

## [1.2.1] - 2022-06-22
### Fixed
- Disable syntax highlighing to fix slow UI

## [1.2.0] - 2022-06-22
### Added
- New `total_count` field in the response to show how many rows there are meeting the criteria (regardless of the `limit` parameter)

## [1.1.0] - 2022-06-22
### Added
- New `row_count` field in the response to indicate how many rows are being returned
- 3 new query parameters: `sort`, `limit` and `offset`, they can be used for pagination

### Changed
- Add node v16 and v18 to GitHub Action matrix

### Removed
- Unused dependency `nock`

## [1.0.0] - 2022-06-16
### Changed
- BC-Break: format of `timestamp` changed, it is now a valid ISO-8601 string
- Use postgres as a backend (instead of scraping HTML of Tecson)
- The "try-it-out" button is on by default on the Swagger UI
- Updated the tests, use sinon to mock pg

### Added
- Python script to update the postgres db (using GitHub Actions)

## [0.0.7] - 2022-06-07
### Added
- Add CHANGELOG

### Changed
- Update dependencies


## [0.0.6] - 2021-04-15
### Fixed
- Add check to avoid requesting too broad time period


## [0.0.5] - 2021-04-15
### Changed
- Add README section about new release
- Update version number in swagger UI


## [0.0.4] - 2021-04-15
### Changed
- Switch heroku stack
- Update npm dependencies
- Migrate from Travis CI to GitHub Actions


## [0.0.3] - 2020-11-04
### Changed
- security update
- switch from cedar-14 to heroku-18 stack
 

## [0.0.2] - 2020-05-26
### Changed
- Upgrade of all dependencies
- Upgrade to newer version of node

### Fixed
- Fix #11 and indicate _broken_ measurements with a new `status` field (values are either `ok` or `broken`)


## [0.0.1] - 2017-03-28
### Added
- Initial version of tecdottir

# Categories
- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for once-stable features removed in upcoming releases.
- `Removed` for deprecated features removed in this release.
- `Fixed` for any bug fixes.
- `Security` to invite users to upgrade in case of vulnerabilities.

[Unreleased]: https://github.com/metaodi/tecdottir/compare/v1.3.1...HEAD
[1.3.1]: https://github.com/metaodi/tecdottir/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/metaodi/tecdottir/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/metaodi/tecdottir/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/metaodi/tecdottir/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/metaodi/tecdottir/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/metaodi/tecdottir/compare/v0.0.7...v1.0.0
[0.0.7]: https://github.com/metaodi/tecdottir/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/metaodi/tecdottir/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/metaodi/tecdottir/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/metaodi/tecdottir/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/metaodi/tecdottir/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/metaodi/tecdottir/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/metaodi/tecdottir/releases/tag/v0.0.1
