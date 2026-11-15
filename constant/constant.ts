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
  thumbnail?: string;
  main?: boolean;
  order?: number;
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
  zone1: number; // id de provincia (el mismo que acepta el filtro zone1)
  zone2: number; // id de partido (el mismo que acepta el filtro zone2)
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
  bedrooms?: number;
  bathrooms?: number;
  buildingArea?: number;
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
