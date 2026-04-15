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

// Backboard proxy configuration
const BACKBOARD_PROXY_URL =
    "http://localhost:3000/api/backboard/message";

// Global managers
let uiManager = null;
let neuralVFX = null;
let particleEffects = null;
let assistantResponseTarget = null;
let assistantRequestInFlight = false;

// Conversation session state for backend proxy usage
const backboardSession = {
    assistantId: null,
    threadId: null,
};

/**
 * Initialize the lens
 */
async function initializeLens() {
    try {
        Diagnostics.log("Initializing Futuristic AR Lens...");

        // Initialize Holographic UI Manager
        uiManager = new HolographicUIManager();
        uiManager.initialize();
        uiManager.setPanelTapHandler(onUIPanelTap);

        // Optional scene text target for assistant responses
        await initializeAssistantResponseTarget();

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

/**
 * Optional text target lookup for displaying assistant output in-scene.
 */
async function initializeAssistantResponseTarget() {
    try {
        const found = await scene.root.findByPath("**/AssistantResponseText");
        if (found && found.length > 0) {
            assistantResponseTarget = found[0];
            Diagnostics.log("AssistantResponseText target connected");
        }
    } catch (error) {
        Diagnostics.log("AssistantResponseText lookup skipped: " + error);
    }
}

/**
 * Update scene text if the optional AssistantResponseText object exists.
 */
function setAssistantResponseText(value) {
    if (!assistantResponseTarget || typeof value !== "string") {
        return;
    }

    try {
        if (assistantResponseTarget.text !== undefined) {
            assistantResponseTarget.text = value;
            return;
        }

        if (
            assistantResponseTarget.textProperty &&
            assistantResponseTarget.textProperty.pinLastValue
        ) {
            assistantResponseTarget.textProperty.pinLastValue(value);
        }
    } catch (error) {
        Diagnostics.log("Failed to update AssistantResponseText: " + error);
    }
}

/**
 * Trigger assistant request from active panel taps.
 */
async function onUIPanelTap(event) {
    if (!event || !event.isActive || assistantRequestInFlight) {
        return;
    }

    assistantRequestInFlight = true;

    try {
        const prompt =
            "Panel " +
            event.index +
            " activated. Give one short futuristic UI guidance tip for this lens.";
        const result = await sendAssistantPrompt(prompt);
        const assistantText =
            result && result.response && result.response.content
                ? result.response.content
                : "No assistant response available.";
        setAssistantResponseText(assistantText);
    } finally {
        assistantRequestInFlight = false;
    }
}

/**
 * Send a prompt to the local Backboard proxy.
 * Requires a reachable backend endpoint and a runtime that supports fetch.
 */
async function sendAssistantPrompt(content, options) {
    const payload = {
        content: content,
        assistantId: backboardSession.assistantId,
        threadId: backboardSession.threadId,
        memory: "Auto",
        llmProvider: "openai",
        modelName: "gpt-4o",
        stream: false,
        ...(options || {}),
    };

    if (!content || typeof content !== "string") {
        Diagnostics.log("sendAssistantPrompt: content must be a non-empty string");
        return null;
    }

    if (typeof fetch !== "function") {
        Diagnostics.log(
            "sendAssistantPrompt: fetch API not available in this runtime"
        );
        return null;
    }

    try {
        const response = await fetch(BACKBOARD_PROXY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const body = await response.json();
        if (!response.ok) {
            Diagnostics.log(
                "Backboard proxy error: " +
                    (body && body.detail ? JSON.stringify(body.detail) : "Unknown")
            );
            return null;
        }

        if (body.assistantId) {
            backboardSession.assistantId = body.assistantId;
        }
        if (body.threadId) {
            backboardSession.threadId = body.threadId;
        }

        const assistantContent =
            body && body.response && body.response.content
                ? body.response.content
                : "";

        Diagnostics.log("Assistant reply: " + assistantContent);
        return body;
    } catch (error) {
        Diagnostics.log("Network error calling Backboard proxy: " + error);
        return null;
    }
}

/**
 * Clear assistant context so next call starts a fresh thread.
 */
function resetAssistantSession() {
    backboardSession.assistantId = null;
    backboardSession.threadId = null;
    Diagnostics.log("Assistant session cleared");
}

// Initialize on script load
initializeLens();

// Export functions for external access
module.exports = {
    setGlowIntensity,
    setAnimationSpeed,
    resetLens,
    sendAssistantPrompt,
    resetAssistantSession,
    onLensEnabled,
    onLensDisabled,
};
