import { floydWarshall } from "./floydWarshall.js"; 
import { createGraph } from "./graph.js";
import { parallelFloydWarshall } from "./parallelFloydWarshall.js";
import { performance } from 'perf_hooks';

const measureExecutionTimeP = (callback) => {
    return new Promise((resolve, reject) => {
        const startTime = performance.now();
        callback().then(() => {
            const endTime = performance.now();
            resolve(endTime - startTime);
        }).catch(reject);
    });
};

const measureExecutionTime = (callback) => {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    return endTime - startTime; 
};


export const generateRandomGraph = (numNodes, density = 0.5, maxWeight = 10) => {
    const edges = [];
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            if (Math.random() < density) {
                const weight = Math.floor(Math.random() * maxWeight) + 1;
                edges.push([i, j, weight]);
                edges.push([j, i, weight]);
            }
        }
    }
    return createGraph(numNodes, edges);
};

export const speedFloydWarshall = (graphSizes) => {


    for (const numNodes of graphSizes) {
        const graph = generateRandomGraph(numNodes, 0.3);

        console.log(`Testing Floyd-Warshall with ${numNodes} nodes...`);
        const executionTime = measureExecutionTime(() => {
            floydWarshall(graph);
        });

        console.log(`Execution time: ${executionTime.toFixed(2)} ms\n`);
    }
};

export const speedParallelFloydWarshall = async (graphSizes, processors) => {

    for (const numNodes of graphSizes) {
        for (const numProcessors of processors) {
            const graph = generateRandomGraph(numNodes, 0.3);

            console.log(`Testing Parallel Floyd-Warshall with ${numNodes} nodes and ${numProcessors} processors...`);
            const executionTime = await measureExecutionTimeP(async () => {
                await parallelFloydWarshall(graph, numProcessors);
            });

            console.log(`Execution time with ${numProcessors} processors: ${executionTime.toFixed(2)} ms\n`);
        }
    }
};

export const speedUp = async (graphSizes, numProcessors, repetitions) => {

    for (const numNodes of graphSizes) {
        let sequentialExecutionTimes = [];
        let parallelExecutionTimes = [];

        const graph = generateRandomGraph(numNodes, 0.3);

        for (let i = 0; i < repetitions; i++) {
            console.log(`Sequential Floyd-Warshall with ${numNodes} nodes (Repetition ${i + 1})`);
            const sequentialExecutionTime = measureExecutionTime(() => {
                floydWarshall(graph);
            });
            sequentialExecutionTimes.push(sequentialExecutionTime);
            console.log(`Execution time with ${numNodes} nodes: ${sequentialExecutionTime.toFixed(2)} ms\n`);

            console.log(`Parallel Floyd-Warshall with ${numNodes} nodes and ${numProcessors} processors (Repetition ${i + 1})`);
            const executionTime = await measureExecutionTimeP(async () => {
                await parallelFloydWarshall(graph, numProcessors);
            });
            parallelExecutionTimes.push(executionTime);
            console.log(`Execution time with ${numNodes} nodes: ${executionTime.toFixed(2)} ms\n`);
        }


        const avgSequentialExecutionTime = sequentialExecutionTimes.reduce((a, b) => a + b, 0) / repetitions;
        console.log(`Average Sequential Execution Time: ${avgSequentialExecutionTime}`)
        const avgParallelExecutionTime = parallelExecutionTimes.reduce((a, b) => a + b, 0) / repetitions;
        console.log(`Average Parallel Execution Time: ${avgParallelExecutionTime}`)

        const speedUp = avgSequentialExecutionTime / avgParallelExecutionTime;
        console.log(`Average Speed-up with ${numNodes} nodes: ${speedUp.toFixed(2)}\n`);
    }
}
