[![Build Status](https://github.com/metaodi/tecdottir/actions/workflows/build.yml/badge.svg)](https://github.com/metaodi/tecdottir/actions/workflows/build.yml)

# tecdottir

This is a project to get measurements from tecson meteo stations.

The City of Zurich has two such stations:

* [Tiefenbrunnen](https://www.tecson-data.ch/zurich/tiefenbrunnen/index.php)
* [Mythenquai](https://www.tecson-data.ch/zurich/mythenquai/index.php)

The data is unfortunately not available in a machine-readable form, but there is a form on the website to get all the measurements as a HTML table.

tecdottir is an API based on this form and HTML table.

## Showcases

Projects based on this API are shown.

* [**Zürichhorn**](https://editioneffet.ch/03069/zuerichhorn.html): map of Zürichhorn with temperature and wind by [Markus Steiger](https://github.com/01241)

(if you want on the list, create an issue or PR to add your project)

## Development

We use `swagger` to document the API.
Please install the CLI tool to edit the swagger file:

```bash
npm install -g swagger
```

(you might need root privileges to do so)

After installing the CLI tool, you can start editing:

```bash
swagger project edit
```

To start the server use:

```bash
swagger project start
```

## Tests

To run the tests, use the following command:

```bash
npm test
```

## Create a new release

1. Update the version number in `package.json` and `api/swagger/swagger.yaml`
1. Update the `CHANGELOG.md`
1. Push code to GitHub
1. Create a new release on GitHub
1. Wait for the GitHub Action to deploy the app to heroku
