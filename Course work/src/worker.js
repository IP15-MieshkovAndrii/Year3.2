import { parentPort } from 'worker_threads';

parentPort.on('message', (task) => {
    const { sharedArray, rowStart, rowEnd, colStart, colEnd } = task;
    const nodes = Math.sqrt(sharedArray.length);

    for (let k = 0; k < nodes; k++) {
        for (let i = rowStart; i < rowEnd; i++) {
            for (let j = colStart; j < colEnd; j++) {
                const currentDist = sharedArray[i * nodes + j];
                const newDist = sharedArray[i * nodes + k] + sharedArray[k * nodes + j];
                sharedArray[i * nodes + j] = Math.min(currentDist, newDist);
            }
        }
    }
    parentPort.postMessage('done');
});
