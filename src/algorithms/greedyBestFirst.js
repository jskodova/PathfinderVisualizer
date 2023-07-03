export function greedyBestFirst(grid, startNode, finishNode) {
  const openSet = [];
  const closedSet = [];
  startNode.hScore = heuristic(startNode, finishNode);
  openSet.push(startNode);

  while (openSet.length > 0) {
    const currentNode = getLowestHScoreNode(openSet);
    if (currentNode === finishNode) {
      return reconstructPath(currentNode);
    }

    removeFromArray(openSet, currentNode);
    closedSet.push(currentNode);

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (closedSet.includes(neighbor) || neighbor.isWall) {
        continue;
      }

      if (!openSet.includes(neighbor)) {
        neighbor.hScore = heuristic(neighbor, finishNode);
        openSet.push(neighbor);
      }

      neighbor.previousNode = currentNode;
    }
  }

  return []; // No path found
}

function heuristic(nodeA, nodeB) {
  const dx = Math.abs(nodeA.col - nodeB.col);
  const dy = Math.abs(nodeA.row - nodeB.row);
  return dx + dy;
}

function getLowestHScoreNode(nodes) {
  let lowestNode = nodes[0];
  for (let i = 1; i < nodes.length; i++) {
    if (nodes[i].hScore < lowestNode.hScore) {
      lowestNode = nodes[i];
    }
  }
  return lowestNode;
}

function removeFromArray(array, element) {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
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
  