export interface Project {
    name: string;
    id: number;
    country: string;
    image: string;
    pricePerTon: number;
    offeredVolumeInTons: number;
    distributionWeight: number;
    supplierName: string;
    description: string;
    earliestDelivery: string;
}