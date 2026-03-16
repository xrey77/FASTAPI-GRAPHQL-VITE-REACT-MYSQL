import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { LIST_QUERY } from '../graphql/list_query';
import type { ProductListData, ProductListVariables, ProductData } from '../graphql/list_query';

export default function Prodlist() {

  const toDecimal = (number: any) => {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(number);
  };

    const [page, setPage] = useState<number>(1);
    const [totpage, setTotpage] = useState<number>(0);
    const [totalrecs, setTotalrecs] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

    const [products, setProducts] = useState<ProductData[]>([]);


    const [productList] = useLazyQuery<ProductListData, ProductListVariables>(LIST_QUERY);


    const fetchProducts = async (pg: any) => {

        try {
            const { data } = await productList({ 
                variables: { page: pg }
            });

            if (data?.productList) {
              setPage(data.productList.page);
              setProducts(data.productList.products);
              setTotpage(data.productList.totpage);
              setTotalrecs(data.productList.totalrecords);
            }            
            return;
        } catch (err: any) {
            if (err.AbortError) {
                setMessage(err.message);
            }
            setTimeout(() => { setMessage('');  }, 1000);
        }
    }

    useEffect(() => {
      fetchProducts(page);
   },[page]);

    const firstPage = (event: any) => {
        event.preventDefault();    
        let pg: number = 1;
        setPage(pg);
        fetchProducts(pg);
        return;    
      }
    
      const nextPage = (event: any) => {
        event.preventDefault();    
        if (page == totpage) {
            setPage(totpage);
            return;
        }
        let pg: number = page;
        pg++;
        setPage(pg);
        return fetchProducts(pg);
      }
    
      const prevPage = (event: any) => {
        event.preventDefault();    
        if (page === 1) {
          return;
          }
          let pg: number = page;
          pg--;
          setPage(pg);
          return fetchProducts(pg);
      }
    
      const lastPage = (event: any) => {
        event.preventDefault();
        let pg: number = totpage;
        setPage(pg);
        return fetchProducts(pg);
      }  
  
  return (
    <div className="container">
            <h1 className='text-warning embossed mt-3'>Products List</h1>
            <div className='text-white'>{message}</div>
            <table className="table table-danger table-striped">
            <thead>
                <tr> 
                <th className="bg-primary text-white" scope="col">#</th>
                <th className="bg-primary text-white" scope="col">Descriptions</th>
                <th className="bg-primary text-white" scope="col">Qty</th>
                <th className="bg-primary text-white" scope="col">Unit</th>
                <th className="bg-primary text-white" scope="col">Price</th>
                </tr>
            </thead>
            <tbody>

            {products.map((item) => {
            return (
              <tr key={item['id']}>
                 <td>{item['id']}</td>
                 <td>{item['descriptions']}</td>
                 <td>{item['qty']}</td>
                 <td>{item['unit']}</td>
                 <td>&#8369;{toDecimal(item['sellprice'])}</td>
               </tr>
              );
            })}

            </tbody>
            </table>

            <nav aria-label="Page navigation example">
        <ul className="pagination sm">
          <li className="page-item"><a onClick={lastPage} className="page-link sm" href="/#">Last</a></li>
          <li className="page-item"><a onClick={prevPage} className="page-link sm" href="/#">Previous</a></li>
          <li className="page-item"><a onClick={nextPage} className="page-link sm" href="/#">Next</a></li>
          <li className="page-item"><a onClick={firstPage} className="page-link sm" href="/#">First</a></li>
          <li className="page-item page-link text-danger sm">Page&nbsp;{page} of&nbsp;{totpage}</li>

        </ul>
      </nav>
      <div className='text-warning'><strong>Total Records : {totalrecs}</strong></div>
    </div>    
  )
}
