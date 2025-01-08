import React from "react";
import "./Process.css"

function Process({ process }) {
    return (
        <div className="process-box">
            <div className="process-name">
               {process.name.toUpperCase()}
            </div>
            <div className="process-details">
                <span>Chegada/Arrival: {process.arrival}s</span>
                <span>Tempo de Execucao/Burst: {process.executionTime}s</span>
            </div>
        </div>
    );
}

export default Process;