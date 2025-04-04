export class CreateClientDto {
  readonly nom: string;
  readonly adresse: string;
  readonly telephone: string;
  readonly email?: string;
  readonly notes?: string;
}
