import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Generate random number from normal distribution
const randn = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

// Matrix multiplication
const matmul = (A, B) => {
  const n = A.length;
  const m = B[0].length;
  const k = B.length;
  const C = Array(n).fill(null).map(() => Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      for (let l = 0; l < k; l++) {
        C[i][j] += A[i][l] * B[l][j];
      }
    }
  }
  return C;
};

// Matrix-vector multiplication
const matvec = (A, v) => {
  return A.map(row => row.reduce((sum, val, j) => sum + val * v[j], 0));
};

// Vector norm
const norm = (v) => Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));

// Normalize vector to sum to 1
const normalize = (v) => {
  const s = v.reduce((a, b) => a + b, 0);
  return v.map(x => x / s);
};

// ============================================================================
// GRAPH GENERATORS
// ============================================================================

const generateErdosRenyi = (n, p) => {
  const nodes = Array(n).fill(null).map((_, i) => ({ id: i }));
  const edges = [];
  
  // Generate edges
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < p) {
        edges.push({ source: i, target: j });
        edges.push({ source: j, target: i });
      }
    }
  }
  
  // Ensure connectivity by adding edges if needed
  const visited = new Set([0]);
  const queue = [0];
  while (queue.length > 0) {
    const curr = queue.shift();
    for (const e of edges) {
      if (e.source === curr && !visited.has(e.target)) {
        visited.add(e.target);
        queue.push(e.target);
      }
    }
  }
  
  // Connect unvisited nodes
  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      const connected = Array.from(visited)[Math.floor(Math.random() * visited.size)];
      edges.push({ source: i, target: connected });
      edges.push({ source: connected, target: i });
      visited.add(i);
    }
  }
  
  return { nodes, edges };
};

const generateSBM = (k, nodesPerBlock, pIn, pOut) => {
  const n = k * nodesPerBlock;
  const nodes = Array(n).fill(null).map((_, i) => ({ 
    id: i, 
    block: Math.floor(i / nodesPerBlock) 
  }));
  const edges = [];
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sameBlock = nodes[i].block === nodes[j].block;
      const prob = sameBlock ? pIn : pOut;
      if (Math.random() < prob) {
        edges.push({ source: i, target: j });
        edges.push({ source: j, target: i });
      }
    }
  }
  
  // Ensure connectivity
  const visited = new Set([0]);
  const queue = [0];
  while (queue.length > 0) {
    const curr = queue.shift();
    for (const e of edges) {
      if (e.source === curr && !visited.has(e.target)) {
        visited.add(e.target);
        queue.push(e.target);
      }
    }
  }
  
  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      const connected = Array.from(visited)[Math.floor(Math.random() * visited.size)];
      edges.push({ source: i, target: connected });
      edges.push({ source: connected, target: i });
      visited.add(i);
    }
  }
  
  return { nodes, edges };
};

// The "MIT Example" from the paper (Figure 1)
const generateMITExample = () => {
  const nodes = [
    { id: 0, label: '0' },
    { id: 1, label: '1' },
    { id: 2, label: '2' },
    { id: 3, label: '3' },
    { id: 4, label: '4' },
    { id: 5, label: '5' },
    { id: 6, label: '6' },
    { id: 7, label: '7' },
  ];
  
  // Undirected edges from Figure 1
  const undirectedEdges = [
    [0, 1], [0, 2], [0, 4], [0, 6],
    [1, 3], [2, 3],
    [4, 5], [6, 7]
  ];
  
  const edges = [];
  for (const [i, j] of undirectedEdges) {
    edges.push({ source: i, target: j });
    edges.push({ source: j, target: i });
  }
  
  return { nodes, edges };
};

// ============================================================================
// WEIGHT COMPUTATION
// ============================================================================

