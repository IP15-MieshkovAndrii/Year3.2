import { speedFloydWarshall, speedParallelFloydWarshall, speedUp } from "./speed.js";

const graphSizes = [1000, 2000, 3000];
const processors = [4, 16, 25, 64, 100];

const repetitions = 3;
const numProcessors = 16;


speedFloydWarshall(graphSizes);

await speedParallelFloydWarshall(graphSizes, processors);

speedUp(graphSizes, numProcessors, repetitions);










