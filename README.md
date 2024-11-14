# Baldur - Interface WEB et Mobile

## Commande de lancement de l'image WEB en dev

```bash
sudo docker run -it -p 4000:4000 --name baldur docker.luoja.fr/baldur
```

## Commande de lancement de l'image WEB en production

```bash
sudo docker run -d --restart always --name baldur --network internal_network \
-e PROTOCOL=HTTPS \
-e DOMAIN=luoja.fr \
-e API=api.luoja.fr \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
docker.luoja.fr/baldur    
```

## CI/CD : Organisation du Pipeline : 

L'objectif du pipeline de ce projet est de corriger le code, et de déployer régulièrement 
des version stables de l'application.

La finalité est de n'avoir sur dev et les branches suivantes que du code propre et fonctionnel,
et d'avoir à tout moment des applications web et android prêtent à être déployées. 

#### stages : 
		
1. build : 
		- build de l'apk pour le mobile et de de l'image docker pour le web. \n
		- réalisé à chaque commit sur main ou release pour avoir une version prête à déployer. \n
		- image docker stocké sur le dépot docker de l'équipe. \n
		- apk envoyé vers les artefacts du pipeline. \n

2. lint et tests : 
		- linting et tests unitaires du code. \n
		- réalisé à chaque commit sur la branche dev pour vérifier que le code marche encore. \n
		- résultats affiché dans les pages. \n
 
3. pages : 
		- affiche les résultats du linting et des tests. 


