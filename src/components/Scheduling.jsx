import { useState } from "react";
import ShortestJobFirst from "./ShortestJobFirst";
import RoundRobin from "./RoundRobin";
import "./Scheduling.css";

function Scheduling({ processes, algorithm, updateProcessStatus, finishProcess, updateRemainingTime, setProcesses }) {
    const [quantum, setQuantum] = useState(1)

    if(algorithm == "sfj") {
        return (
            <div className="scheduling-container">
                <ShortestJobFirst
                    processes={ processes }
                    updateProcessStatus={ updateProcessStatus }
                    finishProcess={ finishProcess }
                />
            </div>
        )
    }   

    if(algorithm == "rr") {
        return (
             <div className="scheduling-container">
                 <div className="quantum-input">
                     <label>Quantum:</label>
                    <input
                        type="number"
                        value={quantum}
                        min={1}
                        onChange={(e) => setQuantum(Number(e.target.value))}
                    />
                 </div>
                <RoundRobin 
                    processes={ processes }
                    updateProcessStatus={ updateProcessStatus }
                    finishProcess={ finishProcess }
                    quantum={quantum}
                    updateRemainingTime={updateRemainingTime}
                    setProcesses={setProcesses} // Pass the function
                />
            </div>
        )
    }
    
    return (
        <>
        </>
    )
} 

export default Scheduling;