// Compute uniform weights (standard DeGroot)
const computeUniformWeights = (nodes, edges) => {
  const n = nodes.length;
  const A = Array(n).fill(null).map(() => Array(n).fill(0));
  
  // Count outgoing edges for each node
  const outDegree = Array(n).fill(0);
  for (const e of edges) {
    outDegree[e.source]++;
  }
  
  // Set uniform weights
  for (const e of edges) {
    A[e.source][e.target] = 1 / outDegree[e.source];
  }
  
  return A;
};

// Compute stationary distribution via power iteration
const computeStationary = (A, maxIter = 1000, tol = 1e-10) => {
  const n = A.length;
  let pi = Array(n).fill(1 / n);
  
  for (let iter = 0; iter < maxIter; iter++) {
    // pi_new = pi^T * A, but we want left eigenvector, so A^T * pi
    const piNew = Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        piNew[j] += pi[i] * A[i][j];
      }
    }
    
    // Normalize
    const s = piNew.reduce((a, b) => a + b, 0);
    for (let i = 0; i < n; i++) piNew[i] /= s;
    
    // Check convergence
    let diff = 0;
    for (let i = 0; i < n; i++) diff += Math.abs(piNew[i] - pi[i]);
    
    pi = piNew;
    if (diff < tol) break;
  }
  
  return pi;
};

// Solve the convex equilibrium problem using projected gradient descent
const computeEquilibriumWeights = (nodes, edges, epsilon = 0.01, maxIter = 500) => {
  const n = nodes.length;
  
  // Build adjacency structure
  const neighbors = Array(n).fill(null).map(() => []);
  for (const e of edges) {
    if (!neighbors[e.source].includes(e.target)) {
      neighbors[e.source].push(e.target);
    }
  }
  
  // Initialize pi uniformly
  let pi = Array(n).fill(1 / n);
  
  // Initialize B = diag(pi) * A_uniform
  let B = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    const deg = neighbors[i].length;
    for (const j of neighbors[i]) {
      B[i][j] = pi[i] / deg;
    }
  }
  
  const lr = 0.5;
  
  for (let iter = 0; iter < maxIter; iter++) {
    // Gradient of ||pi||^2 w.r.t. pi is 2*pi
    // But we need to work with the constraints
    
    // Project B to satisfy constraints
    // Constraint: B_ij >= epsilon * pi_i for edges, B_ij = 0 for non-edges
    // Constraint: sum_j B_ij = pi_i (row sum)
    // Constraint: sum_i B_ij = pi_j (column sum)
    
    // Update pi based on gradient (want to minimize ||pi||^2)
    // Subject to pi being achievable
    
    // Simple approach: iterate between updating pi and B
    
    // 1. Update pi using gradient step
    const grad = pi.map(p => 2 * p);
    const avgGrad = grad.reduce((a, b) => a + b, 0) / n;
    
    // Project gradient to simplex tangent space
    const projGrad = grad.map(g => g - avgGrad);
    
    // Take step
    let piNew = pi.map((p, i) => p - lr * projGrad[i]);
    
    // Project to simplex
    piNew = piNew.map(p => Math.max(p, 1e-8));
    const s = piNew.reduce((a, b) => a + b, 0);
    piNew = piNew.map(p => p / s);
    
    // 2. Update B to be consistent with new pi
    // For each row i, we need sum_j B_ij = pi_i and B_ij >= epsilon * pi_i
    for (let i = 0; i < n; i++) {
      const deg = neighbors[i].length;
      if (deg === 0) continue;
      
      // Initialize with minimum required
      for (const j of neighbors[i]) {
        B[i][j] = epsilon * piNew[i];
      }
      
      // Distribute remaining mass
      const minSum = epsilon * piNew[i] * deg;
      const remaining = piNew[i] - minSum;
      
      if (remaining > 0) {
        // Distribute to minimize column sum deviation
        // Simple: distribute uniformly
        for (const j of neighbors[i]) {
          B[i][j] += remaining / deg;
        }
      }
    }
    
    // 3. Adjust to satisfy column constraints approximately
    // This is the tricky part - we use a few iterations of alternating projections
    for (let projIter = 0; projIter < 10; projIter++) {
      // Compute current column sums
      const colSums = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          colSums[j] += B[i][j];
        }
      }
      
      // Scale columns to match pi
      for (let j = 0; j < n; j++) {
        if (colSums[j] > 1e-10) {
          const scale = piNew[j] / colSums[j];
          for (let i = 0; i < n; i++) {
            B[i][j] *= scale;
          }
        }
      }
      
      // Re-enforce row sums and minimum constraints
      for (let i = 0; i < n; i++) {
        const deg = neighbors[i].length;
        if (deg === 0) continue;
        
        // Enforce minimum
        for (const j of neighbors[i]) {
          B[i][j] = Math.max(B[i][j], epsilon * piNew[i]);
        }
        
        // Re-normalize row
        let rowSum = 0;
        for (const j of neighbors[i]) {
          rowSum += B[i][j];
        }
        
        if (rowSum > 1e-10) {
          const scale = piNew[i] / rowSum;
          for (const j of neighbors[i]) {
            B[i][j] *= scale;
          }
        }
      }
    }
    
    pi = piNew;
  }
  
  // Construct A from B: A_ij = B_ij / pi_i
  const A = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    if (pi[i] > 1e-10) {
      for (let j = 0; j < n; j++) {
        A[i][j] = B[i][j] / pi[i];
      }
    }
  }
  
  // Verify and fix row stochasticity
  for (let i = 0; i < n; i++) {
    const rowSum = A[i].reduce((a, b) => a + b, 0);
    if (rowSum > 1e-10) {
      for (let j = 0; j < n; j++) {
        A[i][j] /= rowSum;
      }
    }
  }
  
  return { A, pi };
};

