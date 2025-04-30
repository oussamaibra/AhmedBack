export class StockByMagasin {
  quantiteInitiale: number;
  quantiteVendue: number;
  quantitePerdue: number;
  magasinId: string;
}
export class StockDTO {
  nom: string;
  image: string;
  reference: string;
  taille: number;
  prixAchat: number;
  prixVente: number;
  quantite: StockByMagasin[];
}
