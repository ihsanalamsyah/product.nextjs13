'use client'

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'
import { getCookie } from '@/utils/cookies';
import DatePicker from '@/app/components/products/datePicker';

const route = process.env.NEXT_PUBLIC_ROUTE;

async function GetHistoryBuyProduct(start_date:string, end_date:string, token: string):Promise<HistoryBuyProduct[]> {
  let historyBuyProduct:HistoryBuyProduct[] = [];
  try {             
    const response = await fetch(`${route}/historyProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ token
        },
        body: JSON.stringify({
            start_date: start_date,
            end_date: end_date
        })
    });
    const content = await response.json();
      
    historyBuyProduct = content.data;
      
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return historyBuyProduct;
};
export default function Tracker() {
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");


  function onChangeStartDate(format_start_date:string) {
    setStartDate(format_start_date);
  }
  function onChangeEndDate(format_end_date:string) {
    setEndDate(format_end_date);
  }

  useEffect(() =>{
    const fetchData =  async ()=>{    
      const token = getCookie("token");
      const historyBuyProduct: HistoryBuyProduct[] = await GetHistoryBuyProduct(startDate, endDate, token!);
      const labels:string[] = [];
      const datasets:Datasets[] = [];
      for(let i = 0; i < historyBuyProduct.length; i++){
        if(labels.indexOf(historyBuyProduct[i].format_created) == -1){
          labels.push(historyBuyProduct[i].format_created);
        }
        
      }
    
      historyBuyProduct.forEach(item => {
          let dataset = datasets.find(d => d.label === item.title);
          
          if (!dataset) {
              dataset = {
                  label: item.title,
                  data: Array(labels.length).fill(0), 
                  borderWidth: 1
              };
              datasets.push(dataset);
          }
          
          const dateIndex = labels.indexOf(item.format_created);
          if (dateIndex !== -1) {
              dataset.data[dateIndex] += item.total_quantity;
          }
      });
      const data = {
        labels: labels,
        datasets: datasets
      };
      const options = {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantity (pcs)'
            }
          }
        },
        plugins: {
          title: {
              display: true,
              text: 'Chart History Buy Product Handphone'
          }
        },
      };
      if (chartRef.current != null) {
        chartRef.current.destroy();
      }
    
      chartRef.current = new Chart(canvasRef.current!, {
        type: 'line',
        data: data,
        options: options
      });
    }
  fetchData();
  }, [startDate, endDate]);

  return (
    <>
      <div className='w-auto'>
        <DatePicker
          onChangeStartDate={onChangeStartDate}
          onChangeEndDate={onChangeEndDate}
        />

        <canvas ref={canvasRef}></canvas>
      </div>     
    </>
  );
}