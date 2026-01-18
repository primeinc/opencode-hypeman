import type { Plugin } from "@opencode-ai/plugin"
import { getConfig } from "./lib/hypeman-config"
import { HypemanLogger } from "./lib/hypeman-logger"
import { HypemanTransformer } from "./lib/hypeman-transformer"
import { createMessageTransformHandler } from "./lib/hypeman-hooks"

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
        // Use experimental hook like DCP does for message transformation
        "experimental.chat.messages.transform": createMessageTransformHandler(
            config,
            logger,
            transformer,
        ),
    } as any // Experimental hooks not yet in official types
}) as Plugin

export default plugin
