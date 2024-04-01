

export const checkFloydWarshall = (graph, expectedDistances) => {
    const result = graph;
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph.length; j++) {
            if (result[i][j] !== expectedDistances[i][j]) {
                return false; 
            }
        }
    }

    return true; 
};