// ============================================================================
// COLOR SCALES
// ============================================================================

const interpolateColor = (color1, color2, t) => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Opinion color: red (negative) -> white (0) -> blue (positive)
const opinionColor = (opinion) => {
  const clamped = Math.max(-3, Math.min(3, opinion));
  const t = (clamped + 3) / 6; // Map [-3, 3] to [0, 1]
  
  if (t < 0.5) {
    return interpolateColor('#dc2626', '#ffffff', t * 2);
  } else {
    return interpolateColor('#ffffff', '#2563eb', (t - 0.5) * 2);
  }
};

// Edge weight color: light blue -> deep purple
const weightColor = (weight, maxWeight) => {
  const t = Math.min(1, weight / Math.max(maxWeight, 0.01));
  return interpolateColor('#93c5fd', '#7c3aed', t);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const RationalDeGrootSimulation = () => {
  const [view, setView] = useState('landing'); // 'landing' or 'simulation'
  const [networkType, setNetworkType] = useState(null);
  
  // Network state
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [positions, setPositions] = useState({});
  const [weightMatrix, setWeightMatrix] = useState([]);
  const [stationaryDist, setStationaryDist] = useState([]);
  
  // Network parameters
  const [erProb, setErProb] = useState(0.3);
  const [sbmBlocks, setSbmBlocks] = useState(3);
  const [sbmNodesPerBlock, setSbmNodesPerBlock] = useState(5);
  const [sbmPIn, setSbmPIn] = useState(0.7);
  const [sbmPOut, setSbmPOut] = useState(0.1);
  
  // Weighting scheme
  const [weightScheme, setWeightScheme] = useState('uniform');
  const [epsilon, setEpsilon] = useState(0.01);
  const [computing, setComputing] = useState(false);
  
  // Simulation state
  const [opinions, setOpinions] = useState([]);
  const [timeStep, setTimeStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(2);
  
  // UI state
  const [expandedPanels, setExpandedPanels] = useState({
    network: true,
    weights: true,
    dynamics: true,
  });
  
  // Dragging state
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef(null);
  
  // Initialize network when type changes
  const initializeNetwork = useCallback((type) => {
    let newGraph;
    
    switch (type) {
      case 'erdos-renyi':
        newGraph = generateErdosRenyi(15, erProb);
        break;
      case 'sbm':
        newGraph = generateSBM(sbmBlocks, sbmNodesPerBlock, sbmPIn, sbmPOut);
        break;
      case 'mit':
        newGraph = generateMITExample();
        break;
      default:
        newGraph = { nodes: [], edges: [] };
    }
    
    setGraph(newGraph);
    
    // Initialize positions in a circle
    const n = newGraph.nodes.length;
    const newPositions = {};
    newGraph.nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      newPositions[node.id] = {
        x: 300 + 200 * Math.cos(angle),
        y: 250 + 200 * Math.sin(angle),
        vx: 0,
        vy: 0,
      };
    });
    setPositions(newPositions);
    
    // Compute initial weights
    const A = computeUniformWeights(newGraph.nodes, newGraph.edges);
    setWeightMatrix(A);
    
    // Compute stationary distribution
    const pi = computeStationary(A);
    setStationaryDist(pi);
    
    // Initialize opinions
    setOpinions(newGraph.nodes.map(() => randn()));
    setTimeStep(0);
    setRunning(false);
  }, [erProb, sbmBlocks, sbmNodesPerBlock, sbmPIn, sbmPOut]);
  
  // Force simulation
  useEffect(() => {
    if (graph.nodes.length === 0) return;
    
    const interval = setInterval(() => {
      setPositions(prev => {
        const newPos = { ...prev };
        const n = graph.nodes.length;
        
        // Parameters
        const repulsion = 5000;
        const attraction = 0.005;
        const damping = 0.85;
        const centerForce = 0.01;
        
        // Compute forces
        const forces = {};
        graph.nodes.forEach(node => {
          forces[node.id] = { fx: 0, fy: 0 };
        });
        
        // Repulsion between all pairs
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const ni = graph.nodes[i].id;
            const nj = graph.nodes[j].id;
            const dx = newPos[nj].x - newPos[ni].x;
            const dy = newPos[nj].y - newPos[ni].y;
            const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
            const force = repulsion / (dist * dist);
            
            forces[ni].fx -= force * dx / dist;
            forces[ni].fy -= force * dy / dist;
            forces[nj].fx += force * dx / dist;
            forces[nj].fy += force * dy / dist;
          }
        }
        
        // Attraction along edges
        const seen = new Set();
        for (const edge of graph.edges) {
          const key = `${Math.min(edge.source, edge.target)}-${Math.max(edge.source, edge.target)}`;
          if (seen.has(key)) continue;
          seen.add(key);
          
          const dx = newPos[edge.target].x - newPos[edge.source].x;
          const dy = newPos[edge.target].y - newPos[edge.source].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = attraction * (dist - 100);
          
          forces[edge.source].fx += force * dx / dist;
          forces[edge.source].fy += force * dy / dist;
          forces[edge.target].fx -= force * dx / dist;
          forces[edge.target].fy -= force * dy / dist;
        }
        
        // Center force
        graph.nodes.forEach(node => {
          const dx = 300 - newPos[node.id].x;
          const dy = 250 - newPos[node.id].y;
          forces[node.id].fx += centerForce * dx;
          forces[node.id].fy += centerForce * dy;
        });
        
        // Apply forces
        graph.nodes.forEach(node => {
          if (dragging === node.id) return;
          
          const pos = newPos[node.id];
          pos.vx = (pos.vx + forces[node.id].fx) * damping;
          pos.vy = (pos.vy + forces[node.id].fy) * damping;
          pos.x += pos.vx;
          pos.y += pos.vy;
          
          // Keep within bounds
          pos.x = Math.max(30, Math.min(570, pos.x));
          pos.y = Math.max(30, Math.min(470, pos.y));
        });
        
        return newPos;
      });
    }, 16);
    
    return () => clearInterval(interval);
  }, [graph, dragging]);
  
  // Update weights when scheme changes
  useEffect(() => {
    if (graph.nodes.length === 0) return;
    
    if (weightScheme === 'uniform') {
      const A = computeUniformWeights(graph.nodes, graph.edges);
      setWeightMatrix(A);
      const pi = computeStationary(A);
      setStationaryDist(pi);
    } else if (weightScheme === 'equilibrium') {
      setComputing(true);
      setTimeout(() => {
        const { A, pi } = computeEquilibriumWeights(graph.nodes, graph.edges, epsilon);
        setWeightMatrix(A);
        setStationaryDist(pi);
        setComputing(false);
      }, 100);
    }
  }, [weightScheme, epsilon, graph]);
  
  // DeGroot dynamics
  useEffect(() => {
    if (!running || weightMatrix.length === 0) return;
    
    const interval = setInterval(() => {
      setOpinions(prev => matvec(weightMatrix, prev));
      setTimeStep(t => t + 1);
    }, 1000 / speed);
    
    return () => clearInterval(interval);
  }, [running, speed, weightMatrix]);
  
  // Reset simulation
  const resetSimulation = () => {
    setOpinions(graph.nodes.map(() => randn()));
    setTimeStep(0);
    setRunning(false);
  };
  
  // Handle drag
  const handleMouseDown = (nodeId, e) => {
    setDragging(nodeId);
    e.preventDefault();
  };
  
  const handleMouseMove = (e) => {
    if (dragging === null || !svgRef.current) return;
    
    const svg = svgRef.current;
    
    // Use SVG's native coordinate transformation
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    
    // Transform from screen coordinates to SVG coordinates
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    
    const svgPoint = point.matrixTransform(ctm.inverse());
    
    setPositions(prev => ({
      ...prev,
      [dragging]: { ...prev[dragging], x: svgPoint.x, y: svgPoint.y, vx: 0, vy: 0 },
    }));
  };
  
  const handleMouseUp = () => {
    setDragging(null);
  };
  
  // Compute max weight for color scaling
  const maxWeight = useMemo(() => {
    if (weightMatrix.length === 0) return 1;
    return Math.max(...weightMatrix.flat());
  }, [weightMatrix]);
  
  // MSE display
  const mse = useMemo(() => {
    if (stationaryDist.length === 0) return 0;
    return stationaryDist.reduce((sum, p) => sum + p * p, 0);
  }, [stationaryDist]);
  
  // Toggle panel
  const togglePanel = (panel) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };
  
  // Landing page
  if (view === 'landing') {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-slate-800 mb-4">
              Rational DeGroot Learning
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Interactive simulation of strategic attention allocation in social networks.
              Agents minimize consensus variance by optimally weighting their neighbors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'erdos-renyi',
                title: 'Erdős-Rényi Graph',
                description: 'Random graph where each edge exists independently with probability p.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                id: 'sbm',
                title: 'Stochastic Block Model',
                description: 'Clustered graph with dense within-block and sparse between-block connections.',
                color: 'from-violet-500 to-violet-600',
              },
              {
                id: 'mit',
                title: 'Paper Example',
                description: 'The 8-node example network from the paper illustrating core-periphery structure.',
                color: 'from-emerald-500 to-emerald-600',
              },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setNetworkType(item.id);
                  initializeNetwork(item.id);
                  setView('simulation');
                }}
                className={`p-6 rounded-xl bg-gradient-to-br ${item.color} text-white text-left transition-transform hover:scale-105 hover:shadow-xl shadow-lg`}
              >
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-white/80 text-sm">{item.description}</p>
              </button>
            ))}
          </div>
          
          <div className="mt-12 p-6 rounded-xl border border-slate-400/30">
            <h3 className="text-lg font-medium text-slate-700 mb-3">Key Economic Insight</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              In equilibrium, agents strategically allocate attention to minimize the variance of consensus beliefs.
              The optimal stationary distribution π* is always unique (convex objective), representing
              how social influence is distributed across agents. Peripheral agents with access to
              independent information sources receive disproportionate weight from their neighbors.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Simulation view
  return (
    <div className="min-h-screen flex">
      {/* Main visualization */}
      <div className="flex-1 p-4">
        <div className="rounded-xl border border-slate-400/30 h-full flex flex-col">
          <div className="p-4 border-b border-slate-400/30 flex items-center justify-between">
            <button
              onClick={() => setView('landing')}
              className="text-slate-500 hover:text-slate-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="text-sm text-slate-500">
              <span className="font-medium">MSE: </span>
              <span className="text-slate-700">{mse.toFixed(6)}</span>
              <span className="mx-3">|</span>
              <span className="font-medium">t = </span>
              <span className="text-slate-700">{timeStep}</span>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <svg
              ref={svgRef}
              viewBox="0 0 600 500"
              className="w-full h-full"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Edges */}
              {graph.edges.filter((e, i) => 
                graph.edges.findIndex(e2 => 
                  e2.source === e.source && e2.target === e.target
                ) === i
              ).map((edge, i) => {
                const sourcePos = positions[edge.source];
                const targetPos = positions[edge.target];
                if (!sourcePos || !targetPos) return null;
                
                const weight = weightMatrix[edge.source]?.[edge.target] || 0;
                
                return (
                  <line
                    key={i}
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={weightColor(weight, maxWeight)}
                    strokeWidth={Math.max(1, weight * 8)}
                    strokeOpacity={0.6}
                  />
                );
              })}
              
              {/* Nodes */}
              {graph.nodes.map((node, i) => {
                const pos = positions[node.id];
                if (!pos) return null;
                
                const pi = stationaryDist[node.id] || 1 / graph.nodes.length;
                const radius = 10 + pi * 150;
                const opinion = opinions[node.id] || 0;
                
                return (
                  <g
                    key={node.id}
                    onMouseDown={(e) => handleMouseDown(node.id, e)}
                    style={{ cursor: 'grab' }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius}
                      fill={opinionColor(opinion)}
                      stroke="#475569"
                      strokeWidth={2}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-xs font-medium fill-slate-700 pointer-events-none select-none"
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg p-3 text-xs border border-slate-400/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-20 h-3 rounded" style={{
                  background: 'linear-gradient(to right, #dc2626, #ffffff, #2563eb)'
                }} />
                <span className="text-slate-600">Opinion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-3 rounded" style={{
                  background: 'linear-gradient(to right, #93c5fd, #7c3aed)'
                }} />
                <span className="text-slate-600">Edge weight</span>
              </div>
              <div className="mt-2 text-slate-500">
                Node size ∝ social influence (π)
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="w-80 border-l border-slate-400/30 overflow-y-auto">
        {/* Network Parameters */}
        <div className="border-b border-slate-400/30">
          <button
            onClick={() => togglePanel('network')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-500/10"
          >
            <span className="font-medium text-slate-700">Network Parameters</span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${expandedPanels.network ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedPanels.network && (
            <div className="px-4 pb-4 space-y-4">
              {networkType === 'erdos-renyi' && (
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    Edge probability: {erProb.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={erProb}
                    onChange={(e) => setErProb(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
              
              {networkType === 'sbm' && (
                <>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Blocks: {sbmBlocks}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="5"
                      value={sbmBlocks}
                      onChange={(e) => setSbmBlocks(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Nodes per block: {sbmNodesPerBlock}
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="8"
                      value={sbmNodesPerBlock}
                      onChange={(e) => setSbmNodesPerBlock(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Within-block p: {sbmPIn.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.3"
                      max="0.95"
                      step="0.05"
                      value={sbmPIn}
                      onChange={(e) => setSbmPIn(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Between-block p: {sbmPOut.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.01"
                      max="0.3"
                      step="0.01"
                      value={sbmPOut}
                      onChange={(e) => setSbmPOut(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}
              
              {networkType === 'mit' && (
                <p className="text-sm text-slate-500">
                  The paper's example network with 8 nodes demonstrating core-periphery structure.
                  Agent 0 has neighbors {'{1,2,4,6}'} where 1-2 share a common neighbor (3) 
                  while 4-6 provide independent information.
                </p>
              )}
              
              <button
                onClick={() => initializeNetwork(networkType)}
                className="w-full py-2 px-4 border border-slate-400/40 hover:bg-slate-500/10 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Regenerate Network
              </button>
            </div>
          )}
        </div>
        
        {/* Weighting Scheme */}
        <div className="border-b border-slate-400/30">
          <button
            onClick={() => togglePanel('weights')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-500/10"
          >
            <span className="font-medium text-slate-700">Weighting Scheme</span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${expandedPanels.weights ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedPanels.weights && (
            <div className="px-4 pb-4 space-y-3">
              <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-500/10 cursor-pointer">
                <input
                  type="radio"
                  name="weights"
                  checked={weightScheme === 'uniform'}
                  onChange={() => setWeightScheme('uniform')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-slate-700 text-sm">Uniform Weights</div>
                  <div className="text-xs text-slate-500">
                    Each agent places equal weight 1/d on all d neighbors
                  </div>
                </div>
              </label>
              
              <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-500/10 cursor-pointer">
                <input
                  type="radio"
                  name="weights"
                  checked={weightScheme === 'equilibrium'}
                  onChange={() => setWeightScheme('equilibrium')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-700 text-sm">Equilibrium Weights</div>
                  <div className="text-xs text-slate-500 mb-2">
                    Minimize ||π||² via convex optimization
                  </div>
                  {weightScheme === 'equilibrium' && (
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        ε (minimum weight): {epsilon}
                      </label>
                      <input
                        type="range"
                        min="0.001"
                        max="0.1"
                        step="0.001"
                        value={epsilon}
                        onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </label>
              
              {computing && (
                <div className="text-center py-2 text-sm text-violet-600">
                  Computing equilibrium...
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* DeGroot Dynamics */}
        <div className="border-b border-slate-400/30">
          <button
            onClick={() => togglePanel('dynamics')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-500/10"
          >
            <span className="font-medium text-slate-700">DeGroot Dynamics</span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${expandedPanels.dynamics ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedPanels.dynamics && (
            <div className="px-4 pb-4 space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setRunning(!running)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    running
                      ? 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30 border border-emerald-500/40'
                  }`}
                >
                  {running ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetSimulation}
                  className="py-2 px-4 border border-slate-400/40 hover:bg-slate-500/10 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
              
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Speed: {speed} steps/sec
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="text-xs text-slate-500">
                <p className="mb-1">
                  <strong>Update rule:</strong> b(t+1) = A · b(t)
                </p>
                <p>
                  Initial opinions drawn from N(0,1). Colors show current beliefs 
                  (red negative, blue positive).
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Influence distribution */}
        <div className="p-4">
          <h3 className="font-medium text-slate-700 mb-3">Social Influence (π)</h3>
          <div className="space-y-1">
            {graph.nodes.slice().sort((a, b) => 
              (stationaryDist[b.id] || 0) - (stationaryDist[a.id] || 0)
            ).map(node => (
              <div key={node.id} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-6">{node.id}</span>
                <div className="flex-1 bg-slate-500/20 rounded-full h-2">
                  <div
                    className="bg-violet-500 h-2 rounded-full transition-all"
                    style={{ width: `${(stationaryDist[node.id] || 0) * 100 * graph.nodes.length}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 w-12 text-right">
                  {((stationaryDist[node.id] || 0) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RationalDeGrootSimulation;
