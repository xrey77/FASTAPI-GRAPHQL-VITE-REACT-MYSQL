import { gql } from '@apollo/client';

export const SEARCH_QUERY = gql`
  query ProductSearch($keyword: String!, $page: Int!) {
    productSearch(keyword: $keyword, page: $page) {   
     page
     totpage
     totalrecords
     products {
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
  }
`;

export interface ProductData {
    id: number
    category: string
    descriptions: string
    qty: number
    unit: string
    costprice: number
    sellprice: number
    saleprice: number
    productpicture: string
    alertstocks: number
    criticalstocks: number
}

export interface ProductSearchData {
  productSearch: {
    page: number;
    totpage: number;
    totalrecords: number;
    products: ProductData[];
  };  
}

export interface ProductSearchVariables {
    keyword: string;
    page: number;
}


