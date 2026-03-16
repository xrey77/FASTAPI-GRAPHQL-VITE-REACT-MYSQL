import { useLazyQuery } from '@apollo/client/react';
import { SALES_QUERY } from "../graphql/sales_query";
import type { SalesListData, SaleData } from "../graphql/sales_query";
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  type ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 10,
      left: 40,
      right: 20,
      bottom: 10
    }
  },
  scales: {
    x: { 
      ticks: {
        color: 'black',
      },
    },    
    y: {
      beginAtZero: true,
      afterFit: (axis) => {
        axis.width = Math.max(axis.width, 100); 
      },      
      ticks: {
        color: 'black',  
        autoSkip: true,
        maxRotation: 0, 
        minRotation: 0,
        padding: 10,         
        callback: (value: string | number) => 
          new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits:  0
          }).format(Number(value)),
      }
    }    
  },  
  plugins: {
    datalabels: {
      display: true,
      color: 'black',
      anchor: 'end', 
      align: 'top',
      offset: 4,
      font: { weight: 'bold' }, 
      formatter: (value: number) => {
        return value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        });
      },                 
    },
    legend: { 
      position: 'top',
      labels: {
        color: 'black'
      }
    },    
    title: { 
      display: true,
      text: 'Annual Sales Chart',
      color: 'black',
      padding: {
        top: 60, 
        bottom: 5
      },
      font: {
        size: 24,
        family: 'Arial',
        weight: 'bold',
      }
    },
  },
};


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);


export default function SalesChart() {

    const [message, setMessage] = useState<string>('');

    const chartRef = useRef<HTMLDivElement>(null); 


    const [chartData, setChartData] = useState<ChartData<'bar'>>({
        labels: [],
        datasets: [],
    });
    const [logo, setLogo] = useState<HTMLImageElement | null>(null);


    const logoPlugin = {
      id: 'logoPlugin',
      beforeDraw: (chart: any) => {
        if (logo && logo.complete) {
          const { ctx, width } = chart;
          const logoWidth = 140;
          const logoHeight = 40;
          const x = (width - logoWidth) / 2; 
          const y = 25; 
          
          ctx.drawImage(logo, x, y, logoWidth, logoHeight);
        } else if (logo) {
          logo.onload = () => chart.draw();
        }
      }
    };

    const [fetchSales] = useLazyQuery<SalesListData>(SALES_QUERY);
    const getSales = async () => {
      setMessage("Loading chart data...");
    try {
        const { data } = await fetchSales();
          if (data?.sales) {
              const sales = data.sales;

              setChartData({
                  // Explicitly type 'item' as SaleData
                  labels: sales.map((item: SaleData) => 
                    new Date(item.saledate).toLocaleDateString('en-US', { month: 'short' })
                  ),        
                  datasets: [{
                    label: 'Sales Amount',
                    // Explicitly type 'item' as SaleData
                    data: sales.map((item: SaleData) => Number(item.saleamount) || 0),
                    backgroundColor: 'rgba(60, 179, 113, 0.8)',
                  }],
                });              
              // setChartData({
              //     labels: sales.map(item => 
              //         new Date(item.saledate).toLocaleDateString('en-US', { month: 'short' })
              //     ),        
              //     datasets: [{
              //         label: 'Sales Amount',
              //         data: sales.map(item => Number(item.saleamount) || 0),
              //         backgroundColor: 'rgba(60, 179, 113, 0.8)',
              //     }],
              // });
          }      
        } catch (err: any) {        
            if (err.AbortError) {
                setMessage(err.message);
            }
            setTimeout(() => { setMessage('');  }, 1000);
        }
    }

    useEffect(() => {
        const img = new Image();
        img.src = '/images/logo.png';
        img.onload = () => setLogo(img);

        getSales();
    },[]);

    
    const handlePrint = useReactToPrint({
        contentRef: chartRef,
        documentTitle: "Sales Chart Report",
    });


  return (
  <div className='container-fluid bg-light top-chart h-100'>
      <div className="print-header bg-white">
        <h1>Sale Report</h1>
        <p>Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      <div ref={chartRef} 
      style={{ 
        padding: '20px', 
        height: '500px', 
        width: '100%',
        minWidth: '600px'
      }}      
      >
          {chartData.datasets.length > 0 ? (
            <Bar options={options} data={chartData} plugins={[logoPlugin]} />
          ) : (
            <p className="text-center">{message}</p>
          )}
      </div>
      <div className='btn-print'>
        <button className="btn btn-sm btn-success" onClick={() => handlePrint()}>Print Chart</button>
      </div>
      <style>{`
        /* Hide the header by default in the browser */
        .print-header {
          display: none;
          text-align: center;
          margin-bottom: 20px;
        }

        @media print {
          @page {
            margin-top: 50px; 
          }

          /* Show the header only when printing */
          .print-header {
            display: block;
          }

          .container { 
            margin: 0; 
          }

          /* Hide the print button so it doesn't appear on paper */
          button {
            display: none;
          }

          canvas { 
            max-width: 100% !important; 
            height: auto !important; 
          }
        }      
      `}</style>
      </div>    
  );
}
