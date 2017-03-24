[![Build Status](https://travis-ci.org/metaodi/tecdottir.svg?branch=master)](https://travis-ci.org/metaodi/tecdottir)

# tecdottir

This is a project to get measurements from tecson meteo stations.

The City of Zurich has two such stations:

* [Tiefenbrunnen](https://www.tecson-data.ch/zurich/tiefenbrunnen/index.php)
* [Mythenquai](https://www.tecson-data.ch/zurich/mythenquai/index.php)

The data is unfortunately not available in a machine-readable form, but there is a form on the website to get all the measurements as a HTML table.

tecdottir is an API based on this form and HTML table.

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
