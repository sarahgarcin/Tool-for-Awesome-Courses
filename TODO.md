# TO DO
- il faut utiliser chromium ou chrome !
- Debug
- Séparer le css "poster" du css "interface" pour que les étudiants puissent aller fouiller dedans
- ? bug: à l'export des images ne passent pas
- Ajouter la sligoil dans les fonts + ortica 
- Ajouter des fonts
- Ajouter un onglet HTML pour faire apparaître le HTML
- Ajouter un bouton zoom 
- Ajouter des promises dans addNewImage


## Options
- Store json into sessionStorage
  + https://stackoverflow.com/questions/6193574/save-javascript-objects-in-sessionstorage
- Ajouter des couleurs dans l'éditeur css
  + https://github.com/codemirror/codemirror5/blob/master/mode/css/css.js



# DONE 
- ok - Faire en sorte que tout se mette à jour à droite dans le panneau gui en fonction de l'éditeur css + que tout s'enregistre bien dans le json 
  + je l'ai fait pour le texte et background 
  + je l'ai fait pour les images
    * ok - pour l'image ça marche à moitié, il faut ajouter ```#block-1 img {filter: grayscale(1) contrast(1.5); mix-blend-mode: screen;}``` quand on ajouter l'option mononchrome voir ligne 354
  + manque : motif background // pour l'instant je l'ai désactivé c'est un peu complexe
- // Mettre un onglet js et faire apparaître le code js de génération de motif
- ok - bug: quand on modifie le css avec des propriétés nouvelles, elles ne s'enregistrent pas vraiment et quand on rajoute un nouveau bloc, elles disparaissent.
- ok - résoudre le problème du width : à mettre en nombre
- ok - https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
  + Transforme le css en objet js
- ok - Ajouter une jauge avec des niveaux "noob", "moyen", "baby hacker", "expert"
- ok - Cleaner les noms des inputs (enlever TextWidth pour remplacer par blockWidth par exemple -- puisque ça s'applique aux deux)
- ok - Bug à l'ajout d'une image
- ok - Design / Ergonomie / responsive !!
- ok - Ajouter une grille
- ok - Ajouter des promises
- ok - Ajouter des fonctions -- notamment pour les modifictions qui sont toujours les mêmes…
- ok - Ajouter des templates model dans le html à cloner dans le js
- ok - Distinguer chaque élément et lier l'éditeur et l'aperçu (pour l'instant ça ne fonctinone qu'avec un seul éditeur)