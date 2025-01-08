import React from "react";
import "./Process.css"

function Process({ process }) {
    return (
        <div className="process-box">
            <div className="process-name">
               {process.name.toUpperCase()}
            </div>
            <div className="process-details">
                <span>Arrival: {process.arrival}s</span>
                <span>Burst Time: {process.executionTime}s</span>
            </div>
        </div>
    );
}

export default Process;