# Table of Contents

- [Table of Contents](#table-of-contents)
  - [- Updating Tools](#--updating-tools)
- [Enviroment Setup Manual(Mac)](#enviroment-setup-manualmac)
  - [Prerequsite](#prerequsite)
    - [Step 1: Install Homebrew](#step-1-install-homebrew)
    - [Step 2: Install Git](#step-2-install-git)
    - [Step 3: Install httpd Service](#step-3-install-httpd-service)
    - [Step 4: Install PHP](#step-4-install-php)
    - [Step 5: Install PEAR(PECL) for PHP](#step-5-install-pearpecl-for-php)
      - [Configure and Install PEAR](#configure-and-install-pear)
      - [Verify PEAR](#verify-pear)
      - [Cleanup(Optional)](#cleanupoptional)
    - [Step 6: Install Memcached](#step-6-install-memcached)
    - [Step 7: Install APCu](#step-7-install-apcu)
  - [Environment Setup](#environment-setup)
    - [Step 8: Clone Repository](#step-8-clone-repository)
    - [Step 9: httpd.conf Settings](#step-9-httpdconf-settings)
    - [Step 10: httpd-vhosts.conf Settings](#step-10-httpd-vhostsconf-settings)
    - [Step 11: php.ini Settings](#step-11-phpini-settings)
    - [Step 12: hosts Settings](#step-12-hosts-settings)
    - [Step 13: Activate httpd Service](#step-13-activate-httpd-service)
  - [Optional Settings](#optional-settings)
    - [Step 14: Setup Debug Logger](#step-14-setup-debug-logger)
  - [Start Development](#start-development)
    - [SSH](#ssh)
  - [DB](#db)
    - [Sequel pro (mysql)](#sequel-pro-mysql)
  - [Updating Tools](#updating-tools)
---

# Enviroment Setup Manual(Mac)

## Prerequsite

### Step 1: Install [Homebrew](https://brew.sh/)

> Homebrew is a package management for Mac, we can install various apps/command line tools via terminal.

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

---

### Step 2: Install [Git](https://git-scm.com/)

```
$ brew install git
```

---

### Step 3: Install [httpd](http://httpd.apache.org/docs/trunk/programs/httpd.html) Service

```
$ brew install httpd
```

---

### Step 4: Install [PHP](https://www.php.net/)

> We are using PHP@7.2 for this project, if you have installed other versions of PHP(such as 7.3), please do
> ```
> $ brew unlink php7.3
> ```
> To unlink the connection

```
$ brew install php72
```

* After install, please add following entries in your PATH, in your `~/.zshrc` or `~/.bash_profile` file, add following:

```bash
export PATH="/usr/local/opt/php@7.2/bin:$PATH"
export PATH="/usr/local/opt/php@7.2/sbin:$PATH"
```

* affect changes
```
. ~/.bash_profile
```

* After that, open up terminal, type
```
php -v
```

* You should see
```
PHP 7.2.* (cli) ...
```

---

### Step 5: Install [PEAR(PECL) for PHP](https://pear.php.net/)

```
$ curl -O https://pear.php.net/go-pear.phar
$ sudo php -d detect_unicode=0 go-pear.phar
```

#### Configure and Install PEAR

You should now be at a prompt to configure PEAR.

* Type 1 and press return.

* Enter:
```
/usr/local/pear
```
* Type 4 and press return.

* Enter:
```
/usr/local/bin
```
* Press return

#### Verify PEAR

* You should be able to type:

```
$ pear version
```

#### Cleanup(Optional)

* After the installation is done, you can do

```
$ rm go-pear.phar
```

to remove the installer.

---


### Step 6: Install [Memcached](https://memcached.org/)
```
$ brew install pkg-config
```

```
$ brew install zlib
```

```
$ brew install libmemcached
```

```
$ pecl install memcached
```

And follow the default settings to install.

---

### Step 7: Install [APCu](https://www.php.net/manual/en/book.apcu.php)
```
$ pecl install apcu
```

---

## Environment Setup

### Step 8: Clone Repository

```
$ cd ${your_http_root_folder}
$ git clone https://github.com/Evolany/anybot.git
```

---

### Step 9: httpd.conf Settings

* Find `/usr/local/etc/httpd/httpd.conf`

Uncomment following codes:

```
Listen 80
```

```
LoadModule rewrite_module lib/httpd/modules/mod_rewrite.so

LoadModule php7_module /usr/local/opt/php@7.2/lib/httpd/modules/libphp7.so
<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>
```

```
DocumentRoot "${your_http_root_folder}"
<Directory "${your_http_root_folder}">
```

```
# Virtual hosts
Include /usr/local/etc/httpd/extra/httpd-vhosts.conf
```

---

### Step 10: httpd-vhosts.conf Settings

* Find `/usr/local/etc/httpd/extra/httpd-vhosts.conf`

* Make the file like this:

```
AddType text/html .shtml
AddType text/x-component .htc
AddType image/svg+xml .svg
AddType image/svg+xml svgz
AddType application/vnd.ms-fontobject eot
AddType font/truetype ttf
AddType application/x-font-woff woff
AddOutputFilter INCLUDES .shtml
<FilesMatch "\.(ttf|otf|eot|woff)$">
#  <IfModule mod_headers.c>
   Header set Access-Control-Allow-Origin "*"
#  </IfModule>
</FilesMatch>

<VirtualHost *:80> 
	DocumentRoot "${your_http_root_folder}/anybot" 
	ServerName anybot.test
	Options FollowSymLinks 
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
    Header set Access-Control-Allow-Headers "X-Auth-Token, Origin, Authorization, Accept, Content-Type"
	RewriteEngine on
	RewriteRule (s?css|images|js|fonts)/(.*)$ /webroot/$1/$2 [L] 
	RewriteRule ^(.*)\.html$ /webroot/html/$1.htm [L] 
	RewriteRule !\.(php|svg|ttf|htc|ico|gif|png|jpg|jpeg|css|scss|js|swf|html|htm|json)$ /liber.php?__URL__=%{REQUEST_URI} [QSA,NE,L]
</VirtualHost>
```

---

### Step 11: php.ini Settings

* Open up `/usr/local/etc/php/7.2/php.ini`

```
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
display_errors = Off
display_startup_errors = Off
date.timezone = "Asia/Tokyo"
```

---

### Step 12: hosts Settings

* Find `etc/hosts`, add following rules:

```
127.0.0.1       	anybot.test
54.64.23.159        dev
```

---

### Step 13: Activate httpd Service

```
$ brew services start httpd
```

---

## Optional Settings

### Step 14: Setup Debug Logger

* Open up `/usr/local/etc/php/7.2/php.ini`

* Around line 581:
```
error_log = ~/Logs/php_error.log
```

* Make the log file:
```
$ mkdir ~/Logs
$ touch ~/Logs/php_error.log
```

* In your `~/.zshrc` or `~/.bash_profile` file, add following:

```bash
php_log_path="~/Logs/php_error.log"

function plog() {
	if $1 = 'clear'
	then
		: > $php_log_path && echo "$php_log_path has been cleared!"
	else
		printf "\033c" && tail -n 1000 -f $php_log_path
	fi
}
```



## Start Development

* Open [http://anybot.test/](http://anybot.test/)

---


### SSH

```bash
$ cat ~/.ssh/id_rsa.pub 
```

example 
```bash
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCo0awfjByNs7ePPYPCNhJMD5nlOEkeRGzBMfEi5Dzvq0n8/bxvqOK4MK1C22EJCopd4SP/PZz+7eNGjZjmUVZbhqrbzsY6ElO8TekpUuoyRFLKXlGGaIY6OPouQvahD9Xo1giQcRHYSt+yyiOuBzrV5PgC7JoeT8Vy23R9m8yhb5oUeJo0yCbDcjaiB47XKWbfAJJ2HrxmyH7LQph28Wp2ImY8rw/J2at3ueCA72ysqgJ0LyjigPxUwGnVIaBnCKdvzkOE6575dxx0Qyw7V50BIASYKsoEQPUojcvm7mIatigaQd3giwE/dPtOLtAG/invvaAPvFuklL03U9slXLsl soyoes@Yus-iMac
```

* __COPY__ the code


```bash
$ ssh root@dev -i anybot.pem
```

* login to dev server with ssh

```bash
[root@bonpdev1 ~]$ vim .ssh/authorized_keys 
```

* press **o**
* paste the code (id_rsa.pub)
* exec this command : **wq!**

* try it
```bash
[root@bonpdev1 ~]$ exit
# from your mac
$ ssh root@dev
```

----

## DB

> mysql is not required in your local env.

### Sequel pro (mysql)
- Host : 54.64.23.159
- Username : root
- Password : Anybot1.,
- Database : bots
- Port : 3306


----

## Updating Tools 

* visit [http://anybot.test](http://anybot.test)
Bot list > right top corner **[git]** button

There are 3 buttons will affect git changes to dev.bonp.me
- [ update PHP server ] : update php only
- [ update LUA server ] : update lua only
- [ flush memcache ] : flush memcached keys


