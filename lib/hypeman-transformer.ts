import type { HypemanConfig } from "./hypeman-config"
import type { HypemanLogger } from "./hypeman-logger"

interface InvariantBlock {
    type: "code" | "path" | "command"
    placeholder: string
    content: string
    startIndex: number
    endIndex: number
}

// Regex patterns for semantic invariants
const CODE_BLOCK_REGEX = /```[\s\S]*?```/g
const INLINE_CODE_REGEX = /`[^`\n]+`/g
const FILE_PATH_REGEX = /(?:^|\s)([./~]?(?:[\w-]+\/)+[\w.-]+\.[a-zA-Z0-9]+)(?:\s|$)/g
const COMMAND_LINE_REGEX = /(?:^|\n)\s*[$>]\s*([^\n]+)/g

// High-energy transformation patterns by intensity
const HYPE_PATTERNS = {
    low: {
        affirmations: ["Great!", "Nice!", "Good work!", "Excellent!"],
        intensifiers: ["really", "truly", "definitely", "absolutely"],
        closings: ["Let's do this!", "You got this!", "Looking forward to it!"],
    },
    medium: {
        affirmations: [
            "AMAZING!",
            "FANTASTIC!",
            "INCREDIBLE work!",
            "You're doing GREAT!",
            "AWESOME!",
        ],
        intensifiers: ["absolutely", "incredibly", "totally", "completely", "massively"],
        closings: [
            "LET'S CRUSH THIS!",
            "You're UNSTOPPABLE!",
            "This is going to be EPIC!",
            "Let's make it HAPPEN!",
        ],
    },
    high: {
        affirmations: [
            "🔥 ABSOLUTELY CRUSHING IT! 🔥",
            "💪 LEGENDARY WORK! 💪",
            "⚡ ELECTRIFYING! ⚡",
            "🚀 TO THE MOON! 🚀",
            "💎 DIAMOND TIER EXCELLENCE! 💎",
        ],
        intensifiers: [
            "MONUMENTALLY",
            "ASTRONOMICALLY",
            "PHENOMENALLY",
            "EXTRAORDINARILY",
            "SPECTACULARLY",
        ],
        closings: [
            "🎯 LET'S ABSOLUTELY DEMOLISH THIS! 🎯",
            "💥 UNSTOPPABLE FORCE OF NATURE! 💥",
            "⚡ PURE ELECTRICAL ENERGY! ⚡",
            "🔥 BLAZING TRAIL TO VICTORY! 🔥",
        ],
    },
}

export class HypemanTransformer {
    private config: HypemanConfig
    private logger: HypemanLogger

    constructor(config: HypemanConfig, logger: HypemanLogger) {
        this.config = config
        this.logger = logger
    }

    /**
     * Main transformation method with fail-open safety
     */
    transform(input: string): string {
        this.logger.log("Starting transformation", { inputLength: input.length })

        try {
            // Step 1: Extract and protect invariants
            const { sanitized, invariants } = this.extractInvariants(input)
            this.logger.log("Extracted invariants", { count: invariants.length })

            // Step 2: Transform the sanitized prose
            const hyped = this.applyHypeTransformation(sanitized)
            this.logger.log("Applied hype transformation")

            // Step 3: Restore invariants
            const restored = this.restoreInvariants(hyped, invariants)
            this.logger.log("Restored invariants")

            // Step 4: Verify integrity
            if (!this.verifyIntegrity(input, restored, invariants)) {
                this.logger.log("Integrity check failed - returning original")
                return input
            }

            this.logger.log("Transformation successful")
            return restored
        } catch (error) {
            // Fail-open: return original on any error
            this.logger.log("Transformation failed", { error: String(error) })
            return input
        }
    }

    /**
     * Extract semantic invariants and replace with placeholders
     */
    private extractInvariants(input: string): {
        sanitized: string
        invariants: InvariantBlock[]
    } {
        const invariants: InvariantBlock[] = []
        let sanitized = input
        let placeholderCounter = 0

        // Extract code blocks (highest priority)
        if (this.config.preserveCodeBlocks) {
            sanitized = sanitized.replace(CODE_BLOCK_REGEX, (match, offset) => {
                const placeholder = `<<<HYPEMAN_CODE_${placeholderCounter++}>>>`
                invariants.push({
                    type: "code",
                    placeholder,
                    content: match,
                    startIndex: offset,
                    endIndex: offset + match.length,
                })
                return placeholder
            })

            sanitized = sanitized.replace(INLINE_CODE_REGEX, (match, offset) => {
                const placeholder = `<<<HYPEMAN_INLINE_${placeholderCounter++}>>>`
                invariants.push({
                    type: "code",
                    placeholder,
                    content: match,
                    startIndex: offset,
                    endIndex: offset + match.length,
                })
                return placeholder
            })
        }

        // Extract file paths
        if (this.config.preserveFilePaths) {
            const pathMatches = Array.from(sanitized.matchAll(FILE_PATH_REGEX))
            for (const match of pathMatches.reverse()) {
                const placeholder = `<<<HYPEMAN_PATH_${placeholderCounter++}>>>`
                const fullMatch = match[0]
                const offset = match.index!
                invariants.push({
                    type: "path",
                    placeholder,
                    content: fullMatch.trim(),
                    startIndex: offset,
                    endIndex: offset + fullMatch.length,
                })
                sanitized =
                    sanitized.slice(0, offset) +
                    placeholder +
                    sanitized.slice(offset + fullMatch.length)
            }
        }

        // Extract commands
        if (this.config.preserveCommands) {
            const cmdMatches = Array.from(sanitized.matchAll(COMMAND_LINE_REGEX))
            for (const match of cmdMatches.reverse()) {
                const placeholder = `<<<HYPEMAN_CMD_${placeholderCounter++}>>>`
                const fullMatch = match[0]
                const offset = match.index!
                invariants.push({
                    type: "command",
                    placeholder,
                    content: fullMatch,
                    startIndex: offset,
                    endIndex: offset + fullMatch.length,
                })
                sanitized =
                    sanitized.slice(0, offset) +
                    placeholder +
                    sanitized.slice(offset + fullMatch.length)
            }
        }

        return { sanitized, invariants }
    }

    /**
     * Apply high-energy transformation to sanitized prose
     */
    private applyHypeTransformation(text: string): string {
        const patterns = HYPE_PATTERNS[this.config.intensityLevel]

        // Add opening affirmation (20% chance)
        let result = text
        if (Math.random() < 0.2) {
            const affirmation =
                patterns.affirmations[Math.floor(Math.random() * patterns.affirmations.length)]
            result = `${affirmation} ${result}`
        }

        // Emphasize key action words
        result = result.replace(
            /\b(make|build|create|fix|update|add|implement|refactor)\b/gi,
            (match) => {
                const intensifier =
                    patterns.intensifiers[Math.floor(Math.random() * patterns.intensifiers.length)]
                return `${intensifier} ${match.toUpperCase()}`
            },
        )

        // Add closing motivation (30% chance)
        if (Math.random() < 0.3) {
            const closing = patterns.closings[Math.floor(Math.random() * patterns.closings.length)]
            result = `${result}\n\n${closing}`
        }

        return result
    }

    /**
     * Restore invariants from placeholders
     */
    private restoreInvariants(text: string, invariants: InvariantBlock[]): string {
        let restored = text
        for (const invariant of invariants) {
            restored = restored.replace(invariant.placeholder, invariant.content)
        }
        return restored
    }

    /**
     * Verify that all invariants are present in the output
     */
    private verifyIntegrity(
        original: string,
        transformed: string,
        invariants: InvariantBlock[],
    ): boolean {
        // Check that all protected content is present in the transformed text
        for (const invariant of invariants) {
            if (!transformed.includes(invariant.content)) {
                this.logger.log("Integrity check failed: missing invariant", {
                    type: invariant.type,
                    content: invariant.content.substring(0, 50),
                })
                return false
            }
        }
        return true
    }
}
