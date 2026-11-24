import type { LignePanier, Produit } from "./types.ts";

export function ajouterAuPanier(panier: LignePanier[], produit: Produit): LignePanier[] {
  const existe = panier.some((ligne) => ligne.produit.id === produit.id);
  if (!existe) {
    return [...panier, { produit, quantite: 1 }];
  }
  return panier.map((ligne) =>
    ligne.produit.id === produit.id ? { ...ligne, quantite: ligne.quantite + 1 } : ligne
  );
}

export function retirerDuPanier(panier: LignePanier[], id: number): LignePanier[] {
  return panier.filter((ligne) => ligne.produit.id !== id);
}

export function nombreArticles(panier: LignePanier[]): number {
  return panier.reduce((somme, ligne) => somme + ligne.quantite, 0);
}

export function totalPanier(panier: LignePanier[]): number {
  return panier.reduce((total, ligne) => total + ligne.produit.prix * ligne.quantite, 0);
}