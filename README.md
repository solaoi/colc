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
VERSION=v1.0.15
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
1,54,3,73,5
51,4,8,41,1
3,4,80,1,13
```

Then you wanna get the second column's statistics.

Just do it!

```
colc 2 some.csv
```

<img width="363" alt="スクリーンショット 2022-03-27 20 06 59" src="https://user-images.githubusercontent.com/46414076/160278636-1a2d2f53-d1b6-41c3-8253-8eaf90683f46.png">

Of course `-b,--binsize` works well:)

```
colc 2 some.csv -b 10
```

<img width="742" alt="スクリーンショット 2022-03-26 23 54 04" src="https://user-images.githubusercontent.com/46414076/160244950-d543ed29-4709-465d-8b7d-63be530cc29a.png">

There are noises, then filter necessaries(>=1%) with `-f,--filter`

```
colc 2 some.csv -b 10 -f 1
```

<img width="742" alt="スクリーンショット 2022-03-26 23 54 44" src="https://user-images.githubusercontent.com/46414076/160244980-3e938d6a-766b-4f63-865c-8e5caef18739.png">

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
