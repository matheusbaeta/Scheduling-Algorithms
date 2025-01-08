import { useEffect, useState } from "react"
import ProgressbarRR from "./ProgressbarRR"
import "./RoundRobin.css"

function RoundRobin({ processes, quantum,  updateProcessStatus }) {
    const [executionQueue, setExecutionQueue] = useState([])
    const [isRunning, setIsRunning] = useState(false)
    const [finishedExecution, setFinishedExecution] = useState(false)
    const [timeSliceExecuted, setTimeSliceExecuted] = useState(0)


    useEffect(() => {
        if (processes.length > 0) {
            const sortedExecutionOrder = executionOrderRR(processes, quantum);
            setExecutionQueue(sortedExecutionOrder);
            console.log("Execution Queue Updated:", sortedExecutionOrder);
        }
    }, [processes, quantum])

    const runRoundRobin = async () => {
        let index = 0
        setIsRunning(true)

        while(index < executionQueue.length) {
          const currentProcess = executionQueue[index]
          console.log(currentProcess.process.name ,currentProcess.duration)
        

          updateProcessStatus(currentProcess.process.id, true)
          setTimeSliceExecuted(currentProcess.duration)
          
          await new Promise((resolve) =>
            setTimeout(resolve, (currentProcess.duration * 1000) + 150)
        )
        
          
          updateProcessStatus(currentProcess.process.id, false)

         index++
        }

        console.log("Finished Execution")

        setIsRunning(false)
        setFinishedExecution(true)
    }

    const executionOrderRR = (processes, quantum) => {
        // Simulador do tempo atual
        let currentTime = 0;

        // Uma fila ordenada na qual os processos serao executados
        const executionQueue = []

        if(quantum <= 0) {
            return executionQueue
        }
      
        /* Cria uma copia "profunda" dos processos atuais
        (Fila de prontos)
        */
        const readyQueue = [...processes].map((p) => ({
          ...p,
          remainingTime: p.executionTime,
        }))
      
        // Ordena pela ordem de chegada
        readyQueue.sort((a, b) => a.arrival - b.arrival)
        
        // Executa enquanto houver processos na fila de prontos
        while (readyQueue.length > 0) {
          let processFound = false;
      
          for (let i = 0; i < readyQueue.length; i++) {
            const process = readyQueue[i];
      
            if (process.arrival <= currentTime) {
              processFound = true
      
              // O tempo na qual o processo sera executado e dado pelo minimo entre o quantum e a quantidade de tempo restante 
              let timeToExecute = Math.min(quantum, process.remainingTime)
      
              // Se houver apenas um processo na fila de prontos ele executada durante todo seu tempo restante
              if(readyQueue.length == 1) {
                timeToExecute = process.remainingTime
              }
              else {
                // Caso haja outro processo na fila de prontos que ainda nao chegou
                const nextProcess = readyQueue.find((p) => p.arrival > currentTime)
                
                if (nextProcess) {
                  // O tempo que o proximo processo chegou em relacao ao tempo atual
                  const nextProcessArrival = nextProcess.arrival - currentTime

                  // A quantidade de quantums que precisam ser executadas ate a chegada do proximo processo (Arredondando para cima)
                  const quantumTimes = Math.ceil(nextProcessArrival / quantum)

                 // console.log("Quantum Times: " + quantumTimes)
                  // quantum * n
                  let execQuantum = quantumTimes * quantum

                  //console.log("ExecTime: " + execQuantum)

                  if(execQuantum <= 0) {
                    execQuantum = quantum
                  }

                  timeToExecute = execQuantum <= process.remainingTime ? execQuantum : process.remainingTime
                  //console.log("Time to execute: " + timeToExecute)


                  //timeToExecute = quantum >= (nextProcess.arrival - currentTime) ? quantum : (nextProcess.arrival - currentTime)
                } 

              }
      
              // Adiciona o processo e a sua duracao na fila de execucao
              executionQueue.push({ process, duration: timeToExecute })
      
              // Atualiza o tempo remanescente do processo e atualiza o tempo atual
              process.remainingTime -= timeToExecute;
              currentTime += timeToExecute;
      
              // Se o processo for estiver completo remove ele da fila de prontos
              if (process.remainingTime <= 0) {
                readyQueue.splice(i, 1);
              } 
              // Caso o processo ainda nao tenha finalizado sua execucao, esse processo e adicionado ao fim da fila
              else {
                readyQueue.push(readyQueue.splice(i, 1)[0])
              }
      
              break
            }
          }
      
          /* Se nao for possivel encontrar alguem processo pronto (processo que chegou ate o tempo atual) "avanca o tempo" 
          ate a o tempo de chegada do primeiro processo
          */
          if (!processFound) {
            currentTime = Math.min(...readyQueue.map((p) => p.arrival))
          }
        }
      
        return executionQueue
      }

      const showStatus = () => {
        const avg = calculateAverages()

        return (
            <div className="status-container">
                <div>
                    Tempo Medio de Execucao/Average Turnaround: {avg.averageTurnaroundTime.toFixed(2)}s
                </div>
                <div>
                    Tempo Medio de Espera/Average Waiting: {avg.averageWaitingTime.toFixed(2)}s
                </div>
                <div>
                    Troca de Contexto/Context Switches: {executionQueue.length}
                </div>
                <div>
                    {executionQueue.map((p, index) => <div key={index}>{p.process.name}: {p.duration}s</div>)}
                </div>
            </div>
        )
      }

      const calculateAverages = () => {
        let totalTurnaroundTime = 0
        let totalWaitingTime = 0
        
        // Monitora o tempo em que cada processo completa sua execucao atual
        const completionTimes = {}
        // Monitora o tempo  gasto em execucao
        const timeSpentExecuting = {}
        
        // Simula o tempo
        let currentTime = 0
      
        // Itera sobre a fila de execucao (algoritmo ja esta escalonado)
        executionQueue.forEach((p) => {
          // Processo que esta sendo executado  
          const process = p.process

          // Tempo de inicio do processo (o maior valor entre a chegada do processo e o tempo atual)
          const startTime = Math.max(process.arrival, currentTime)
          
          // Tempo que finalizou a execucao dessa ***fatia de tempo do processo***
          const endTime = startTime + p.duration
      
          // Atualiza o tempo atual
          currentTime = endTime;
          console.log("Process: " + process.name + "\nCurrent Time:" + currentTime + "\nDuration: " + p.duration)
      
          /* Atualiza o tempo em que o processo atual executou 
          / Caso o processo nao tenha executado ainda ele é adicionado ao objeto
          exemplo:
          timeSpentExecuting {
            P1: 0
          }
          */
          if (!timeSpentExecuting[process.name]) {
            timeSpentExecuting[process.name] = 0
          }

          // Soma o tempo de execucao do processo com a fatia de tempo na qual executou
          timeSpentExecuting[process.name] += p.duration
      
          // Atualiza o tempo em que o processo terminou sua execucao (terminou a execucao dessa fatia de tempo)
          completionTimes[process.name] = endTime
        })
      
        // Calcula o tempo de execucao e tempo de espera **de cada processo** 
        processes.forEach((process) => {
          // O "ultimo tempo" que terminou a execucao
          const completionTime = completionTimes[process.name]

          // Tempo de Execucao e dado pela diferenca de quando o processo finalizou sua ultima execucao e quando o processo chegou
          const turnaroundTime = completionTime - process.arrival

          console.log(process.name + "completition time: " + completionTime + ", turnaround time: " + turnaroundTime)
          // Tempo de espera e dado pela diferenca do tempo de execucao do processo e o tempo em que o processo gastou executando
          const waitingTime = turnaroundTime - timeSpentExecuting[process.name]
      
          // Somatorio
          totalTurnaroundTime += turnaroundTime
          totalWaitingTime += waitingTime
        });
      
        // Calculato das medias
        const averageTurnaroundTime = totalTurnaroundTime / processes.length
        const averageWaitingTime = totalWaitingTime / processes.length
      
        return {
          averageTurnaroundTime,
          averageWaitingTime,
        }
      }
      
      
      return (
        <div className="rr-container">
           <h2 className="rr-title">Algorithm: Round Robin</h2>
            <div className="progress-container">
                {processes.map((proc) => (
                    <ProgressbarRR key={proc.id} timeSliceExecuted={timeSliceExecuted} process={proc} />
                ))}
            </div>
            <div className="buttons-container">
                <button onClick={ runRoundRobin } disabled={isRunning}>
                {isRunning ? "Running..." : "Run"}
                </button>
            </div>
            <div>
            {finishedExecution ? showStatus() : ""}
            </div>
    </div>
)
}

export default RoundRobin