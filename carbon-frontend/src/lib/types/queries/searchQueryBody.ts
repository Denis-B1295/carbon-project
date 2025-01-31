export interface SearchQueryBody {
    id: number;
    name: string;
    country: string;
    supplierName: string;
    pricePerTon: number;
    offeredVolumeInTons: number[];
    distributionWeight: number;
}