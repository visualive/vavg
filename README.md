VisuAlive + VCCW + Gulp (VAVG)
=========================

簡単なコマンドを実行するだけで、WordPress の開発環境 ( VCCW ) と Gulp ( Scss のビルドや BrowserSync など ) 環境を整えることができます。

## Ready

あらかじめ、Vagrant、Node.js、Ruby、ImageMagick をインストールしておく必要があります。

### Mac OS X

* [Mac OSXでのWeb開発環境構築](http://designinglabo.com/1019/mac-os-x-web-development-environment.html)

### Windows

* [Vagrant](https://www.vagrantup.com/)
* [Node.js](http://nodejs.jp/)
* [Cygwin](https://cygwin.com/)
    * Cygwin で、wget / curl / unzip / Ruby / Rubygems / ImageMagick をインストールする。

Windows での作業は全て Cygwin で行ってください。ただし、起動できるかは分かりません。

## How to use

[Demo movie / Youtube](https://www.youtube.com/watch?v=Sg5BlZtUv0w)

とりあえず試してみたい場合。

```
# Master
$ curl -LOk https://gist.githubusercontent.com/kuck1u/8d876e888ad0a0aa9be5/raw/1e863de448d297b318641c35f35564a711dfdf6f/vavgtest && \
chmod u+x ./vavgtest && \
./vavgtest

# Develop
$ curl -LOk https://gist.githubusercontent.com/kuck1u/8d876e888ad0a0aa9be5/raw/1e863de448d297b318641c35f35564a711dfdf6f/vavgtest_dev && \
chmod u+x ./vavgtest_dev && \
./vavgtest_dev
```

### VAVG を起動させる

```
# IDE などのプロジェクトディレクト直下に移動
$ cd /Users/YOURNAME/PhpstormProjects/TEST/

# VCCW + Gulp 1発起動スクリプト VAVG をダウンロード
$ wget http://github.com/kuck1u/vavg/archive/master.zip && \
unzip ./master.zip && \
rm -rf ./master.zip && \
mv ./vavg-master/* ./vavg-master/.[^\.]* ./ && \
rm -rf ./vavg-master && \
chmod u+x ./vavg

# 設定ファイルを編集
$ vi ./site.yml

# VAVG のインストールと起動
$ ./vavg -i -s
```

2 回目以降は下記コマンドで、VCCW と Gulp がスタートする。

```
$ ./vavg -s
```

### VAVG を終了させる

<kbd>Cont</kbd> + <kbd>c</kbd> で Gulp を終了させる。その後、下記コマンドで Vagrant を終了させる。

```
$ vagrant halt
```

### Setting file

設定を変更する場合は、site.yml を編集する。VAVG 特有の設定は以下の表の通り。

| 項目               | 説明                                                                                              | 初期値 |
|:-------------------|:--------------------------------------------------------------------------------------------------|:-------|
| wp\_starter\_theme | WordPress Starter Theme を使用するか否か。使用する場合は、underscore または sage のどちらかを指定 | false  |
| web_font           | ウェブフォントを使用するか否か。使用する場合は、genericons または fontawesome のどちらかを指定    | false  |
| bootstrap          | CSS フレームワークの Bootstrap を使用するか否か。Bootstrap を使用しない場合は Foundation となる   | false  |

### Options

| 項目 | 説明                                                                           |
|:-----|:-------------------------------------------------------------------------------|
| -h   | VAVG のヘルプを表示する                                                        |
| -v   | VAVG のバージョンを表示する                                                    |
| -i   | VCCW や Node module などをインストールする                                     |
| -g   | VAVG をスタートさせる                                                          |
| -b   | WordPress 全体とデータベースをバックアップする                                 |
| -B   | 開発中のテーマとデータベースをバックアップする                                 |
| -s   | Scss などを再コンパイルしたのち WordPress 全体とデータベースをバックアップする |
| -S   | Scss などを再コンパイルしたのち 開発中のテーマとデータベースをバックアップする |

#### Example

```
$ ./vavg -h
```

### npm commands

| コマンド        | 説明                                                                                                                         |
|:----------------|------------------------------------------------------------------------------------------------------------------------------|
| npm run bower   | `./node_modules/.bin/bower` のショートカット。例えば `npm run bower install` でパッケージをインストール可能                  |
| npm run gulp    | `./node_modules/.bin/gulp` のショートカット。例えば `npm run gulp scss` で scss タスクを実行可能                             |

## Support OS

* OSX: 10.10.5
* Windows: not tested

## Change log
* v2.1.0  
VAVG にオプションコマンドの追加。  
WordPress スターターテーマ SAGE の選択を追加。
* v2.0.0  
VisuAlive Web Starter を移植。  
_s 、ウェブフォント、Bootstrap の使用有無を選択できるように変更。
* v1.1.0  
メンテナンスリリース。  
軽いバグフィックス、Gulp 実行の高速化 etc。
* v1.0.4  
テーマファイルの関数郡を多数更新。
* v1.0.3  
空のテーマファイル群を追加。その他諸々修正。
* v1.0.2  
インストールモード時に、vagrant up を行うように変更。
* v1.0.1  
コマンドチェック、Vagrant plugin のインストールを追加。
* v1.0.0  
First commit.
