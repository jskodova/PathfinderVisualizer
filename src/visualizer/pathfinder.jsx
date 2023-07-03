import React, { Component } from 'react';
import Node from './node/node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar';
import { greedyBestFirst } from '../algorithms/greedyBestFirst';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';

import './pathfinder.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    // Initializing the grid
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  // Mouse down event
  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  // Mouse enter event
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  // Mouse up event
  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  // Dijkstra's algorithm animation
  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  // Animating the shortest path
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }
  visualizeAlgorithm(algorithmName) {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    let visitedNodesInOrder, nodesInShortestPathOrder;
    if (algorithmName === 'astar') {
      visitedNodesInOrder = astar(grid, startNode, finishNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    } else if (algorithmName === 'dijkstra') {
      visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    } else if (algorithmName === 'greedyBestFirst') {
      visitedNodesInOrder = greedyBestFirst(grid, startNode, finishNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    } else if (algorithmName === 'bfs') {
      visitedNodesInOrder = bfs(grid, startNode, finishNode); // Call the Breadth-First Search algorithm
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    } else if (algorithmName === 'dfs') {
        visitedNodesInOrder = dfs(grid, startNode, finishNode); // Call the Breadth-First Search algorithm
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      }

    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeAlgorithm('astar')}>
          Visualize A* Algorithm
        </button>
        <button onClick={() => this.visualizeAlgorithm('dijkstra')}>
          Visualize Dijkstra Algorithm
        </button>
        <button onClick={() => this.visualizeAlgorithm('greedyBestFirst')}>
          Visualize Greedy Best-First Search Algorithm
        </button>
        <button onClick={() => this.visualizeAlgorithm('bfs')}>
          Visualize BFS Algorithm
        </button>
        <button onClick={() => this.visualizeAlgorithm('dfs')}>
          Visualize DFS Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) =>
                        this.handleMouseDown(row, col)
                      }
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

// Initial grid for visualization
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

// Node for the grid
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

// Wall status of a node in the grid
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
