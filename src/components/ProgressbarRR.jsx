import React, { useState, useEffect } from "react";
import "./ProgressbarRR.css"

const ProgressbarRR = ({ process, timeSliceExecuted }) => {
    const [filled, setFilled] = useState(0);
    const epsilon = 5

    useEffect(() => {
        if (process.isRunning && timeSliceExecuted > 0) {
            const totalDuration = process.executionTime;
            const fillPercentage = (timeSliceExecuted / totalDuration) * 100;
            const targetFill = Math.min(filled + fillPercentage, 100);
            
            if(filled + epsilon >= 100) {
                setFilled(100)
            }
            else {
                setFilled(targetFill)
            }

            
        } 
    }, [process.isRunning, timeSliceExecuted, process.remainingTime, process.executionTime])

    return (
        <div className="progressbar-container">
            <span>{process.name}</span>
            <div className="progressbar">
                <div
                    style={{
                        height: "100%",
                        width: `${filled}%`,
                        backgroundColor: filled >= 100 - epsilon ? "blue" : "green",
                        transition: "width 0.1s ease",
                    }}
                ></div>
            </div>
            <p className="percentage">
                    {filled.toFixed(2)} %
                </p>
        </div>
    );
};

export default ProgressbarRR


