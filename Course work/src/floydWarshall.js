export const floydWarshall = (graph) => {
    let nodes = graph.length;
    let dist = graph;

    for (let k = 0; k < nodes; k++) {
        for (let i = 0; i < nodes; i++) {
            for (let j = 0; j < nodes; j++) {
                if ((dist[i][k] + dist[k][j]) < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    return dist;
}




