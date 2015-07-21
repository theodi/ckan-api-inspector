# CKAN API Inspector

![Screenshot](https://cloud.githubusercontent.com/assets/1308115/8802449/68c1025e-2fb9-11e5-9f8c-52e8916814e5.png)

This messy thing parses packages from a given CKAN site URL and records all metadata fields that appear (and some of their values).

## Setting up

First [install node](https://nodejs.org/). Then install babel-node by running:

```
npm install -g babel-node
```

Then clone this repo, cd to it and install all dependencies by running:

```
npm install
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

To view the results after it's done parsing, start the server:

```
babel-node serve
```

Then open [http://localhost:8000](http://localhost:8000). Select a result from the dropdown and then click around.
