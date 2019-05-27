# Development

All NGINX traffic must go through HTTPS. Since you cannot get valid certificates for `localhost`, you must generate a self-signed certificate for local development.

First, create an `ssl` folder inside the `dev` directory. Next, open Git Bash in the `ssl` folder and execute the command below. Go [here](https://scmquest.com/nginx-docker-container-with-https-protocol/) to see what each flag does.


```cmd
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.crt
```

This will generate an `nginx.key` and `nginx.cert` file. The dev Docker Compose will place these files inside the NGINX container automatically.

If you are regenerating a key and certificate, it's a good idea to delete the old certificates from your browser.