# Colc

Colc is a CommandLineTool to take statistics from a column of a file.

This is the simple wrapper of `awk` command, so quick:)

## Install

### For MacOS (Homebrew)

```sh
# Install
brew install solaoi/tap/colc
# Update
brew upgrade colc
```

### For Others (Binary Releases)

you can download a binary release
[here](https://github.com/solaoi/colc/releases).

```sh
# Install with wget or curl
## set the latest version on releases.
VERSION=v1.0.0
## set the Environment you use.(linux, darwin, windows)
OS=linux
## case you use wget
wget https://github.com/solaoi/colc/releases/download/$VERSION/colc_${OS}_amd64.tar.gz
## case you use curl
curl -LO  https://github.com/solaoi/colc/releases/download/$VERSION/colc_${OS}_amd64.tar.gz
## extract
tar xvf ./colc_${OS}_amd64.tar.gz
## move it to a location in your $PATH, such as /usr/local/bin.
mv ./colc /usr/local/bin/
```

## Usage

```
colc [column] [file.csv|tsv|txt]
```

### Example

There is a some.csv.

```
1,54,3,73,5
51,4,8,41,1
3,4,80,1,13
```

Then you wanna get the second column's statistics.

do it!

```
colc 2 some.csv
```

## Development

```
# Run
deno run --allow-run --allow-env colc.ts
# Install
deno install -f --allow-run --allow-env colc.ts
# UnInstall
rm $(which colc)
```
