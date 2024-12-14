export const navLinks = [
  {
    id: 1,
    url: '#inicio',
    label: "Inicio"
  },
  {
    id: 2,
    url: '#propiedades',
    label: "Propiedades"
  },
  {
    id: 3,
    url: '#sobre-nosotros',
    label: "Sobre nosotros"
  },
  {
    id: 5,
    url: '#tasaciones',
    label: "Tasaciones"
  },
  {
    id: 4,
    url: '#contacto',
    label: "Contacto"
  },
];


export interface Image {
  image: string;
  thumbnail: string;
  orientation: number;
  imageId: number;
  main: boolean;
  type: number;
  contentType: string;
  order: number;
  timestamp: string;
}

export interface Property {
  title: string;
  propertyHash: string;
  name: string;
  zipCode: string;
  country: string;
  county: string;
  city: string;
  state: string;
  price: number;
  description: string;
  descriptionFormatted: string;
  propertyOperation: string;
  images: Image[];
  address: string;
  propertyType: string;
  currency: string;
  mainImage: string;
  location: {
    lon: string;
    lat: string;
  };
  rented: boolean;
  sold: boolean;
  lastUpdate: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  contract: string;
}


interface ImageData {
  image: string;
}
export interface PropertyData {
  code: string;
  codeSearch: string;
  description: string;
  alternativePrices: any[];
  type: number;
  title: string;
  customerCountry: number;
  zone2Desc: string;
  customerPhone: string;
  seoUrl: string;
  rented: boolean;
  zone: string;
  price: number;
  customerEmail: string;
  propertyType: string;
  customerId: number;
  codeRaw: string;
  currency: string;
  propertyId: number;
  timestamp: string;
  customerAddress: string;
  branchId: number;
  sold: boolean;
  ambiences: number;
  images: ImageData[];
  address: string;
  published: boolean;
  zone2: number;
  customerName: string;
  suspended: boolean;
  zone1: number;
  labels: string[];
  zone0: number;
  zone1Desc: string;
  propertyOperation: string;
  propertyHash: string;
  mainImage: string;
  lastUpdateFormated: string;
  reserved: boolean;
  lastUpdate: string;
  onlyWebsite: boolean;
  location: {
    lon: string;
    lat: string;
  };
  descriptionFormatted: string;
  operation: number;
  status: number;
  zone0Desc: string;
  zipCode: string;
}
