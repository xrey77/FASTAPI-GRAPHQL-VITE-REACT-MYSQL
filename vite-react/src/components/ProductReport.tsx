import { useLazyQuery } from '@apollo/client/react';
import { PRODUCTS_QUERY } from '../graphql/products_query';
import { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ReportTemplate } from '../components/ReportTemplate';
import type { ProductListData } from '../graphql/productreport_query';

export default function ProductReport() {
  const [message, setMessage] = useState<string>('');
  const [fetchProducts] = useLazyQuery<ProductListData>(PRODUCTS_QUERY);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const getProducts = async () => {
    setMessage('Loading Data & Generating PDF...');
    try {
      const { data } = await fetchProducts();
        if (data?.products) {
            const products = data.products;
            if (products.length > 0) {
              const doc = <ReportTemplate products={products} />;
              const blob = await pdf(doc).toBlob();
              const url = URL.createObjectURL(blob);
              setPdfUrl(url);
            }
        }   
      } catch (err: any) {       
          if (err.AbortError) {
              setMessage(err.message);
          }
          setTimeout(() => { setMessage('');  }, 1000);
      }
  }

  useEffect(() => {
    getProducts();
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); };
  },[])

  
  return (
    <div className='container-fluid bg-dark vh-100 d-flex flex-column'>
      <div className='flex-grow-1 bg-white m-3 rounded overflow-hidden'>
        {message ? (
          <div className="d-flex text-dark justify-content-center align-items-center h-100">
            {message}
          </div>
        ) : (
          pdfUrl && <iframe src={`${pdfUrl}#toolbar=1`} width="100%" height="100%" />
        )}
      </div>
    </div>
  );
}
