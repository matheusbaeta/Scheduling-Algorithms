import React, { useEffect, useState, useRef } from "react"
import Progressbar from "./Progressbar"
import "./ShortestJobFirst.css"

function ShortestJobFirst({ processes, updateProcessStatus, finishProcess }) {
    const [sortedProcesses, setSortedProcesses] = useState([])
    const [isRunning, setIsRunning] = useState(false)
    const [finishedExecution, setFinishedExecution] = useState(false)

    /* Executa toda vez que os processos sao atualizados
    Os processos sao reordenados toda vez que um novo processo for adicionado
    */
    useEffect(() => {
        // Se houver pelo menos um processo ordena os processos
        if (processes.length > 0) {
            const sorted = executionQueueSJF()
            setSortedProcesses(sorted)
        } 
    }, [processes])
    

    // Roda a simulacao do algoritmo
    const runSimulation = async () => {
        let index = 0
        setIsRunning(true)

        while(index < sortedProcesses.length) {
          const currentProcess = sortedProcesses[index]

          updateProcessStatus(currentProcess.id, true)

          await new Promise((resolve) =>
            setTimeout(resolve, (currentProcess.executionTime * 1000) + 150)
          )
          
          updateProcessStatus(currentProcess.id, false)

          //Finaliza o processo
          finishProcess(currentProcess.id, true)

          index++
        }

        setIsRunning(false)
        setFinishedExecution(true)
    }

    const showStatus = () => {
      const avg = calculateAverages()

      return (
        <div className="status-container">
          <div>
          Average Turnaround: {avg.averageTurnaroundTime.toFixed(2)}s
          </div>
          <div>
          Average Waiting Time: {avg.averageWaitingTime.toFixed(2)}s 
          </div>
          <div>
            {sortedProcesses.map(p => p.name + "  ")}
          </div>
        </div>
      )
    }

    const calculateAverages = () => {
      let totalTurnaroundTime = 0
      let totalWaitingTime = 0
      let currentTime = 0
      
      // Os processos ja estao ordenados de forma correta
      sortedProcesses.forEach((process) => {
          // O tempo de inicio sera quem for maior entre o momento que o processo chegou e o tempo atual
          const startTime = Math.max(process.arrival, currentTime)
  
          // O tempo que o processo executou e dado pelo tempo q ele iniciou + a quantidade de tempo que ele executou
          const completionTime = startTime + process.executionTime
  
          // Tempo de execucao (Turnaround Time) e dado pela diferenca entre o tempo que o processo completou sua executao e quando chegou
          const turnaroundTime = completionTime - process.arrival
  
          // Tempo de espera e dado pela diferenca entre o tempo que o processo iniciou e o tempo em que chegou
          const waitingTime = startTime - process.arrival
  
          // Atualiza o tempo atual para o tempo que esse processo terminou de completar sua execucao
          currentTime = completionTime
  
          // Somatorio dos tempos de espera e exeucao
          totalTurnaroundTime += turnaroundTime
          totalWaitingTime += waitingTime
      })
  
      const averageTurnaroundTime = totalTurnaroundTime / sortedProcesses.length
      const averageWaitingTime = totalWaitingTime / sortedProcesses.length
  
      return {
          averageTurnaroundTime,
          averageWaitingTime,
      }
  }
  
    const executionQueueSJF = () => {
      const executionQueue = []

      // Fila de processos restantes (uma copia de todos os processos)
      const remainingProcesses = [...processes]

      // Tempo atual
      let currentTime = 0
        
      
      // Executa ate nao houver mais processos restantes
      while (remainingProcesses.length > 0) {

          /* Filtra os processos que chagaram no tempo atual criando uma fila de processos 
          (Processos prontos sao todos aqueles que chegaram ate o tempo atual)
          Retorna uma **copia** de todos os processos que estao na fila de prontos
          */
          const readyProcesses = remainingProcesses.filter((p) => p.arrival <= currentTime)
          
          // Caso haja uma fila de processos prontos
          if (readyProcesses.length > 0) {
              // Ordena pelo tempo de execucao
              readyProcesses.sort((a, b) => a.executionTime - b.executionTime)
  
              /*
              escolhe o primeiro processo
              o metodo retorna o processo[0] do array
              */
              const currentProcess = readyProcesses.shift()
  
              // Adiciona na ordem de execucao
              executionQueue.push(currentProcess)

              // Atualiza o tempo
              currentTime += currentProcess.executionTime
  
              // Encontra o processo que foi executado da lista de processos restantes
              const index = remainingProcesses.findIndex((p) => p.id === currentProcess.id)

              // Remove o processo ja executado
              remainingProcesses.splice(index, 1)
          } else {
              // Se nao houver processos prontos o tempo atual se torna o tempo do processo que chegou primeiro
              currentTime = Math.min(...remainingProcesses.map((p) => p.arrival))
          }
      }
      
      return executionQueue
  }
  
    return (
        <div className="sjf-container">
            <h2 className="sjf-title">Algorithm: Shortest Job First</h2>
            <div className="progress-container">
                {processes.map((proc) => (
                    <Progressbar key={proc.id} process={proc} />
                ))}
            </div>
            <div className="buttons-container">
             <button onClick={runSimulation} disabled={isRunning}>
                {isRunning ? "Running..." : "Run"}
              </button>
          </div>
          {finishedExecution ? showStatus() : ""}
        </div>
    );
}

export default ShortestJobFirst