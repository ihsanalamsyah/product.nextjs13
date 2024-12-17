'use client'

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'
import { getCookie } from '@/utils/cookies';

const route = process.env.NEXT_PUBLIC_ROUTE;

async function GetHistoryBuyProduct(token: string) {
  let historyBuyProduct:GetHistoryBuyProduct[] = [];
  try {             
    const response = await fetch(`${route}/getTracker`, {
        method: 'GET',
        headers:{
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
        }
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
  
  useEffect(() =>{
    const fetchData =  async ()=>{    
      const token = getCookie("token");
      const historyBuyProduct: GetHistoryBuyProduct[] = await GetHistoryBuyProduct(token!);
      const labels:string[] = [];
      const datasets:Datasets[] = [];
      for(let i = 0; i < historyBuyProduct.length; i++){
        labels.push(historyBuyProduct[i].format_created);
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
  }, []);
  return (
    <>
      <div className='w-auto'>
          <canvas ref={canvasRef}></canvas>
      </div>     
    </>
  );
}