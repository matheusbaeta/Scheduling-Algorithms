import React, { useEffect, useState } from "react";
import "./Progressbar.css";

function Progressbar({ process }) {
    const [filled, setFilled] = useState(0)

    useEffect(() => {
        if (process.isRunning) {
            setFilled(0);
            const interval = setInterval(() => {
                setFilled((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        return 100
                    }
                    return prev + 10
                })
            }, (process.executionTime * 1000) / 10)

            return () => clearInterval(interval)
        }
    }, [process.isRunning, process.executionTime])

     return (
        <div className="progressbar-container">
            <span>{process.name}</span>
            <div className="progressbar">
                <div
                    style={{
                        height: "100%",
                        width: `${filled}%`,
                        backgroundColor: process.isRunning ? "green" : "blue",
                        transition: "width 0.5s",
                    }}
                ></div>
            </div>
            <span className="percentage-bar">{filled.toFixed(2)}%</span>
        </div>
    )
}

export default Progressbar