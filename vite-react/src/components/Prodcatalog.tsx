import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useLazyQuery } from '@apollo/client/react';
import { LIST_QUERY } from '../graphql/list_query';
import type { ProductListData, ProductListVariables, ProductData } from '../graphql/list_query';


const toDecimal = (number: any) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(number);
};
export default function Prodcatalog() {
    const [page, setPage] = useState<number>(1);
    const [prods, setProds] = useState<ProductData[]>([]);
    const [totpage, setTotpage] = useState<number>(0);
    const [totalrecords, setTotalrecords] = useState<number>(0);
    const [message, setMessage] = useState('');

    const [productList] = useLazyQuery<ProductListData, ProductListVariables>(LIST_QUERY);

    const fetchCatalog = async (pg: any) => {

        try {
            const { data } = await productList({ 
                variables: { page: pg }
            });
            if (data?.productList) {
              setPage(data.productList.page);
              setProds(data.productList.products);
              setTotpage(data.productList.totpage);
              setTotalrecords(data.productList.totalrecords);
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
      fetchCatalog(page)
    },[page]);

    const firstPage = (event: any) => {
        event.preventDefault();    
        let pg:number = 1;
        setPage(pg);
        return fetchCatalog(pg);
      }
    
      const nextPage = (event: any) => {
        event.preventDefault();    
        if (page == totpage) {
            setPage(totpage);
            return;
        } else {
          let pg: number = page;
          pg++;
          setPage(pg)
          return fetchCatalog(pg);  
        }
      }
    
      const prevPage = (event: any) => {
        event.preventDefault();    
        if (page === 1) {
          setPage(1);
          return;
          }
          let pg: number = page;
          pg--;
          setPage(pg);
          return fetchCatalog(pg);
      }
    
      const lastPage = (event: any) => {
        event.preventDefault();
        let pg: number = totpage;
        setPage(pg);
        return fetchCatalog(pg);
      }

    return(
    <div className="container mt-2 mb-9">
            <h3 className="text-warning embossed mt-3">Products Catalog</h3>
            <div className="text-warning">{message}</div>
            <div className="card-group mb-3">
            {prods.map((item) => {
                    return (
                      <div className='col-md-4'>
                      <div key={item['id']} className="card mx-3 mt-3">
                          <img src={`/static/products/${item['productpicture']}`} className="card-img-top product-size" alt=""/>
                          <div className="card-body">
                            <h5 className="card-title">Descriptions</h5>
                            <p className="card-text desc-h">{item['descriptions']}</p>
                          </div>
                          <div className="card-footer">
                            <p className="card-text text-danger"><span className="text-dark">PRICE :</span>&nbsp;<strong>&#8369;{toDecimal(item['sellprice'])}</strong></p>
                          </div>  
                      </div>
                      
                      </div>
        
                      );
            })}
          </div>    

        <div className='container'>
        <nav aria-label="Page navigation example">
        <ul className="pagination sm">
          <li className="page-item"><Link onClick={lastPage} className="page-link sm" to="/#">Last</Link></li>
          <li className="page-item"><Link onClick={prevPage} className="page-link sm" to="/#">Previous</Link></li>
          <li className="page-item"><Link onClick={nextPage} className="page-link sm" to="/#">Next</Link></li>
          <li className="page-item"><Link onClick={firstPage} className="page-link sm" to="/#">First</Link></li>
          <li className="page-item page-link text-danger sm">Page&nbsp;{page} of&nbsp;{totpage}</li>
        </ul>
      </nav>
      <div className='text-warning'><strong>Total Records : {totalrecords}</strong></div>

      <br/><br/>
      </div>
  </div>
  )
}
