# Лабораторная №1 *(Apache + FastCGI)*

| FCGI Port | Apache Port | Localhost Port |
|-----------|-------------|----------------|
| 24126     | 24125       | 8080           |

How to run:
```shell
httpd -f ~/web/lab1/httpd-root/conf/httpd.conf -k start
java -DFCGI_PORT=24126 -jar ~/web/lab1/httpd-root/fcgi-bin/server.jar

ssh -p 2222 s408766@helios.cs.ifmo.ru -L 8080:localhost:24125
```