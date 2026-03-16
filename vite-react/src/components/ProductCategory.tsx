import { useLazyQuery } from '@apollo/client/react';
import { PRODUCT_CATEGORY_QUERY } from '../graphql/productCategory_query.ts';
import type { Category, ProductCategoriesData } from '../graphql/productCategory_query.ts';
import { useEffect, useState } from 'react';
import { InventoryReport } from './CategoryTemplate.tsx';
import { PDFViewer } from '@react-pdf/renderer';

export default function ProductCategory() {
    const [message, setMessage] = useState<string>('');
    const [categoryData, setCategoryData] = useState<Category[]>([]);

    const [fetchCategory] = useLazyQuery<ProductCategoriesData>(PRODUCT_CATEGORY_QUERY);

    const getCategories = async () => {
        setMessage("Loading inventory data...");
        try {
            const { data } = await fetchCategory();
            if (data?.categoryList) {              
                setCategoryData(data.categoryList);
            }                

        } catch (err: any) {  
            if (err.AbortError) {
                setMessage(err.message);
            }
            setTimeout(() => { setMessage('');  }, 1000);
        }

    }

    useEffect(() => {
        getCategories()
    },[])

  return (
  <div className="container-fluid">

{categoryData ? (
  <div className="container-fluid "> 
    <PDFViewer width={1000} height={800}>
      <InventoryReport data={{ categoryList: categoryData }} />
    </PDFViewer>
  </div>
) : (
  <p>{message}</p>
)}    
  </div>
  )
}
