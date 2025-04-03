export class Coordinate {
  longitude: string;
  latitude: string;
}
export class SolialMedia {
  type: string;
  link: string;
}

export class EtablissementDTO {
  name: string;
  avatar: string;
  couverture: string;
  rating: string;
  multimedia: string;
  ville: string;
  codePostal: string;
  location: string;
  description: string;
  phone: string;
  minPrice: string;
  maxPrice: string;
  coordinate: Coordinate;
  solialMedia: SolialMedia[];
  nbfollowersMin: string;
  nbhoursMin: string;
  recId: string;
}
