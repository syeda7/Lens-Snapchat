/**
 * HolographicUIManager.js
 * Manages holographic UI elements and interactions
 */

const scene = require("Scene");
const Interaction = require("Interaction");
const Animation = require("Animation");
const Diagnostics = require("Diagnostics");

// Get UI panel references
const uiPanels = [];
const panelAnimators = [];

// Configuration
const config = {
    glowIntensity: 1.5,
    pulseSpeed: 1.0,
    panelOpacity: 0.9,
    interactionScale: 1.1,
};

class HolographicUIManager {
    constructor() {
        this.initialized = false;
        this.activePanels = new Set();
        this.animationDrivers = [];
    }

    /**
     * Initialize UI elements
     */
    initialize() {
        try {
            // Find all UI panel objects in scene
            scene.root.findByPath("**/HolographicPanel*").then((panels) => {
                panels.forEach((panel, index) => {
                    this.setupPanel(panel, index);
                });
            });
            
            this.initialized = true;
            Diagnostics.log("HolographicUIManager initialized");
        } catch (error) {
            Diagnostics.log("Error initializing HolographicUIManager: " + error);
        }
    }

    /**
     * Setup individual panel
     */
    setupPanel(panel, index) {
        // Create pulse animation
        const timeDriver = new Animation.TimeDriver({
            duration: 3000 / config.pulseSpeed,
            loopCount: Infinity,
            mirror: true,
        });

        // Create sampler for pulse effect
        const pulseSampler = Animation.samplers.easeInOutQuad(
            config.glowIntensity * 0.8,
            config.glowIntensity
        );

        // Add interaction handler
        this.setupPanelInteraction(panel, index);

        // Store for management
        uiPanels.push(panel);
        panelAnimators.push(timeDriver);
    }

    /**
     * Setup interaction for panel
     */
    setupPanelInteraction(panel, index) {
        panel.onTap().subscribe(() => {
            this.activatePanel(panel, index);
        });
    }

    /**
     * Activate panel with animation
     */
    activatePanel(panel, index) {
        if (this.activePanels.has(index)) {
            this.deactivatePanel(panel, index);
            return;
        }

        this.activePanels.add(index);

        // Scale animation
        const scaleDriver = new Animation.TimeDriver({
            duration: 300,
        });

        const scaleSampler = Animation.samplers.easeInOutQuad(
            1.0,
            config.interactionScale
        );

        // Apply animations
        if (panel.transform && panel.transform.scaleX) {
            panel.transform.scaleX = Animation.val(
                scaleDriver,
                scaleSampler
            );
        }

        Diagnostics.log("Panel " + index + " activated");
    }

    /**
     * Deactivate panel
     */
    deactivatePanel(panel, index) {
        this.activePanels.delete(index);

        // Reset scale
        const scaleDriver = new Animation.TimeDriver({
            duration: 300,
        });

        const scaleSampler = Animation.samplers.easeInOutQuad(
            config.interactionScale,
            1.0
        );

        if (panel.transform && panel.transform.scaleX) {
            panel.transform.scaleX = Animation.val(
                scaleDriver,
                scaleSampler
            );
        }

        Diagnostics.log("Panel " + index + " deactivated");
    }

    /**
     * Update glow effect intensity
     */
    setGlowIntensity(value) {
        config.glowIntensity = Math.max(0, Math.min(2, value));
    }

    /**
     * Update pulse animation speed
     */
    setPulseSpeed(value) {
        config.pulseSpeed = Math.max(0.1, Math.min(3, value));
    }
}

// Export and initialize
module.exports = HolographicUIManager;
