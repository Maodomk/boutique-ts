import "./style.css";
import { catalogue } from "./catalogue.ts";
import { formatPrix } from "./outils.ts";
import { ajouterAuPanier, retirerDuPanier, nombreArticles, totalPanier } from "./panier.ts";
import type { LignePanier, Produit } from "./types.ts";

function trouver<T extends HTMLElement>(selecteur: string): T {
  const element = document.querySelector<T>(selecteur);
  if (!element) {
    throw new Error(`Élément ${selecteur} introuvable : vérifiez index.html`);
  }
  return element;
}

const zoneCatalogue = trouver<HTMLDivElement>("#catalogue");
const listePanier = trouver<HTMLUListElement>("#lignes-panier");
const zoneTotal = trouver<HTMLElement>("#total");
const compteur = trouver<HTMLSpanElement>("#compteur");
const champRecherche = trouver<HTMLInputElement>("#recherche");
const filtreCategorie = trouver<HTMLSelectElement>("#filtre-categorie");

let panier: LignePanier[] = [];

function creerCarte(produit: Produit): HTMLElement {
  const carte = document.createElement("article");
  carte.className = "carte";

  const titre = document.createElement("h3");
  titre.textContent = produit.nom;

  const prix = document.createElement("p");
  prix.className = "prix";
  prix.textContent = formatPrix(produit.prix);

  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.textContent = "Ajouter au panier";

  if (produit.stock === 0) {
    bouton.textContent = "Épuisé";
    bouton.disabled = true;
  }

  bouton.addEventListener("click", () => {
    panier = ajouterAuPanier(panier, produit);
    afficherPanier();
  });

  carte.append(titre, prix, bouton);
  return carte;
}

function creerLignePanier(ligne: LignePanier): HTMLLIElement {
  const li = document.createElement("li");
  li.textContent = `${ligne.quantite} x ${ligne.produit.nom} : ${formatPrix(ligne.produit.prix * ligne.quantite)} `;

  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.textContent = "Retirer";
  bouton.addEventListener("click", () => {
    panier = retirerDuPanier(panier, ligne.produit.id);
    afficherPanier();
  });

  li.append(bouton);
  return li;
}

function afficherPanier(): void {
  listePanier.replaceChildren(...panier.map(creerLignePanier));
  zoneTotal.textContent = formatPrix(totalPanier(panier));
  compteur.textContent = String(nombreArticles(panier));
}

function produitsAffiches(): Produit[] {
  const categorie = filtreCategorie.value;
  const texte = champRecherche.value.trim().toLowerCase();

  return catalogue.filter((produit) => {
    const bonneCategorie = categorie === "toutes" || produit.categorie === categorie;
    const bonNom = produit.nom.toLowerCase().includes(texte);
    return bonneCategorie && bonNom;
  });
}

function afficherCatalogue(): void {
  const produits = produitsAffiches();

  if (produits.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Aucun produit ne correspond à votre recherche.";
    zoneCatalogue.replaceChildren(message);
    return;
  }

  zoneCatalogue.replaceChildren(...produits.map(creerCarte));
}

champRecherche.addEventListener("input", afficherCatalogue);
filtreCategorie.addEventListener("change", afficherCatalogue);

console.log("La boutique démarre");

afficherCatalogue();
afficherPanier();