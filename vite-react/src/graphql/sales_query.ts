import { gql } from '@apollo/client';

export const SALES_QUERY = gql`
  query GetSales {
    sales {    
         saleamount
         saledate
   }
  }
`;

export interface SaleData {
    saleamount: string | number
    saledate: string | number
}

export interface SalesListData {
  sales: SaleData[];
}



