VisuAlive + VCCW + Gulp (vavg)
=========================

簡単なコマンドを実行するだけで、WordPress の開発環境 ( VCCW ) と Gulp ( Scss のビルドや BrowserSync など ) 環境を整えることができます。

## Ready

あらかじめ、Vagrant、Node.js、Ruby、ImageMagic をインストールしておく必要があります。

### Mac OS X

* [Mac OSXでのWeb開発環境構築](http://designinglabo.com/1019/mac-os-x-web-development-environment.html)

### Windows

* [Vagrant](https://www.vagrantup.com/)
* [Node.js](http://nodejs.jp/)
* [Cygwin](https://cygwin.com/)  
    * Cygwin 本体、wget / curl / unzip / をインストールする。
* [Ruby](http://rubyinstaller.org/)  
    * パッケージマネージャーの Rubygems も一緒にインストールする。
    * Cygwin でも、Ruby と Rubygems をインストール可能。
* [ImageMagic](http://www.imagemagick.org/script/binary-releases.php#windows)  
    * Cygwin でもインストール可能。

Windows での移行の作業は全て、Cygwin で行ってください。ただし、起動できるかは分かりません。

## How to use

VAVG のダウンロードから初回起動

```
$ wget http://github.com/kuck1u/vavg/archive/master.zip && unzip ./master.zip && rm -rf ./master.zip && mv ./vavg-master/* ./ && rm -rf ./vavg-master && chmod u+x ./vavg && ./vavg -i -s
```

### Install

```
$ ./vavg -i
```

### Start

```
$ ./vavg -s
```

### Install & Start

```
$ ./vavg -i -s
```

## Support OS

* OSX: 10.10.5
* Windows: not tested

## Change log
* v1.0.2  
インストールモード時に、vagrant up を行うように変更。
* v1.0.1  
コマンドチェック、Vagrant plugin のインストールを追加。
* v1.0.0  
First commit.
