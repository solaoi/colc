# Colc

Colc is a CommandLineTool to take statistics from a column of a file.

This command depends these commands(`head|tail|cut|sort|awk`) on bash.

## Usage

```
colc [column] [file.csv|tsv|txt]
```

## Feature

- Quick
- Auto detect a separator
- Auto detect a header row

## Install

### For MacOS (Homebrew)

```sh
# Install
brew install solaoi/tap/colc
# Update
brew upgrade colc
```

### For Linux (Binary Releases)

you can download a binary release
[here](https://github.com/solaoi/colc/releases).

```sh
# Install with wget or curl
## set the latest version on releases.
VERSION=v1.0.5
## case you use wget
wget https://github.com/solaoi/colc/releases/download/$VERSION/colc_linux_amd64.tar.gz
## case you use curl
curl -LO  https://github.com/solaoi/colc/releases/download/$VERSION/colc_linux_amd64.tar.gz
## extract
tar xvf ./colc_linux_amd64.tar.gz
## move it to a location in your $PATH, such as /usr/local/bin.
mv ./colc /usr/local/bin/
```

### Example

There is a some.csv.

```
1,54,3,73,5
51,4,8,41,1
3,4,80,1,13
```

Then you wanna get the second column's statistics.

Just do it!

```
colc 2 some.csv
```

<img width="376" alt="スクリーンショット 2022-03-26 12 25 42" src="https://user-images.githubusercontent.com/46414076/160223042-11a0e17e-5cd7-4fba-9f97-313d504592d2.png">

## Development

```
# Run
deno run --allow-run --allow-env colc.ts
# Install
deno install -f --allow-run --allow-env colc.ts
# UnInstall
rm $(which colc)
```
