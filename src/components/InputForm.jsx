import React, { useState } from "react";
import "./InputForm.css"

function InputForm({ createProcess, resetData }) {
    const [process, setProcess] = useState("");
    const [arrivalTime, setArrivalTime] = useState(0);
    const [executionTime, setExecutionTime] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (process.trim() === "") return;

        createProcess(process, arrivalTime, executionTime);
        setProcess("");
        setArrivalTime(0);
        setExecutionTime(1);
    };

    return (
        <form className="input-form" onSubmit={handleSubmit}>
           <h2>Processos/Processes</h2>
            <div className="input-group">
                <label>Processo/Process:</label>
                <input
                    type="text"
                    value={process}
                    onChange={(e) => setProcess(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label>Tempo de Chegada/Arrival:</label>
                <input
                    type="number"
                    value={arrivalTime}
                    min={0}
                    onChange={(e) => setArrivalTime(Number(e.target.value))}
                />
            </div>
            <div className="input-group">
                <label>Tempo de Execucao/Burst:</label>
                <input
                    type="number"
                    value={executionTime}
                    min={1}
                    onChange={(e) => setExecutionTime(Number(e.target.value))}
                />
            </div>
            <div className="buttons-container">
                <button type="submit">Add</button>
                <button  onClick={ resetData } type="submit">reset</button>
            </div>

        </form>
    );
}

export default InputForm;