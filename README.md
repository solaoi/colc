# Colc (`Co`lumn x Ca`lc`ulation)

Colc is a CommandLineTool to take statistics from a column of a file.

This command depends these commands(`head|tail|cut|sort|awk`) on bash.

## Usage

```
colc [column] [file.csv|tsv|txt]

*1
When you set [column,column] on the column parameter,
you'll get the correlation coefficient of two columns.
(thie feature don't support below options)
```

## Option

```
# check the column is valid
-c,--check

# set precision, default is 6
-p,--precision <number>

# show frequency table and histogram
-b,--binsize <number>

# with binsize option, filter frequency
-f,--filter <number(1-99)>

# show version
-v,--version

# show help
-h,--help
```

## Feature

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
VERSION=v1.0.24
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

There is a `some.csv`.

```
Student,Reading,Writing,Math,Science,Social Studies
A,90,74,33,73,59
B,83,67,84,41,61
C,73,72,80,12,93
D,43,87,67,55,63
E,33,89,97,76,66
```

Then you wanna get the second Reading's statistics.

Just do it!

```
colc 2 some.csv
```

<img width="379" alt="スクリーンショット 2022-03-31 18 36 29" src="https://user-images.githubusercontent.com/46414076/161025329-42cb83a4-3908-4416-9dd7-c295ff4c779a.png">

Of course `-b,--binsize` works well:)

```
colc 2 some.csv -b 25
```

<img width="524" alt="スクリーンショット 2022-03-31 18 37 21" src="https://user-images.githubusercontent.com/46414076/161025488-271747bf-ebc9-4f8b-a5c6-b3920237557c.png">

There are noises, then filter necessaries(>=1%) with `-f,--filter`

```
colc 2 some.csv -b 25 -f 1
```

<img width="524" alt="スクリーンショット 2022-03-31 18 37 57" src="https://user-images.githubusercontent.com/46414076/161025582-88c863d8-25b0-43bd-8ad7-28f8d2100e36.png">

If you wanna check whether the file is valid in advance,

`-c,--check` answers the file is dirty or clean.

```
colc 2 some.csv -c
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
