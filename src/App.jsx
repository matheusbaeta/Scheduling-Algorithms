import React, { useState } from "react";
import InputForm from "./components/InputForm";
import Process from "./components/Process";
import "./App.css";
import "./components/Process.css"
import Scheduling from "./components/Scheduling";

function App() {
    const [processes, setProcesses] = useState([])
    const [algorithm, setAlgorithm] = useState("")

    const addProcess = (process, arrival, execution) => {
        const processObj = {
            id: crypto.randomUUID(),
            name: process,
            arrival: Number(arrival),
            executionTime: Number(execution),
            isRunning: false,
            isFinished: false,
            remainingTime: Number(execution)
        }
        setProcesses((prev) => [...prev, processObj])
    }

    const renderAlgorithmButtons = () => {
        return (
            <div className="button-algorithm-container">
            <div className="buttons-container">
                <button onClick={ () => setAlgorithm("sfj") }>Shortest Job First</button>
                <button onClick={ () => setAlgorithm("rr") }>Round Robin</button>
            </div>
        </div>
        )
    }

    const updateProcessStatus = (id, isRunning) => {
        setProcesses((prevProcesses) =>
            prevProcesses.map((proc) =>
                proc.id === id ? { ...proc, isRunning } : proc
            )
        )
    }

    const finishProcess = (id, isFinished) => {
        setProcesses((prevProcesses) =>
            prevProcesses.map((proc) =>
                proc.id === id ? { ...proc, isFinished, remainingTime: 0 } : proc
            )
        )
    }

    const updateRemainingTime = (id, time)  => {
        setProcesses((prevProcesses) =>
            prevProcesses.map((proc) =>
                proc.id === id ? { ...proc, remainingTime: time } : proc
            )
        );
    }

    const resetProcess = () => {
        setProcesses([])
        setAlgorithm("")
    }

    return (
        <div>
            <div className="app-container">
                <div>
                    <InputForm createProcess={ addProcess } resetData={resetProcess}/>
                    {algorithm === "" ? renderAlgorithmButtons() : ""}
                </div>
                <div>
                <Scheduling
                    algorithm={algorithm}
                    processes={ processes }
                    updateProcessStatus={ updateProcessStatus }
                    finishProcess={ finishProcess }
                    updateRemainingTime={updateRemainingTime}
                    setProcesses={setProcesses}
                />
                </div>     
            </div>
                <div className="processes-container">
                    {processes.map((proc) => (
                        <Process key={ proc.id } process={ proc } />
                    ))}
                </div>       
        </div>
    )
}

export default App
