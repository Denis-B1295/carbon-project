export interface PortfolioAllocation{
    id: number;
    value: number;

}

export interface Portfolio{
    portfolioAllocations: PortfolioAllocation[]
}