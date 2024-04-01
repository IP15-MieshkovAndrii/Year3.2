export const createGraph = (numNodes, edges) => {
    const graph = Array.from({ length: numNodes }, () => Array(numNodes).fill(Infinity));

    for (let i = 0; i < numNodes; i++) {
        graph[i][i] = 0;
    }

    edges.forEach(([src, dest, weight]) => {
        graph[src][dest] = weight;
    });

    return graph;
};


