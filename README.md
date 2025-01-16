# Baldur - Interface WEB et Mobile

## Description

Ce projet est une application web et mobile permettant de jouer à des quiz.

![Capture d'écran de la page d'accueil de l'application](assets-readme/ecran-principale.png "Capture d'écran de la page d'accueil de l'application")
![Capture d'écran de la page de jeu de l'application](assets-readme/ecran-game.png "Capture d'écran de la page du jeu de l'application")

### Fonctionnalités

- Jouer à des quiz
- Choisir différents mode de jeu (Standard, Compte à rebours, Scrum, Team)
- Jouer avec des questions textuelles, audios et avec images
- Gestion des utilisateurs
- Voir son tableau de bord lors que nous somme connecté
- Voir son historique de parties jouées
- Voir les statistiques des quiz que l'on a créé
- Créer des quiz
- Créer des questions (text, audio et image)
- Ajouter des images et des audios (et pouvoir les supprimer)
- Générer des réponses (textuelles) avec une intelligence artificielle

## Installation

### Production

Le projet est déployé sur un serveur OVH.

### Développement

Pour développer le projet, il est nécessaire d'avoir NodeJS installé sur le poste ainsi que les outils NPM.

Pour installer NodeJS, suivez les instructions sur le site officiel : [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

Ensuite, installez les outils NPM avec la commande suivante (dans le dossier **app**):

```bash
npm install
```

Une fois les outils installés, il est possible de lancer le projet  en mode développement avec la commande suivante :

```bash
npm start
```

Le projet est alors accessible à l'adresse [http://localhost:8081](http://localhost:8081).

Vous pouvez également utiliser l'application **Expo Go** pour essayer l'application sur votre téléphone qui servira d'émulateur. Vous aurez juste à scanner le QR Code présent dans le terminal où le projet à été démarrer.

## Utilisation

Le projet est accessible à l'adresse [https://luoja.fr](https://luoja.fr).

Vous pouvez soit jouer en étant pas connecté en cliquant sur le bouton **Quiz Rapide**, vous pouvez configurer les paramètres selon vos désirs et jouer.

Sinon, vous devez vous connecter pour avoir accès aux autres fonctionnalités. Sur web, vous pouvez cliquer sur le bouton **Votre compte** dans la bar de navigation. Sur mobile, vous trouverez le bouton dans le drawer qui se trouvé en haut à gauche.

Une fois connecté, vous pouvez créer un quiz à l'aide de bouton **Créer votre propre quiz**. Cette fonctionnalité est disponible uniquement sur web ! Vous pouvez soit importé des questions déjà existante soit créer les votre à l'aide des boutons prévus à cette effet. Vous pouvez définir un thème et une difficulté, ces paramètres serviront de filtre pour les joueurs voulant jouer aux quiz créés par la communauté.

Vous pouvez jouer aux quiz crées par la communauté en cliquant sur le bouton **Quiz de la communauté**, vous pouvez filtrer les quiz selon le thème ou encore la difficulté.

Une fois le quiz choisi, vous pouvez choisir un mode de jeu selon votre envie. Le mode **standard** est le mode par défault qui est présent pour les quiz rapides. Pour plus de difficulté, vous pouvez joué en mode **Compte à rebours**, qui ajoutera du temps pour répondre à chaque question.

Si vous voulez jouer avec vos amis, vous avez deux modes disponibles. Tout d'abord le mode **Scrum**, où le premier joueur à répondre la bonne réponse gagne un point, le joueur ayant le plus de point à la fin de la partie gagne. Et enfin le mode **Team**, ce mode permet, comme son nom l'indique, de jouer en équipe, plusieurs équipes s'affronte, chaque équipe joue normalement la partie. A la fin de la partie, l'équipe ayant le plus de point, gagne.

Pour les modes multijoueurs, lorsque vous créé la partie, vous aurez un code et un QR Code que vous pouvez transmettre à vos amis, ils permettent de rejoindre la partie. Pour rejoindre la partie, vous pouvez cliquer sur **Rejoindre une partie**, sur mobile, vous avez le choix de soit rejoindre par le code, soit par le scan du QR Code, sur la version web, le seul moyen pour rejoindre est le code. Ensuite, le créateur de la partie pourra lancer la partie.


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
		- build de l'apk pour le mobile et de de l'image docker pour le web.  
		- réalisé à chaque commit sur main ou release pour avoir une version prête à déployer.  
		- image docker stocké sur le dépot docker de l'équipe.  
		- apk envoyé vers les artefacts du pipeline.  

2. lint et tests :   
		- linting et tests unitaires du code.  
		- réalisé à chaque commit sur la branche dev pour vérifier que le code marche encore.  
		- résultats affiché dans les pages.  
 
3. pages :   
		- affiche les résultats du linting et des tests.   


