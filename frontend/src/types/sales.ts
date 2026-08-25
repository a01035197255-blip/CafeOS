export interface SalesChartResponse {
  label: string;
  sales: number;
}

export interface MonthlySalesResponse {
  month: string;
  sales: number;
  orderCount: number;
}

export interface PopularMenuResponse {
  menuId: number;
  menuName: string;
  imageUrl: string | null;
  quantity: number;
  sales: number;
}

export interface CategorySalesResponse {
  category: string;
  sales: number;
  quantity: number;
}

export interface DailySalesResponse {
  date: string;
  orderCount: number;
  sales: number;
  changeRate: number;
}

export interface SalesAnalysisResponse {
  todaySales: number;
  monthlySales: number;
  totalOrders: number;
  averageOrderPrice: number;

  salesChart: SalesChartResponse[];

  monthlySalesChart: MonthlySalesResponse[];

  popularMenus: PopularMenuResponse[];

  categorySales: CategorySalesResponse[];

  dailySales: DailySalesResponse[];
}