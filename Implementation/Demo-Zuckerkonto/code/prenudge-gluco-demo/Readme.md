# PräNUDGE Demo Web-App - Zuckerkonto

## Zweck

Dieses Projekt dient zur Demonstration, wie eine qualifizierte PräNUDGE App (in dem Fall eine Web-App) mit der PräNUDGE
Plattform kommuniziert.

Die wesentlichen Schritte sind

1. Als Zuckerkonto-App-Benutzer mit PräNUDGE verbinden
1. Einfache Dateneingabe von Zuckerwerten, welcher dann an die PräNUDGE Plattform geschickt werden

# Entwicklung

Die Web-App ist in `Express` (Node.js Web Application Framework) entwickelt.

## Abhängigkeiten

Nachdem das Projekt zum ersten Mal ausgecheckt wurde, müssen die abhängigen Bibliotheken mit nachfolgendem Befehl
heruntergeladen werden.

```
npm install
```

## Start Web-Server

Mit nachfolgendem Befehl kann der Web-Server gestartet werden, der dann auf Port `http://localhost:3000` erreichbar
ist (siehe auch das Startskript `./bin/www`)

```
npm run dev 
```

## Deployment

Zuerst wird das Image gebaut:

```
docker build -t hthv013.joanneum.at:5000/health-joanneum/pn-zuckerkonto .
```

Dann deployed:

```
docker push hthv013.joanneum.at:5000/health-joanneum/pn-zuckerkonto
```
