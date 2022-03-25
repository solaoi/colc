# Colc

Colc is a CommandLineTool to take statistics from a column of a file.

This is the simple wrapper of `awk` command, so quick:)

## Usage

```
colc [column] [file.csv|tsv|txt]
```

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
VERSION=v1.0.0
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

<img width="374" alt="スクリーンショット 2022-03-25 14 54 43" src="https://user-images.githubusercontent.com/46414076/160063842-04edc218-658d-46e7-887b-c4c913ea1660.png">

## Development

```
# Run
deno run --allow-run --allow-env colc.ts
# Install
deno install -f --allow-run --allow-env colc.ts
# UnInstall
rm $(which colc)
```
