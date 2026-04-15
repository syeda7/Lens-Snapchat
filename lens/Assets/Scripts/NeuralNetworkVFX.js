/**
 * NeuralNetworkVFX.js
 * Generates and manages AI-inspired neural network visualization
 */

const scene = require("Scene");
const Animation = require("Animation");
const Diagnostics = require("Diagnostics");

class NeuralNetworkVFX {
    constructor(config = {}) {
        this.config = {
            nodeCount: config.nodeCount || 12,
            connectionCount: config.connectionCount || 20,
            pulseSpeed: config.pulseSpeed || 2000,
            glowColor: config.glowColor || [0.0, 0.8, 1.0], // Cyan
            animationIntensity: config.animationIntensity || 1.0,
            ...config,
        };

        this.nodes = [];
        this.connections = [];
        this.animationDrivers = [];
    }

    /**
     * Initialize neural network visualization
     */
    async initialize() {
        try {
            // Find neural network container
            const networkContainer = await scene.root.findByPath(
                "**/NeuralNetworkContainer"
            );

            if (!networkContainer) {
                Diagnostics.log("NeuralNetworkContainer not found in scene");
                return;
            }

            // Create nodes
            this.createNodes(networkContainer);

            // Create connections between nodes
            this.createConnections(networkContainer);

            // Setup animations
            this.setupAnimations();

            Diagnostics.log("Neural Network VFX initialized");
        } catch (error) {
            Diagnostics.log("Error initializing Neural Network VFX: " + error);
        }
    }

    /**
     * Create neural network nodes
     */
    createNodes(container) {
        const positions = this.generateNodePositions(this.config.nodeCount);

        positions.forEach((pos, index) => {
            const node = {
                id: index,
                position: pos,
                active: Math.random() > 0.3,
                intensity: Math.random() * 0.5 + 0.5,
                pulsePhase: (Math.random() * Math.PI * 2),
            };

            this.nodes.push(node);
        });
    }

    /**
     * Generate random positions for nodes in 3D space
     */
    generateNodePositions(count) {
        const positions = [];
        const radius = 5;

        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);

            positions.push({ x, y, z });
        }

        return positions;
    }

    /**
     * Create connections between nodes
     */
    createConnections() {
        for (let i = 0; i < this.config.connectionCount; i++) {
            const nodeA = Math.floor(Math.random() * this.nodes.length);
            const nodeB = Math.floor(Math.random() * this.nodes.length);

            if (nodeA !== nodeB) {
                this.connections.push({
                    from: nodeA,
                    to: nodeB,
                    intensity: Math.random() * 0.7,
                    active: Math.random() > 0.4,
                });
            }
        }
    }

    /**
     * Setup animations for neural network
     */
    setupAnimations() {
        // Create time driver for continuous animation
        const timeDriver = new Animation.TimeDriver({
            duration: this.config.pulseSpeed,
            loopCount: Infinity,
            mirror: false,
        });

        // Create pulse sampler
        const pulseSampler = Animation.samplers.linear(0, 1);

        this.animationDrivers.push(timeDriver);

        // Update node intensities
        this.nodes.forEach((node) => {
            node.animationDriver = timeDriver;
            node.pulseSampler = pulseSampler;
        });
    }

    /**
     * Update neural network animation
     */
    update(deltaTime) {
        // Randomly activate/deactivate connections
        if (Math.random() > 0.95) {
            const randomConnection = this.connections[
                Math.floor(Math.random() * this.connections.length)
            ];
            randomConnection.active = !randomConnection.active;
        }

        // Update node intensities based on animation
        this.nodes.forEach((node) => {
            if (node.active) {
                node.intensity = Math.sin(
                    Date.now() * 0.001 + node.pulsePhase
                ) * 0.5 + 0.5;
            }
        });
    }

    /**
     * Get node data for rendering
     */
    getNodeData(index) {
        if (index < 0 || index >= this.nodes.length) return null;
        return this.nodes[index];
    }

    /**
     * Get connection data for rendering
     */
    getConnectionData(index) {
        if (index < 0 || index >= this.connections.length) return null;
        return this.connections[index];
    }

    /**
     * Set glow color
     */
    setGlowColor(r, g, b) {
        this.config.glowColor = [r, g, b];
    }

    /**
     * Set animation speed
     */
    setAnimationSpeed(speed) {
        this.config.pulseSpeed = Math.max(500, Math.min(5000, speed));
    }
}

module.exports = NeuralNetworkVFX;
