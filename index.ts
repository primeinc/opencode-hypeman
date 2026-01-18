import type { Plugin } from "@opencode-ai/plugin"
import { getConfig } from "./lib/hypeman-config"
import { HypemanLogger } from "./lib/hypeman-logger"
import { HypemanTransformer } from "./lib/hypeman-transformer"

const plugin: Plugin = (async (ctx) => {
    const config = getConfig(ctx)

    if (!config.enabled) {
        return {}
    }

    const logger = new HypemanLogger(config.debug)
    const transformer = new HypemanTransformer(config, logger)

    logger.log("Hypeman initialized", {
        intensityLevel: config.intensityLevel,
        preserveCodeBlocks: config.preserveCodeBlocks,
        preserveFilePaths: config.preserveFilePaths,
        preserveCommands: config.preserveCommands,
    })

    return {
        // Use chat.message hook to intercept user messages
        "chat.message": async (
            input: {
                sessionID: string
                agent?: string
                model?: { providerID: string; modelID: string }
                messageID?: string
            },
            output: any,
        ) => {
            // Only transform user messages
            if (output?.message?.role === "user" && output?.parts) {
                logger.log("Intercepting user message", {
                    sessionID: input.sessionID,
                    partsCount: output.parts.length,
                })

                // Transform each text part
                for (const part of output.parts) {
                    if (part.type === "text" && part.text) {
                        const original = part.text
                        const transformed = transformer.transform(original)
                        part.text = transformed

                        logger.log("Transformed message part", {
                            originalLength: original.length,
                            transformedLength: transformed.length,
                        })
                    }
                }
            }
        },
    } as any // Type assertion needed for experimental hooks
}) satisfies Plugin

export default plugin
