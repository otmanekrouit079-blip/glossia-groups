const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function resolveImageUrl(imageUrl: string): string {
  if (!imageUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  return `${API_URL}${imageUrl}`;
}

export type Service = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  duration_minutes: number;
  image_url: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  long_description: string;
  image_url: string;
  category: string;
  price_1: string;
  price_2: string;
  price_3: string;
  stock: number;
  rating: number;
  review_count: number;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
};

export type Staff = {
  id: string;
  name: string;
  photo_url: string;
  active: boolean;
};

export type Package = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  price: string;
  service_names: string[];
  product_names: string[];
};

const fallbackServices: Service[] = [
  {
    id: "svc-1",
    slug: "haircut",
    name: "حلاقة",
    description: "حلاقة احترافية مع تنظيف دقيق",
    price: "90.00",
    duration_minutes: 40,
    image_url: "/images/placeholders/haircut.jpg",
  },
  {
    id: "svc-2",
    slug: "beard",
    name: "لحية",
    description: "تشذيب اللحية وتحديدها",
    price: "60.00",
    duration_minutes: 30,
    image_url: "/images/placeholders/beard.jpg",
  },
  {
    id: "svc-3",
    slug: "full-package",
    name: "باقة كاملة",
    description: "حلاقة + لحية + عناية سريعة",
    price: "150.00",
    duration_minutes: 70,
    image_url: "/images/placeholders/full.jpg",
  },
];

const fallbackProducts: Product[] = [
  {
    id: "prd-1",
    slug: "biotin-gummies",
    name: "علكات البيوتين",
    short_description: "تقوية الشعر وتقليل التساقط",
    long_description: "صيغة يومية مريحة لدعم بصيلات الشعر.",
    image_url: "/images/placeholders/biotin.jpg",
    category: "hair-care",
    price_1: "199.00",
    price_2: "279.00",
    price_3: "349.00",
    stock: 22,
    rating: 4.8,
    review_count: 312,
  },
  {
    id: "prd-2",
    slug: "beard-oil",
    name: "زيت اللحية",
    short_description: "ترطيب وتكثيف مظهر اللحية",
    long_description: "خليط زيوت طبيعية للترطيب اليومي.",
    image_url: "/images/placeholders/beard-oil.jpg",
    category: "beard-care",
    price_1: "119.00",
    price_2: "199.00",
    price_3: "269.00",
    stock: 18,
    rating: 4.7,
    review_count: 205,
  },
  {
    id: "prd-3",
    slug: "matte-clay",
    name: "Matte Styling Clay",
    short_description: "تثبيت قوي بدون لمعان",
    long_description: "مثالي لتسريحات يومية بثبات طويل.",
    image_url: "/images/placeholders/clay.jpg",
    category: "hair-care",
    price_1: "149.00",
    price_2: "229.00",
    price_3: "299.00",
    stock: 30,
    rating: 4.9,
    review_count: 188,
  },
];

const fallbackStaff: Staff[] = [];

const fallbackPackages: Package[] = [];

const fallbackBranches: Branch[] = [
  {
    id: "br-1",
    name: "GLOSSIA Centre Ville",
    address: "Bd Mohammed V, Casablanca",
  },
];

async function fetcher<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }
    return response.json() as Promise<T>;
  } catch {
    if (path.includes("/api/services")) return fallbackServices as T;
    if (path.includes("/api/products")) return fallbackProducts as T;
    if (path.includes("/api/packages")) return fallbackPackages as T;
    if (path.includes("/api/staff")) return fallbackStaff as T;
    if (path.includes("/api/branches")) return fallbackBranches as T;
    return [] as T;
  }
}

export function getServices() {
  return fetcher<Service[]>("/api/services/");
}

export function getProducts() {
  return fetcher<Product[]>("/api/products/");
}

export function getPackages() {
  return fetcher<Package[]>("/api/packages/");
}

export function getStaff() {
  return fetcher<Staff[]>("/api/staff/");
}

export function getBranches() {
  return fetcher<Branch[]>("/api/branches/");
}
