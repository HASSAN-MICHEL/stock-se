let nom = prompt("entrer votre nom");
let prenom = prompt("entrrer votre prenom");
let anne_naissance = parseInt("entrer votre anne de naissance");
let anne_actue = parseInt ("entrer l'annee actuell");

let age = anne_actue - anne_naissance;

alert ("Bonjour Mr" + nom +"" + prenom + "vous avez" + age + "ans");