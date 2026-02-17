# PräNUDGE Demo Web-App - Sugar Account

## Purpose

This project serves as a demonstration of how a qualified PräNUDGE app (in this case, a web app) communicates with the PräNUDGE platform.

The essential steps are:

1. Connect as a Sugar Account app user with PräNUDGE
2. Simple data entry of sugar values, which are then sent to the PräNUDGE platform

# Development

The web app is developed using `Express` (Node.js Web Application Framework).

## Dependencies

After the project has been checked out for the first time, the dependent libraries must be downloaded with the following command:

```
npm install
```

## Start Web Server

The web server can be started with the following command, after which it will be accessible at port `http://localhost:3000` (see also the start script `./bin/www`)

```
npm run dev
```

## Deployment

First, build the image:

```
docker build -t hthv013.joanneum.at:5000/health-joanneum/pn-zuckerkonto .
```

Then deploy:

```
docker push hthv013.joanneum.at:5000/health-joanneum/pn-zuckerkonto
```
