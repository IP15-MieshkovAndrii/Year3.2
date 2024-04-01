import { ThreadPool } from './threadPool.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


export async function parallelFloydWarshall(distanceMatrix, numProcessors) {
  const nodes = distanceMatrix.length;
  const sharedArrayBuffer = new SharedArrayBuffer(nodes * nodes * Int32Array.BYTES_PER_ELEMENT);
  const sharedArray = new Int32Array(sharedArrayBuffer);
  const INF = 1e9;

  if(nodes%Math.sqrt(numProcessors) !== 0){
    console.log("Invalid number of processors!")
    return distanceMatrix;
  }

  sharedArray.set(distanceMatrix.flat());

  for (let i = 0; i < nodes; i++) {
    for (let j = 0; j < nodes; j++) {
      if (i === j) {
        sharedArray[i * nodes + j] = 0; 
      } else if (sharedArray[i * nodes + j] === 0){
        sharedArray[i * nodes + j] = INF; 
      }
    }
  }

  const pool = new ThreadPool(numProcessors, join(dirname(fileURLToPath(import.meta.url)), 'worker.js'));
  const chunkSize = nodes / Math.sqrt(numProcessors);
  const tasks = [];
  for (let i = 0; i < nodes; i += chunkSize) {
    for (let j = 0; j < nodes; j += chunkSize) {
      tasks.push({
        sharedArray,
        rowStart: i,
        rowEnd: Math.min(i + chunkSize, nodes),
        colStart: j,
        colEnd: Math.min(j + chunkSize, nodes),
      });
    }
  }

  for (let i = 0; i < tasks.length; i++) { 
    const taskPromises = [];
    taskPromises.push(pool.submit(tasks[i]));
    await Promise.all(taskPromises); 
  }

  await pool.shutdown();

  const resultMatrix = [];
  for (let i = 0; i < nodes; i++) {
    resultMatrix.push(Array.from(sharedArray.slice(i * nodes, (i + 1) * nodes)));
    resultMatrix[i] = resultMatrix[i].map((value) => (value === INF ? Infinity : value));
  }


  return resultMatrix;
}
