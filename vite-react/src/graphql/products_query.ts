import { gql } from '@apollo/client';

export const PRODUCTS_QUERY = gql`
  query GetProducts {
    products{    
        id
        category
        descriptions
        qty
        unit
        costprice
        sellprice
        saleprice
        productpicture
        alertstocks
        criticalstocks
   }
  }
`;

export interface ProductsData {
    id: number;
    category: string;
    descriptions: string;
    qty: number;
    unit: string;
    costprice: number;
    sellprice: number;
    saleprice: number;
    productpicture: string;
    alertstocks: number;
    criticalstocks: number;
}

export interface ProductsListData {
  user: ProductsData;
}



