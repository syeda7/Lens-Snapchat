/**
 * Main.js
 * Entry point for the futuristic AR lens
 * Initializes all systems and manages the lens lifecycle
 */

const scene = require("Scene");
const Diagnostics = require("Diagnostics");
const Interaction = require("Interaction");

// Import custom managers
const HolographicUIManager = require("./HolographicUIManager");
const NeuralNetworkVFX = require("./NeuralNetworkVFX");
const ParticleEffects = require("./ParticleEffects");

// Global managers
let uiManager = null;
let neuralVFX = null;
let particleEffects = null;

/**
 * Initialize the lens
 */
async function initializeLens() {
    try {
        Diagnostics.log("Initializing Futuristic AR Lens...");

        // Initialize Holographic UI Manager
        uiManager = new HolographicUIManager();
        uiManager.initialize();

        // Initialize Neural Network VFX
        neuralVFX = new NeuralNetworkVFX({
            nodeCount: 12,
            connectionCount: 20,
            pulseSpeed: 2000,
            glowColor: [0.0, 0.8, 1.0],
        });
        await neuralVFX.initialize();

        // Initialize Particle Effects
        particleEffects = new ParticleEffects({
            particleCount: 100,
            emissionRate: 50,
            lifetime: 3000,
            particleColor: [0.5, 0.9, 1.0],
        });
        await particleEffects.initialize();

        Diagnostics.log("Lens initialized successfully");

        // Start update loop
        startUpdateLoop();
    } catch (error) {
        Diagnostics.log("Error initializing lens: " + error);
    }
}

/**
 * Main update loop
 */
let lastUpdateTime = Date.now();

function startUpdateLoop() {
    setInterval(() => {
        const now = Date.now();
        const deltaTime = now - lastUpdateTime;
        lastUpdateTime = now;

        // Update all systems
        if (particleEffects) {
            particleEffects.update(deltaTime);
        }

        if (neuralVFX) {
            neuralVFX.update(deltaTime);
        }

        // Update UI animations
        updateUIAnimations(deltaTime);
    }, 1000 / 60); // 60 FPS update rate
}

/**
 * Update UI animations
 */
function updateUIAnimations(deltaTime) {
    // This would be called to update UI element animations
    // Implement frame-by-frame animation updates here
}

/**
 * Handle lens enable event
 */
function onLensEnabled() {
    Diagnostics.log("Lens enabled");
    if (particleEffects) {
        particleEffects.startEmission();
    }
}

/**
 * Handle lens disable event
 */
function onLensDisabled() {
    Diagnostics.log("Lens disabled");
    if (particleEffects) {
        particleEffects.stopEmission();
    }
}

/**
 * Set glow intensity (for user control)
 */
function setGlowIntensity(value) {
    if (uiManager) {
        uiManager.setGlowIntensity(value);
    }
    if (neuralVFX) {
        neuralVFX.setGlowIntensity(value);
    }
}

/**
 * Set animation speed (for user control)
 */
function setAnimationSpeed(value) {
    if (uiManager) {
        uiManager.setPulseSpeed(value);
    }
    if (neuralVFX) {
        neuralVFX.setAnimationSpeed(value);
    }
}

/**
 * Reset lens to default state
 */
function resetLens() {
    setGlowIntensity(1.5);
    setAnimationSpeed(1.0);
    Diagnostics.log("Lens reset to defaults");
}

// Initialize on script load
initializeLens();

// Export functions for external access
module.exports = {
    setGlowIntensity,
    setAnimationSpeed,
    resetLens,
    onLensEnabled,
    onLensDisabled,
};
