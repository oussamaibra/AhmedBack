export class Carrier {
  name?: null;
  mcc?: null;
  mnc?: null;
}
export class Company {
  domain: string;
  name: string;
  type: string;
}
export class Connection {
  asn: number;
  domain: string;
  organization: string;
  route: string;
  type: string;
}
export class Currency {
  code: string;
  name: string;
  name_native: string;
  plural: string;
  plural_native: string;
  symbol: string;
  symbol_native: string;
  format: Format;
}
export class Format {
  negative: NegativeOrPositive;
  positive: NegativeOrPositive;
}
export class NegativeOrPositive {
  prefix: string;
  suffix: string;
}
export class Location {
  continent: ContinentOrRegion;
  country: Country;
  region: ContinentOrRegion;
  city: string;
  postal?: null;
  latitude: number;
  longitude: number;
  language: LanguagesEntityOrLanguage;
  in_eu: boolean;
}
export class ContinentOrRegion {
  code: string;
  name: string;
}
export class LanguagesEntityOrLanguage {
  code: string;
  name: string;
  native: string;
}

export class Country {
  area: number;
  borders?: string[] | null;
  calling_code: string;
  capital: string;
  code: string;
  name: string;
  population: number;
  population_density: number;
  flag: Flag;
  languages?: LanguagesEntityOrLanguage[] | null;
  tld: string;
}
export class Flag {
  emoji: string;
  emoji_unicode: string;
  emojitwo: string;
  noto: string;
  twemoji: string;
  wikimedia: string;
}

export class Security {
  is_abuser: boolean;
  is_attacker: boolean;
  is_bogon: boolean;
  is_cloud_provider: boolean;
  is_proxy: boolean;
  is_relay: boolean;
  is_tor: boolean;
  is_tor_exit: boolean;
  is_vpn: boolean;
  is_anonymous: boolean;
  is_threat: boolean;
}
export class TimeZone {
  id: string;
  abbreviation: string;
  current_time: string;
  name: string;
  offset: number;
  in_daylight_saving: boolean;
}
export class UserAgent {
  header: string;
  name: string;
  type: string;
  version: string;
  version_major: string;
  device: Device;
  engine: Engine;
  os: Os;
}
export class Device {
  brand: string;
  name: string;
  type: string;
}
export class Engine {
  name: string;
  type: string;
  version: string;
  version_major: string;
}
export class Os {
  name: string;
  type: string;
  version?: null;
}
export class IpInfo {
  ip: string;
  type: string;
  hostname?: null;
  carrier: Carrier;
  company: Company;
  connection: Connection;
  currency: Currency;
  location: Location;
  security: Security;
  time_zone: TimeZone;
  user_agent: UserAgent;
}
