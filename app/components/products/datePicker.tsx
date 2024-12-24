'use client'

import { useState } from "react";
import AlertSuccess from "@/app/components/alertSuccess";
import AlertFailed from "@/app/components/alertFailed";


export default function DatePicker(datePicker: DatePicker) {

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startDateKey, setStartDateKey] = useState(0);
    const [endDateKey, setEndDateKey] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertStatus, setAlertStatus] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    
    const handleCloseAlert = () => setIsAlertVisible(false);

    function handleSearch (){
   
        if(endDate!= null && startDate != null){
            if(startDate >= endDate){
                setAlertMessage("Start date lebih besar atau sama");
                setAlertStatus("Failed");
                setIsAlertVisible(true);
                return;
            }
            const formatStartDate = startDate!.toISOString().split('T')[0];
            const formatEndDate = endDate!.toISOString().split('T')[0];
            datePicker.onChangeStartDate(formatStartDate);
            datePicker.onChangeEndDate(formatEndDate);

        }else{
            setAlertMessage("Start date and end date is required");
            setAlertStatus("Failed");
            setIsAlertVisible(true);
            return;
        }
    }
    function handleReset(){
        setStartDate(null);
        setEndDate(null);
        setStartDateKey((prevKey) => prevKey + 1); // Untuk reset
        setEndDateKey((prevKey) => prevKey + 1); // Untuk reset
        datePicker.onChangeStartDate("");
        datePicker.onChangeEndDate("");
    }
    return (
        <div className="flex items-center gap-4"> 
            <div className="relative">
                <label htmlFor="from-date" className="block mb-2 text-sm font-medium text-gray-700">
                    From
                </label>
                <input
                    id="start-date"
                    type="date"
                    key={startDateKey} // Untuk reset
                    value={startDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="relative">
                <label htmlFor="to-date" className="block mb-2 text-sm font-medium text-gray-700">
                To
                </label>
                <input
                    id="start-date"
                    type="date"
                    key={endDateKey} // Untuk reset
                    value={endDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="relative">
                <label className="block mb-2 text-sm font-medium text-transparent">
                Search
                </label>
                <button
                    onClick={handleSearch}
                    className="h-10 px-6 text-white bg-gray-600 rounded-md hover:bg-gray-700"
                >
                Search
                </button>             
            </div>
            <div className="relative">
                <label className="block mb-2 text-sm font-medium text-transparent">
                Reset
                </label>
                <button
                    onClick={handleReset}
                    className="h-10 px-6 text-white bg-gray-600 rounded-md hover:bg-gray-700"
                >
                Reset
                </button>
            </div>
            {alertStatus == "Failed" ? (
                <AlertFailed message={alertMessage || ""} visible={isAlertVisible} onClose={handleCloseAlert}/>         
            ): (
                <AlertSuccess message={alertMessage || ""} visible={isAlertVisible} onClose={handleCloseAlert}/>
            )} 
        </div>    
  );
}
