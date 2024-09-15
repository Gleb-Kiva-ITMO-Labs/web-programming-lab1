# Лабораторная №1 *(Apache + FastCGI)*

| FCGI Port | Apache Port | Localhost Port |
|-----------|-------------|----------------|
| 23419     | 23420       | 8080           |

How to run:
```shell
httpd -f ~/web/lab1/httpd-root/conf/httpd.conf -k start
java -DFCGI_PORT=23419 -jar ~/web/lab1/httpd-root/fcgi-bin/server.jar

ssh -p 2222 s408766@helios.cs.ifmo.ru -L 8080:localhost:23420
```