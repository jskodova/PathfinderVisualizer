export function bfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const queue = [];
    queue.push(startNode);

    while (queue.length > 0) {
      const currentNode = queue.shift();

      if (currentNode === finishNode) {
        return reconstructPath(currentNode);
      }

      if (currentNode.isWall || currentNode.isVisited) {
        continue;
      }

      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);

      const neighbors = getNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.previousNode = currentNode;
          queue.push(neighbor);
        }
      }
    }

    return []; // No path found
  }

  function getNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors;
  }

  function reconstructPath(node) {
    const path = [];
    let currentNode = node;

    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }

    return path;
  }
