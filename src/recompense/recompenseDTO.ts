export class PointsRate {
  min: string;
  max: string;
}

export class RecompenseOption {
  type: string;
  pointsRate: PointsRate;
  exemple: string;
}

export class RecompenseDTO {
  etabId: string;
  name: string;
  status: string;
  recompenseOption: RecompenseOption[];
}
