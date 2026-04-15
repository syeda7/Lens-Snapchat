/**
 * ParticleEffects.js
 * Manages soft light particle system and atmospheric effects
 */

const scene = require("Scene");
const Animation = require("Animation");
const Diagnostics = require("Diagnostics");

class ParticleEffects {
    constructor(config = {}) {
        this.config = {
            particleCount: config.particleCount || 100,
            emissionRate: config.emissionRate || 50,
            lifetime: config.lifetime || 3000,
            velocityScale: config.velocityScale || 0.5,
            particleColor: config.particleColor || [0.5, 0.9, 1.0],
            glowIntensity: config.glowIntensity || 0.8,
            ...config,
        };

        this.particles = [];
        this.emitterActive = true;
    }

    /**
     * Initialize particle system
     */
    async initialize() {
        try {
            Diagnostics.log("Particle Effects initialized");
            this.startEmission();
        } catch (error) {
            Diagnostics.log("Error initializing Particle Effects: " + error);
        }
    }

    /**
     * Start particle emission
     */
    startEmission() {
        this.emitterActive = true;
        this.emitParticles();
    }

    /**
     * Stop particle emission
     */
    stopEmission() {
        this.emitterActive = false;
    }

    /**
     * Emit particles
     */
    emitParticles() {
        if (!this.emitterActive) return;

        const particlesToEmit = this.config.emissionRate / 60; // Per frame at 60fps

        for (let i = 0; i < particlesToEmit; i++) {
            this.createParticle();
        }

        // Schedule next emission
        setTimeout(() => this.emitParticles(), 1000 / 60);
    }

    /**
     * Create a single particle
     */
    createParticle() {
        if (this.particles.length >= this.config.particleCount) {
            this.particles.shift(); // Remove oldest particle
        }

        const particle = {
            id: Math.random(),
            position: this.getRandomEmitterPosition(),
            velocity: this.getRandomVelocity(),
            createdAt: Date.now(),
            lifetime: this.config.lifetime,
            opacity: 1.0,
            size: Math.random() * 0.5 + 0.2,
        };

        this.particles.push(particle);
    }

    /**
     * Get random emitter position
     */
    getRandomEmitterPosition() {
        return {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 6,
            z: (Math.random() - 0.5) * 10,
        };
    }

    /**
     * Get random velocity for particle
     */
    getRandomVelocity() {
        const speed = Math.random() * this.config.velocityScale;
        const angle = Math.random() * Math.PI * 2;
        const elevation = Math.random() * Math.PI;

        return {
            x: Math.sin(elevation) * Math.cos(angle) * speed,
            y: Math.sin(elevation) * Math.sin(angle) * speed,
            z: Math.cos(elevation) * speed,
        };
    }

    /**
     * Update particle system
     */
    update(deltaTime) {
        const now = Date.now();

        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const age = now - particle.createdAt;

            if (age > particle.lifetime) {
                this.particles.splice(i, 1);
                continue;
            }

            // Update position based on velocity
            particle.position.x += particle.velocity.x * deltaTime * 0.001;
            particle.position.y += particle.velocity.y * deltaTime * 0.001;
            particle.position.z += particle.velocity.z * deltaTime * 0.001;

            // Fade out at end of life
            const lifeRatio = age / particle.lifetime;
            particle.opacity = Math.max(0, 1 - lifeRatio);

            // Apply gravity
            particle.velocity.y -= 0.1 * deltaTime * 0.001;
        }
    }

    /**
     * Get particle data
     */
    getParticleData() {
        return this.particles.map((p) => ({
            ...p,
            color: this.config.particleColor,
            glow: p.opacity * this.config.glowIntensity,
        }));
    }

    /**
     * Set emission rate
     */
    setEmissionRate(rate) {
        this.config.emissionRate = Math.max(0, Math.min(500, rate));
    }

    /**
     * Set particle lifetime
     */
    setParticleLifetime(lifetime) {
        this.config.lifetime = Math.max(500, Math.min(10000, lifetime));
    }

    /**
     * Set particle color
     */
    setParticleColor(r, g, b) {
        this.config.particleColor = [r, g, b];
    }

    /**
     * Set glow intensity
     */
    setGlowIntensity(intensity) {
        this.config.glowIntensity = Math.max(0, Math.min(2, intensity));
    }
}

module.exports = ParticleEffects;
