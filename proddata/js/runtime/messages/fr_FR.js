//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2018 Profound Logic Software, Inc.
//
//  This file is part of the Profound UI Runtime
//
//  The Profound UI Runtime is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  The Profound UI Runtime is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

// ------------------------------------------------------------
//  Viva la France!
// -------------------------------------------------------------
var fr_FR = function(dict) {

    var dictMsg = {};

    switch (dict) {

        case "runtimeMsg":
            dictMsg["closeMessage"]                 = "Ceci terminera votre session.";
            dictMsg["no connection message"]        = "Impossible d'établir une connexion au serveur. S'il vous plaît, vérifiez la connexion et essayez à nouveau.";
            dictMsg["upload file limit"]            = "Limite de &1 fichier(s) dépassée.";
            dictMsg["upload size limit"]            = "Limite de &1MB par fichier dépassée.";
            dictMsg["upload no files"]              = "Pas de fichiers sélectionnés.";
            dictMsg["upload duplicate file"]        = "Fichiers sélectionnés en double.";
            dictMsg["upload file exists"]           = "Un ou plusieurs fichiers existent déjà dans le système de fichiers.";
            dictMsg["upload prevented"]             = "Opération empêchée par «exit program».";
            dictMsg["upload input limit"]           = "Limite de taille totale des données dépassée.";
            dictMsg["upload no session"]            = "Vous n'êtes pas connecté(e) à une session valide.";
            dictMsg["upload timeout"]               = "Le temps limite pour la transaction a été dépassé.";
            dictMsg["upload invalid response"]      = "Le serveur ne répond pas ou n'est pas joignable.";  //Also used in Atrium for Ajax error.
            dictMsg["upload cancelled"]             = "Téléversement annulé";
            dictMsg["close browser text"]           = "Pour terminer la session, veuillez fermez la fenêtre du navigateur.";
            dictMsg["session ended text"]           = "Votre session est terminée.";
            dictMsg["outside ucs2"]                 = 'Caractères en dehors de la norme UCS-2.';
            dictMsg["invalid number"]               = "&1 n'est pas un nombre valide.";
            dictMsg["invalid length"]               = '&1 a une longueur ou une position de décimale incorrecte.';
            dictMsg["invalid decimal"]              = "&1 comporte trop de décimales. (max: &2)";
            dictMsg["invalid choice"]               = "\"&1\" est incorrect. Les choix possibles sont: \"&2\" ou \"&3\".";
            dictMsg["invalid date"]                 = "\"&1\" n'est pas une date valide. Exemple de format correct: &2";
            dictMsg["invalid time"]                 = "\"&1\" n'est pas une heure valide. Exemple de format correct: &2";
            dictMsg["invalid time stamp"]           = "\"&1\" n'est pas un horodatage valide. Exemple de format correct: &2";
            dictMsg["invalid percent"]              = "&1 n'est pas une décimale valide.";
            dictMsg["invalid digits"]               = "\"&1\" contient un nombre de chiffres trop élévé. Max: &2";
            dictMsg["exceeds whole"]                = '"&1" dépasse le nombre maximum de chiffres pour la partie numérique du champ (&2 digits).';
            dictMsg["exceeds decimal"]              = '"&1" dépasse le nombre maximum de chiffres pour la partie décimale du champ (&2 digits).';
            dictMsg["zip too long"]                 = 'Le code postal est trop long. (Maximum: &1 digits)';
            dictMsg["phone too long"]               = 'Le numéro de téléphone est trop long. (Maximum: &1 digits)';
            dictMsg["ssno too long"]                = 'Le code de sécurité sociale est trop long. (Maximum: &1 digits)';
            dictMsg["invalid custom val"]           = 'La fonction de validation personnalisée est invalide.';
            dictMsg["error custom val"]             = 'Erreur dans la fonction de validation personnalisée.';
            dictMsg["ME"]                           = "Ce champ est obligatoire.";
            dictMsg["MF"]                           = "Tous les caractères de ce champ doivent être saisis.";
            dictMsg["required"]                     = "Ce champ est obligatoire et ne peut être à blanc.";
            dictMsg["file required"]                = "Vous devez sélectionner au moins un fichier.";
            dictMsg["signature overflow"]           = "L'image de la signature dépasse le nombre maximum de bytes disponibles pour son stockage. S'il vous plaît, effacez la signature et essayez à nouveau.";
            dictMsg["validValues"]                  = "La valeur saisie n'est pas valide. Les valeurs valides sont: ";
            dictMsg["upload invalid type"]          = "Un ou plusieurs fichiers sont de type invalide.";
            dictMsg["invalid email"]                = "Adresse email invalide.";
            dictMsg["session timed out"]            = "Votre session a expiré.";
            dictMsg["invalid low range"]            = "La valeur doit être supérieure ou égale à &1";
            dictMsg["invalid high range"]           = "La valeur doit être inférieure ou égale à &1";
            dictMsg["invalid range"]                = "La valeur doit être comprise entre &1 et &2.";
            dictMsg["unmonitored exception"]        = "Le programme a rencontré une erreur non prévue. Prière de contacter l'administrateur système pour toute assistance.";
            dictMsg["loading x"]                    = "Chargement de &1...";
            dictMsg["data src not specfd x"]        = "Source des données non spécifiée pour &1...";
            dictMsg["name fld not specfd x"]        = "Nom du champ non spécifié pour &1...";
            dictMsg["val fld not specfd x"]         = "Valeur du champ non spécifiée pour &1...";
            dictMsg["failed to load x"]             = "Échec du chargement de &1.";
            dictMsg["cannot rmv last col"]          = "Vous ne pouvez pas supprimer la dernière colonne.";
            dictMsg["cannot find col"]              = "Impossible de trouver la colonne indiquée.";
            dictMsg["subfile deletion"]             = "Êtes-vous certain de vouloir supprimer le sous-fichier?";
            dictMsg["downloading x"]                = "Téléchargement de &1";
            dictMsg["ie9 too low xlsxpics"]         = "Les images ne peuvent pas être exportées sous IE9 ou version antérieure.";
			dictMsg["keyboard input inhibited"]     = "Keyboard entry not allowed in this field.";
			
            // Atrium only.
            dictMsg["num sessions exceeded"]        = "Nombre de sessions dépassé.";
            dictMsg["unable to load portal"]        = "Impossible de charger les paramètres ou les éléments de navigation du portail.";
            dictMsg["unable to load macr act"]      = "Impossible de charger les actions des macros.";
            dictMsg["unable to load macr var"]      = "Impossible de charger les variables des macros.";
            dictMsg["unable to load scrn lst"]      = "Impossible de charger la liste des écrans.";
            dictMsg["unable to load new sett"]      = "Impossible de charger les nouveaux paramètres.";
            dictMsg["unable to load x"]             = "Impossible de charger &1.";
            dictMsg["unable to add x"]              = "Impossible d'ajouter &1.";
            dictMsg["unable to rename x"]           = "Impossible de renommer &1.";
            dictMsg["unable to delete x"]           = "Impossible de supprimer &1.";
            dictMsg["unable to update x"]           = "Impossible de mettre à jour &1.";
            dictMsg["unable to reassn x"]           = "Impossible de réassigner &1.";
            dictMsg["unable to reorder items"]      = "Impossible de réordonner les éléments.";
            dictMsg["unable to save theme"]         = "Impossible d'enregistrer le paramètre du thème.";
            dictMsg["unable eval script url"]       = "Impossible d'évaluer le script d'URL de l'application Web.";
            dictMsg["close browser text AT"]        = "Les modifications non enregistrées de la session ou des sessions seront perdus.";
            dictMsg["close all tabs"]               = "Fermer tous les onglets ?";
            dictMsg["close tab"]                    = "Voulez-vous fermer cet onglet ?";
            dictMsg["invalid script url"]           = "Valeurs invalides dans le script d'URL de l'application Web.";
            dictMsg["unrecognized format"]          = "Format non reconnu.";
            dictMsg["screen already defined"]       = "Écran \"&1\" déjà défini.";
            dictMsg["macro already defined"]        = "Macro \"&1\" déjà définie.";
            dictMsg["no screen ids"]                = "Il n'y a aucun identifiant d'écran à afficher";
            dictMsg["confirm delete"]               = "Confirmer la suppression";
            dictMsg["no actions"]                   = "Il n'y a aucune action à afficher";
            dictMsg["msg action input var"]         = "Entrer la valeur de la variable \"&1\" dans le champ en ligne &2 colonne &3.";
            dictMsg["msg action input user"]        = "Entrer le profil de l'utilisateur en cours dans le champ en ligne &1 colonne &2.";
            dictMsg["msg action input js"]          = "Entrer le résultat de l'expression JavaScript <strong>&1</strong> dans le champ en ligne &2 colonne &3.";
            dictMsg["msg action input other"]       = "Entrer la valeur \"&1\" dans le champ en ligne &2 colonne &3.";
            dictMsg["msg presskey var"]             = "Appuyer sur la touche définie dans la variable \"&1\".";
            dictMsg["msg presskey other"]           = "Appuyer sur la touche \"&1\".";
            dictMsg["msg del scrn from macro"]      = "Êtes-vous sûr(e) de vouloir supprimer le(s) écran(s) sélectionné(s) de cette macro ?<br /> Toutes les actions associées seront aussi supprimées.";
            dictMsg["choose scrn macro"]            = "Choisir un écran ou une macro pour définir ses propriétés.";
            dictMsg["choose a nav or toolbar"]      = "Choisir un élément de navigation ou de barre d'outils pour définir ses propriétés.";
            dictMsg["confirm del sel x"]            = "Êtes-vous sûr(e) de vouloir supprimer le/la &1 sélectionné(e) ?";
            dictMsg["permission settings"]          = "paramètre(s) d'autorisation";
            dictMsg["adding x"]                     = "Ajout en cours de &1...";
            dictMsg["deleting x"]                   = "Suppession en cours de &1 ...";
            dictMsg["reassigning x"]                = "Réassignement en cuors de &1...";
            dictMsg["loading"]                      = "Chargement...";
            dictMsg["saving"]                       = "Enregistrement en cours...";
            dictMsg["x added"]                      = "&1 ajouté(e).";
            dictMsg["x deleted"]                    = "&1 supprimé(e).";
            dictMsg["x reassigned"]                 = "&1 réassigné(e).";
            dictMsg["x updated"]                    = "&1 mis(e) à jour.";
            dictMsg["x saved"]                      = "&1 enregistré(e).";
            dictMsg["msg del group"]                = "Êtes-vous sûr(e) de vouloir supprimer le groupe \"&1\" ?<br /><br />Supprimer des groupes entraîne aussi la suppression de tous les sous-groupes et de toutes les associations d'utilisateurs.<br /><br />Êtes-vous sûr(e) de vouloir continuer ?";
            dictMsg["conf reassign users 1"]        = "Êtes-vous sûr(e) de vouloir réassigner ";
            dictMsg["conf reassign users 2a"]       = "l'utilisateur \"&1\" ";
            dictMsg["conf reassign users 2b"]       = "les utilisateurs sélectionnés ";
            dictMsg["conf reassign users 3"]        = " au group \"&1\" ?";
            dictMsg["conf reassign group"]          = "Êtes-vous sûr(e) de vouloir réassigner le group \"&1\" au group \"&2\" ?";
            dictMsg["conf delete users 1"]          = "Êtes-vous sûr(e) de vouloir supprimer ";
            dictMsg["conf delete users 2a"]         = "l'utilisateur \"&1\" ?";
            dictMsg["conf delete users 2b"]         = "les utilisateurs sélectionnés ?";
            dictMsg["no users"]                     = "Il n'y a aucun utilisateur à  afficher.";
            dictMsg["cannot delete own grp"]        = "Vous ne pouvez pas supprimer votre propre groupe.";
            dictMsg["cannot delete own usr"]        = "Vous ne pouvez pas supprimer votre propre profil.";
            dictMsg["not auth reassign prf"]        = "Vous n'êtes pas autorisé(e) à réassigner votre propre profil.";
            dictMsg["typeselect macro name"]        = "Saisir ou sélectionner un nom de macro...";
            dictMsg["any child items will"]         = "Tout élément enfant sera aussi supprimé.";
            dictMsg["password must be"]             = "Les mots de passe doivent comporter au moins 6 caractères.";
            dictMsg["type or sel home page"]        = "Saisir ou sélectionner une page d'accueil...";
            dictMsg["x is already in list"]         = "\"&1\" figure déjà dans la liste.";
            dictMsg["x is not valid libname"]       = "\"&1\" n'est pas un nom valide de bibliothèque.";
            dictMsg["no libraries in list"]         = "Aucune bibliothèque dans la liste";
            dictMsg["add libl entry"]               = "Ajouter une entrée dans la liste de bibliothèque";
            dictMsg["would you like add ano"]       = "Voulez-vous en ajouter une autre ?";
            dictMsg["already in suppl grp x"]       = "L'utilisateur figure déjà dans le groupe supplémentaire \"&1\".";

            break;

        case "runtimeText":
            dictMsg["upload select text"]           = "Fichiers sélectionnés";
            dictMsg["upload clear text"]            = "Effacer";
            dictMsg["upload remove text"]           = "Retirer";
            dictMsg["upload upload text"]           = "Envoyer";
            dictMsg["upload drophere text"]         = "Déposer les fichiers ici.";
            dictMsg["upload browser unsupported"]   = "Glisser/déposer des fichiers requiert Internet Explorer 10 ou plus récent, Chrome, ou Firefox";
            dictMsg["upload finished text"]         = "Fini";
            dictMsg["excel export text"]            = "Exporter vers Excel";    //Replaces "csv export text".
            dictMsg["export to x"]                  = "Exporter vers &1";
            dictMsg["filter text"]                  = "Filtrer ";
            dictMsg["find text"]                    = "Trouver";
            dictMsg["reset data"]                   = "Réinitialiser";
            dictMsg["remove filters text"]          = "Supprimer tous les filtres";
            dictMsg["displayed columns"]            = "Colonnes affichées";
            dictMsg["next link text"]               = "Suivante";
            dictMsg["previous link text"]           = "Précédente";
            dictMsg["sort ascending text"]          = "Trier dans l'ordre croissant";
            dictMsg["sort descending text"]         = "Trier dans l'ordre décroissant";
            dictMsg["row"]                          = "ligne";
            dictMsg["rows"]                         = "lignes";
            dictMsg["page"]                         = "Page";
            dictMsg["collapseAll"]                  = "Tout replier";
            dictMsg["expandAll"]                    = "Tout déplier";
            dictMsg["user"]                         = "Utilisateur";
            dictMsg["password"]                     = "Mot de passe";
            dictMsg["sign on"]                      = "Identification";
            dictMsg["pui"]                          = "Profound UI";
            dictMsg["pui sign on"]                  = dictMsg["sign on"] + " " + dictMsg["pui"];
            dictMsg["pjs"]                          = "Profound.js";
            dictMsg["pjs sign on"]                  = dictMsg["sign on"] + " " + dictMsg["pjs"];
            dictMsg["message id"]                   = "N° du message";
            dictMsg["ctlr job"]                     = "Travail Serveur";
            dictMsg["app job"]                      = "Travail";
            dictMsg["joblog download"]              = "Télécharger l'Historique du Travail";
            dictMsg["curr user"]                    = "Utilisateur Courant";
            dictMsg["remote ip"]                    = "Adresse IP Distante";
            dictMsg["remote port"]                  = "Port Distant";
            dictMsg["severity"]                     = "Sévérité";
            dictMsg["date"]                         = "Date";
            dictMsg["time"]                         = "Heure";
            dictMsg["program"]                      = "Programme";
            dictMsg["procedure"]                    = "Procédure";
            dictMsg["lines"]                        = "Ligne(s)";
            dictMsg["message"]                      = "Message";
            dictMsg["new session"]                  = "Nouvelle Session";
            dictMsg["close"]                        = "Fermer";
            dictMsg["current password"]             = "Mot de passe actuel";
            dictMsg["new password"]                 = "Nouveau mot de passe";
            dictMsg["repeat new password"]          = "Répéter le nouveau mot de passe";
            dictMsg["submit"]                       = "Soumettre";
            dictMsg["exit"]                         = "Quitter";
            dictMsg["warning"]                      = "Avertissement";
            dictMsg["change password"]              = "Modifier le mot de passe";
            dictMsg["cancel"]                       = "Annuler";
            dictMsg["find text"]                    = "Trouver";
            dictMsg["remove filter"]                = "Supprimer le filtre";
            dictMsg["chart"]                        = "Graphe";
            dictMsg["section"]                      = "Section";
            dictMsg["version"]                      = "Version";
            dictMsg["fixPack"]                      = "Fix Pack";
            // Atrium only.
            dictMsg["yes"]                          = "Oui";
            dictMsg["no"]                           = "Non";
            dictMsg["settings"]                     = "Paramètres";
            dictMsg["favorites"]                    = "Favoris";
            dictMsg["type query press en"]          = "Saisir une requête, appuyer sur Entrée.";
            dictMsg["add to favorites"]             = "Ajouter aux Favoris";
            dictMsg["rmv from favorites"]           = "Supprimer des Favoris";
            dictMsg["please wait"]                  = "Veuillez patienter...";
            dictMsg["control panel"]                = "Panneau de contrôle";
            dictMsg["my settings"]                  = "Mes paramètres";
            dictMsg["about atrium"]                 = "À propos d'Atrium";
            dictMsg["about atrium msg"]             = dictMsg["version"] + " " + window["pui"]["baseVersion"] + ", " + dictMsg["fixPack"] + " " + window["pui"]["fixPackVersion"] + "<br /><br />"
                                                    + "Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
                                                    + "Attention: Ce logiciel est protégé par le code de la propriété intellectuelle<br />"
                                                    + "et des traités internationaux. Toute reproduction non autorisée ou<br />"
                                                    + "distribution de ce logiciel, même partielle, peut entraîner<br />"
                                                    + "de graves sanctions civiles ou pénales, et entraînera<br />"
                                                    + "les poursuites maximales possibles prévues par la loi.<br /><br />"
                                                    + "Breveté. &nbsp;U.S. Brevet No. 8,667,405 B2.";
            dictMsg["item"]                         = "Élément";
            dictMsg["open selected item"]           = "Ouvrir l'élément sélectionné";
            dictMsg["of"]                           = "de";
            dictMsg["no results to dsp"]            = "Aucun résultat à afficher.";
            dictMsg["displaying results"]           = "Résultats en cours d'affichage";
            dictMsg["search results"]               = "Recherche en cours";
            dictMsg["new folder"]                   = "Nouveau dossier";
            dictMsg["rename"]                       = "Renommer";
            dictMsg["description"]                  = "Description";
            dictMsg["ok"]                           = "OK";
            dictMsg["add"]                          = "Ajouter";
            dictMsg["add x"]                        = "Ajouter &1";
            dictMsg["delete"]                       = "Supprimer";
            dictMsg["screen"]                       = "Écran";
            dictMsg["screens"]                      = "Écrans";
            dictMsg["macro"]                        = "Macro";
            dictMsg["macros"]                       = "Macros";
            dictMsg["screen id"]                    = "Identifiant de l'écran";
            dictMsg["screen ids"]                   = "Identifiants d'écran";
            dictMsg["field row"]                    = "Champ Ligne";
            dictMsg["field column"]                 = "Champ Colonne";
            dictMsg["field value"]                  = "Valeur du champ";
            dictMsg["value"]                        = "Valeur";
            dictMsg["action"]                       = "Action";
            dictMsg["actions"]                      = "Actions";
            dictMsg["detect once"]                  = "Détection unique";
            dictMsg["delete screen"]                = "Supprimer Écran";
            dictMsg["genie macros"]                 = "Macros Genie";
            dictMsg["screen name"]                  = "Nom d'écran";
            dictMsg["identifier"]                   = "Identifiant";
            dictMsg["identifiers"]                  = "Identifiants";
            dictMsg["macro name"]                   = "Nom de la macro";
            dictMsg["close browser wintab"]         = "Fermer la fenêtre ou l'onglet du navigateur.";
            dictMsg["select"]                       = "Sélectionner";
            dictMsg["write value in field"]         = "Saisir une valeur dans un champ";
            dictMsg["press a key"]                  = "Appuyer sur une touche";
            dictMsg["a literal value"]              = "Une constante";
            dictMsg["a variable value"]             = "Une variable";
            dictMsg["cur user profile"]             = "Le profil utilisateur en cours";
            dictMsg["result js expr"]               = "Le résultat d'une expression JavaScript";
            dictMsg["action data"]                  = "Donnée de l'action";
            dictMsg["data type"]                    = "Type de donnée";
            dictMsg["users"]                        = "Utilisateurs";
            dictMsg["all groups"]                   = "Tous les groupes";
            dictMsg["supplemental groups"]          = "Groupes supplémentaires";
            dictMsg["users w primary grp"]          = "Utilisateurs dont le groupe principal est \"&1\"";
            dictMsg["users w suppl grp"]            = "Utilisateurs ayant pour groupe supplémentaire \"&1\"";
            dictMsg["group"]                        = "Groupe";
            dictMsg["groups"]                       = "Groupes";
            dictMsg["edit"]                         = "Modifier";
            dictMsg["edit x"]                       = "Modifier &1";
            dictMsg["manager"]                      = "Gérer";
            dictMsg["administrator"]                = "Administrateur";
            dictMsg["primary group"]                = "Groupe principal";
            dictMsg["delete x"]                     = "Supprimer &1";
            dictMsg["reassign x"]                   = "Réassigner &1";
            dictMsg["navigation item"]              = "Élément de Navigation";
            dictMsg["navigation items"]             = "Éléments de Navigation";
            dictMsg["navigation panel"]             = "Panneau de Navigation";
            dictMsg["home pages"]                   = "Pages d'accueil";
            dictMsg["menu group"]                   = "Groupe de Menu";
            dictMsg["menu item"]                    = "Élément de Menu";
            dictMsg["toolbar items"]                = "Éléments de Barre d'outils";
            dictMsg["toolbar"]                      = "Barre d'outils";
            dictMsg["button"]                       = "Bouton";
            dictMsg["pulldown menu"]                = "Menu déroulant";
            dictMsg["pulldown menu item"]           = "Élément de Menu déroulant";
            dictMsg["separator bar"]                = "Barre de séparation";
            dictMsg["spacer"]                       = "Espace";
            dictMsg["item details"]                 = "Détail de l'élément";
            dictMsg["item number"]                  = "N° de l'élément";
            dictMsg["item type"]                    = "Type d'élément";
            dictMsg["genie macro"]                  = "Macro Genie";
            dictMsg["rdf application"]              = "Application Rich Display File";
            dictMsg["web application"]              = "Application web";
            dictMsg["pc command"]                   = "Commande PC";
            dictMsg["dspf program library"]         = "Bibliothèque du programme";
            dictMsg["dspf program"]                 = "Nom du programme";
            dictMsg["variable name x"]              = "Nom de Variable &1";
            dictMsg["a tab in the portal"]          = "Un onglet dans le portail";
            dictMsg["a new browser wind"]           = "Une nouvelle fenêtre ou onglet du navigateur";
            dictMsg["update"]                       = "Mettre à jour";
            dictMsg["fill"]                         = "Remplir";
            dictMsg["permissions"]                  = "Autorisations";
            dictMsg["user/group name"]              = "Nom Utilisateur/Groupe";
            dictMsg["all users groups"]             = "Tous les Utilisateurs et Groupes";
            dictMsg["type"]                         = "Type";
            dictMsg["access"]                       = "Droit";
            dictMsg["allow"]                        = "Autoriser";
            dictMsg["disallow"]                     = "Interdire";
            dictMsg["navigation"]                   = "Navigation";
            dictMsg["add usrgrp perm"]              = "Ajouter des Autorisations Utilisateur/Groupe";
            dictMsg["membership"]                   = "Appartenance";
            dictMsg["none"]                         = "Aucun";
            dictMsg["remove"]                       = "Supprimer";
            dictMsg["appearance"]                   = "Apparence";
            dictMsg["home page"]                    = "Page d'accueil";
            dictMsg["tree"]                         = "Ramification";
            dictMsg["accordion"]                    = "Accordéon";
            dictMsg["min search chars"]             = "Caractères minimum de recherche";
            dictMsg["libl for rdf apps"]            = "Liste des bibliothèques pour les applications Rich Display File";
            dictMsg["library list"]                 = "Liste des bibliothèques";
            dictMsg["library"]                      = "Bibliothèque";
            dictMsg["use atrium def libl"]          = "Utiliser la liste des bibliothèques par défaut de l'Atrium";
            dictMsg["use jobd libl"]                = "Utiliser la liste des bibliothèques de la JOBD";
            dictMsg["specify libl"]                 = "Spécifier la liste des bibliothèques";
            dictMsg["up"]                           = "Haut";
            dictMsg["down"]                         = "Bas";
            dictMsg["move up"]                      = "Déplacer vers le haut";
            dictMsg["move down"]                    = "Déplacer vers le bas";
            dictMsg["global settings"]              = "Paramètres généraux";
            dictMsg["save"]                         = "Enregistrer";
            dictMsg["add usr to supp grp"]          = "Ajouter un utilisateur à un Groupe Supplémentaire";
            // Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
            dictMsg["member of"]                    = "Membre de";
            dictMsg["member of hlp"]                = "Le groupe auquel appartient cet utilisateur/groupe.";
            dictMsg["group name"]                   = "Nom du Groupe";
            dictMsg["group name hlp"]               = "Le nom affiché pour ce Groupe.";
            dictMsg["inherit settings"]             = "Hériter des paramètres";
            dictMsg["inherit settings hlp"]         = "Si cette option est cochée, l'utilisateur/groupe héritera des paramètres de son parent. Si décochée, l'utilisateur/groupe aura ses propres données de paramètres.";
            dictMsg["user name"]                    = "Nom d'utilisateur";
            dictMsg["user name hlp"]                = "Nom affiché pour cet utilisateur.";
            dictMsg["access role"]                  = "Rôle";
            dictMsg["access role hlp"]              = "Contrôle le rôle de cet utilisateur. Les Administrateurs peuvent gérer tous les groupes et utilisateurs, et peuvent aussi gérer les droits des éléments. Les Managers peuvent configurer les paramètres des groupes et utilisateurs au sein de leur propre groupe. Les Utilisateurs n'ont aucun privilège.";
            dictMsg["can edit profile"]             = "Peut modifier un profil";
            dictMsg["can edit profile hlp"]         = "Autorise l'utilisateur à modifier les paramètres \"d'apparence\" et \"de navigation\" , et à modifier le mot de passe. Aucun autre paramètre n'est modifiable par l'utilisateur.";
            dictMsg["user profile"]                 = "Profil Utilisateur";
            dictMsg["user profile hlp"]             = "Le nom du profil utilisateur. Les noms des profils utilisateurs sont sensibles à la casse, sauf pour les profils IBM i.";
            dictMsg["password hlp"]                 = "Définir/réinitialiser le mot de passe. Les mots de passe sont sensibles à la casse.";
            dictMsg["conf password"]                = "Confirmer le Mot de passe";
            dictMsg["conf password hlp"]            = "Quand le Mot de passe est défini/réinitialisé, ce champ doit correspondre au nouveau Mot de passe. Les mots de passe sont sensibles à la casse.";
            // Atrium.help tool-tip - User/group Appearance preferences.
            dictMsg["browser title"]                = "Titre du Navigateur";
            dictMsg["browser title hlp"]            = "Définit le texte affiché dans la barre de titre du navigateur.";
            dictMsg["show banner"]                  = "Afficher la bannière";
            dictMsg["show banner hlp"]              = "Décocher cette option si vous ne souhaitez pas afficher la bannière en haut du portail.";
            dictMsg["banner height"]                = "Hauteur de la bannière";
            dictMsg["banner height hlp"]            = "Définit en pixels la hauteur de la bannière en haut du portail. Ce paramètre est ignoré si vous avez choisi de ne pas afficher la bannière. Plage des valeurs valides : 0 à 600 pixels.";
            dictMsg["banner url"]                   = "URL de la bannière";
            dictMsg["banner url hlp"]               = "Définit l'URL du contenu de la bannière. L'URL peut être aboslue ou relative.";
            dictMsg["theme"]                        = "Thème";
            dictMsg["theme hlp"]                    = "Définit le Thème par défaut. Ce paramètre peut être écrasé individuellement par chaque utilisateur si <strong>\"Autoriser l'utilisateur à choisir le thème\"</strong> est activé.";
            dictMsg["allow sel theme"]              = "Autoriser l'utilisateur à choisir le thème";
            dictMsg["allow sel theme hlp"]          = "Si coché, les utilisateurs auront la possibilité de choisir le thème via un menu déroulant dans la barre d'outils.";
            dictMsg["show menu search"]             = "Afficher la zone de recherche";
            dictMsg["show menu search hlp"]         = "Décocher pour masquer la zone de recherche.";
            dictMsg["show fav sys"]                 = "Afficher les Favoris";
            dictMsg["show fav sys hlp"]             = "Décocher pour masquer les Favoris.";
            dictMsg["show fav start"]               = "Afficher les Favoris au démarrage";
            dictMsg["show fav start hlp"]           = "Si coché, le panneau des Favoris sera affiché au démarrage. Sinon, le Panneau de navigation sera affiché (par défaut). Cette option n'est disponible que si le système de Favoris est actifa été activé.";
            dictMsg["limit num sessn"]              = "Limiter le nombre de sessions";
            dictMsg["limit num sessn hlp"]          = "Nombre maximum de sessions autorisé par l'Atrium pour cet utilisateur/groupe. Une valeur de zéro correspond à un nombre illimité de sessions. La limite est fixée par navigateur.";
            // Atrium.help tool-tip - User/Group navigation preferences.
            dictMsg["show hmpg start"]              = "Afficher la page d'accueil au démarrage";
            dictMsg["show hmpg start hlp"]          = "Si coché, une page d'accueil personnalisable sera affichée au démarrage.";
            dictMsg["home page url"]                = "URL de la page d'accueil";
            dictMsg["home page url hlp"]            = "Définit l'URL du contenu de la page d'accueil. L'URL peut être aboslue ou relative.";
            dictMsg["navi pnl title"]               = "Titre du panneau de Navigation";
            dictMsg["navi pnl title hlp"]           = "Définit le texte à afficher dans la barre de titre du panneau de Navigation.";
            dictMsg["navi pnl width"]               = "Largeur initiale du panneau de Navigation";
            dictMsg["navi pnl width hlp"]           = "Définit en pixels la largeur initiale du panneau de Navigation. L'utilisateur peut modifier ou même masquer le panneau à sa guise. Plage des valeurs valides : 0-2000 pixels.";
            dictMsg["navi type"]                    = "Type de Navigation";
            dictMsg["navi type hlp"]                = "Contrôle le type de menu utilisé dans le panneau de Navigation, \"ramification\" ou \"accordéon\". Ce paramètre ne s'applique pas aux barres d'outils.";
            dictMsg["single click nav"]             = "Navigation en un clic";
            dictMsg["single click nav hlp"]         = "Si coché, les éléments du menu dans le panneau de Navigation seront exécuté sur un simple clic. Sinon, ils ne seront exécutés qu'après un double-clic. Ce paramètre ne s'applique pas aux barres d'outils.";
            // Atrium.help tool-tip - Library list.
            dictMsg["current library"]              = "Bibliothèque en cours";
            dictMsg["current library hlp"]          = "Spécifie la bibliothèque en cours, *USRPRF or *CRTDFT.";
            dictMsg["job descr"]                    = "Description du job";
            dictMsg["job descr hlp"]                = "Spécifie la description du job afin d'en déduire la liste des bibliothèques. *USRPRF peut être spécifié si les utilisateurs de l'Atrium ont des profils IBM i.";
            dictMsg["job descr lib"]                = "Bibliothèque de la description du job";
            dictMsg["job descr lib hlp"]            = "Spécifie la bibliothèque pour la description du job. *LIBL ou *CURLIB peuvent être spécifiées.";
            // Atrium.help tool-tip - Navigation / Toolbar items.
            dictMsg["item name"]                    = "Nom de l'élément";
            dictMsg["item name hlp"]                = "Définit le nom d'affichage de l'élément de navigation ou de la barre d'outils.";
            dictMsg["action type"]                  = "Type d'action";
            dictMsg["action type hlp"]              = "Définit le type de l'application lancée par cet élément.";
            dictMsg["url"]                          = "URL";
            dictMsg["url hlp"]                      = "Définit l'URL de l'application Web. L'URL peut être aboslue ou relative. Des paramètres de requête peuvent être spécifiés dans l'URL.";
            dictMsg["genie url"]                    = "URL Genie";
            dictMsg["genie url hlp"]                = "Définit l'URL utilisée pour lancer le Genie. Si non spécifiée, l'URL Genie par défaut /profoundui/auth/genie sera utilisée. Ce champ est utile dans le cas d'une URL Genie personnalisée ou lorsque des paramètres de requêtes sont nécessaires. par exemple : /profoundui/auth/genie?skin=MyCompany";
            dictMsg["open as"]                      = "Ouvrir en tant que";
            dictMsg["open as hlp"]                  = "Définit si l'élément doit être ouvert dans un nouvel onglet du portail ou en tant que nouvelle fenêtre/nouvel onglet du navigateur. L'utilisation d'une fenêtre ou onglet du navigateur dépend des réglages de celui-ci.";
            dictMsg["opens once only"]              = "Exécution unique";
            dictMsg["opens once only hlp"]          = "Par défaut, si l'utilisateur exécute l'élément alors que celui-ci est déjà ouvert dans le portail, un nouvel onglet est utilisé. Il n'y a pas de limite du nombre d'onglets que l'utilisateur est capable d'ouvrir de cette façon. Quand cette option est cochée, l'utilisateur ne pourra ouvrir qu'un seul onglet correspondant à cet élément. Si l'onglet est déjà ouvert, le fait d'exécuter l'élément activera cet onglet. Cette option est ignorée si l'élément s'ouvre dans une nouvelle fenêtre ou un nouvel onglet du navigateur.";
            dictMsg["icon"]                         = "Icône";
            dictMsg["icon hlp"]                     = "Optionnel. Définit l'icône utilisée dans le menu de navigation ou la barre d'outils. L'icône peut être au format GIF, JPG ou PNG. Les GIF transparents sont recommandés. Le chemin devra être spécifié en absolu depuis le répertoire racine d'installation de l'Atrium. Si aucune icône n'est spécifiée, l'Atrium utilisera l'icône par défaut pour les éléments de navigation. Aucune icône ne sera affichée pour les éléments de la barre d'outils sauf si spécifiée ici.";
            dictMsg["parameter"]                    = "Paramètre";
            dictMsg["parameter hlp"]                = "Optionnel: Spécifie un paramètre qui sera passé au program Rich Display lors de son exécution.";

            break;

        default:
            console.log("Unknown Dictionary Type : '" + dict + "'");
    }

    return dictMsg;
};