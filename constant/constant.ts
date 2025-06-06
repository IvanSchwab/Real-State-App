export const navLinks = [
  {
    id: 1,
    url: '#Inicio',
    label: "Inicio"
  },
  {
    id: 2,
    url: '#Propiedades',
    label: "Propiedades"
  },
  {
    id: 3,
    url: '#Sobre-Nosotros',
    label: "Sobre nosotros"
  },
  {
    id: 5,
    url: '#Tasaciones',
    label: "Tasaciones"
  },
  {
    id: 4,
    url: '#Contacto',
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
  landArea: number;
  contract: string;
}


interface ImageData {
  image: string;
}
export interface PropertyData {
  code: string;
  codeSearch: string;
  description: string;
  landArea: number;
  alternativePrices: any[];
  customerCountry: number;
  type: number;
  title: string;
  zone0: string;
  zone1: string;
  zone2: string;
  customerPhone: string;
  seoUrl: string;
  rented: boolean;
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
  customerName: string;
  suspended: boolean;
  labels: string[];
  zone1Desc: string;
  zone2Desc: string;
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
