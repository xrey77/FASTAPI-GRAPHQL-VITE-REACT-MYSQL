import { useState } from 'react';import { useLazyQuery } from '@apollo/client/react';
import { SEARCH_QUERY } from '../graphql/search_query';
import type { ProductSearchData, ProductSearchVariables, ProductData } from '../graphql/search_query';

const toDecimal = (number: any) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(number);
};

export default function Prodsearch() {
  const [message, setMessage] = useState('');
  const [prodsearch, setProdsearch] = useState<ProductData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totpage, setTotpage] = useState<number>(0);
  const [totalrecords, setTotalrecords] = useState<number>(0);
  const [searchkey, setSearchkey] = useState<string>('');

  const [productSearch] = useLazyQuery<ProductSearchData, ProductSearchVariables>(SEARCH_QUERY);

  const getProdsearch = async (event: React.SubmitEvent) => {
      event.preventDefault();
      setMessage("please wait .");
        try {
            const { data } = await productSearch({ 
                variables: { page: page, keyword: searchkey }
            });
            if (data?.productSearch) {
              setPage(data.productSearch.page);
              setProdsearch(data.productSearch.products);
              setTotpage(data.productSearch.totpage);
              setTotalrecords(data.productSearch.totalrecords);
            }            
            setTimeout(() => { setMessage('');  }, 1000);
            return;
        } catch (err: any) {
            if (err.AbortError) {
                setMessage(err.message);
            }
            setMessage(err.errors[0].message);
            setTimeout(() => { setMessage('');  }, 3000);
        }
  }

  const getProdPage = async (page: number) => {
    setMessage("please wait .");
        try {
            const { data } = await productSearch({ 
                variables: { page: page, keyword: searchkey }
            });
            if (data?.productSearch) {
              setPage(data.productSearch.page);
              setProdsearch(data.productSearch.products);
              setTotpage(data.productSearch.totpage);
              setTotalrecords(data.productSearch.totalrecords);
            }            
            return;
        } catch (err: any) {
            if (err.AbortError) {
                setMessage(err.message);
            }
            setTimeout(() => { setMessage('');  }, 1000);
        }
}

  const firstPage = (event: any) => {
    event.preventDefault();    
    let pg: number = 1;
    setPage(pg);
    return getProdPage(pg);
  }

  const nextPage = (event: any) => {
    event.preventDefault();    
    if (page == totpage) {
        setPage(totpage);
        return;
    } else {
      let pg: number = page;
      pg++;
      setPage(pg);
      return getProdPage(pg);  
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
      setPage(pg)
      return getProdPage(pg);
  }

  const lastPage = (event: any) => {
    event.preventDefault();
    let pg: number = totpage;
    setPage(pg);
    return getProdPage(pg);
  }  
   
return (
  <div className="container mb-10">
      <h2 className='text-warning embossed mt-3'>Products Search</h2>

      <form className="row g-3" onSubmit={getProdsearch} autoComplete='off'>
          <div className="col-auto">
            <input type="text" required className="form-control-sm" value={searchkey} onChange={e => setSearchkey(e.target.value)} placeholder="enter Product keyword"/>
            <div className='searcMsg text-warning'>{message}</div>
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary btn-sm mb-3">search</button>
          </div>

      </form>
      <div className="container mb-9">
        <div className="card-group">
      {prodsearch.map((item) => {
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
        {
          totpage > 1 ? 
          <>
          <nav aria-label="Page navigation example">
            <ul className="pagination sm mt-3">
              <li className="page-item"><a onClick={lastPage} className="page-link sm" href="/#">Last</a></li>
              <li className="page-item"><a onClick={prevPage} className="page-link sm" href="/#">Previous</a></li>
              <li className="page-item"><a onClick={nextPage} className="page-link sm" href="/#">Next</a></li>
              <li className="page-item"><a onClick={firstPage} className="page-link sm" href="/#">First</a></li>
              <li className="page-item page-link text-danger sm">Page&nbsp;{page} of&nbsp;{totpage}</li>
            </ul>
          </nav>
          <div className='text-warning'><strong>Total Records : {totalrecords}</strong></div>
          </>
        :
        null
        }

        <br/><br/><br/>
      </div>
  </div>  
  )
}

