# CKAN API Inspector

[![Screenshot](https://cloud.githubusercontent.com/assets/1308115/8802449/68c1025e-2fb9-11e5-9f8c-52e8916814e5.png)](http://theodi.github.io/ckan-api-inspector)

This messy thing parses packages from a given CKAN site URL and records all metadata fields that appear (and some of their values). **[Demo](http://theodi.github.io/ckan-api-inspector)**.

## Setting up

First [install node](https://nodejs.org/). Then install babel-node by running:

```
npm install -g babel-node
```

Then clone this repo, cd to it and install all dependencies by running:

```
npm install
jspm install
```

## Usage

### Parsing

To process a CKAN site run:

```
babel-node parse <url>
```

Passing `-l <number>` limits the number of packages to process.

For example, to parse 1000 packages from data.gov.uk:

```
babel-node parse data.gov.uk -l 1000
```

### Inspecting

To view the results after it's done parsing, start a local server in the `public` directory. You can do this by installing http-server:

```
npm install -g http-server
```

Then cd to the `public` directory and run:

```
http-server
```

## How it works

Whenever a site is parsed, the script automatically updates `index.html` to include the parsed file. If you want to edit the HTML, edit `views/index.ejs` and then run `babel-node parse` without supplying a URL to generate a new `index.html` file.

Local JavaScript is automatically used, falling back to the prebuilt `build.js` if the local is not available. So editing JavaScript should Just Work™, but you will need to run `jspm bundle-sfx src/main` when you want to update Github Pages.

To deploy on `gh-pages` run: `git subtree push --prefix public origin gh-pages`
