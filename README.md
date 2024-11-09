# Baldur - Interface WEB et Mobile

## Commande de lancement de l'image WEB

```bash
sudo docker run -d --restart always --name baldur --network internal_network \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
docker.luoja.fr/baldur    
```