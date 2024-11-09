# Baldur - Interface WEB et Mobile

## Commande de lancement de l'image WEB en dev

```bash
sudo docker run -d  --name baldur docker.luoja.fr/baldur
```

## Commande de lancement de l'image WEB en production

```bash
sudo docker run -d --restart always --name baldur --network internal_network \
-e PROTOCOL=HTTPS \
-e DOMAIN_NAME=luoja.fr \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
docker.luoja.fr/baldur    
```