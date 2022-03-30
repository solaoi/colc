# Colc

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
VERSION=v1.0.20
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

There is a `tests.csv`.

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

<img width="379" alt="スクリーンショット 2022-03-30 14 50 39" src="https://user-images.githubusercontent.com/46414076/160760624-58a15682-0f64-45b0-8b99-2b3732952971.png">

Of course `-b,--binsize` works well:)

```
colc 2 some.csv -b 25
```

<img width="524" alt="スクリーンショット 2022-03-28 18 55 40" src="https://user-images.githubusercontent.com/46414076/160373910-9909e910-a0bf-4717-840e-596dc6758b34.png">

There are noises, then filter necessaries(>=1%) with `-f,--filter`

```
colc 2 some.csv -b 25 -f 1
```

<img width="524" alt="スクリーンショット 2022-03-28 18 56 23" src="https://user-images.githubusercontent.com/46414076/160374083-3be98d4a-797d-4076-ac14-a76d223c2fc8.png">

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
