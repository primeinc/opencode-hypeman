import type { HypemanConfig } from "./hypeman-config"
import type { HypemanLogger } from "./hypeman-logger"
import { HypemanTransformer } from "./hypeman-transformer"

// Message structure from OpenCode plugin API
interface MessagePart {
    type: string
    text?: string
    [key: string]: any
}

interface Message {
    role?: string
    parts: MessagePart[]
    [key: string]: any
}

/**
 * Creates a handler for the experimental.chat.messages.transform hook
 * This follows the DCP pattern of operating on message arrays
 */
export function createMessageTransformHandler(
    config: HypemanConfig,
    logger: HypemanLogger,
    transformer: HypemanTransformer,
) {
    return async (_input: {}, output: { messages: Message[] }) => {
        if (!output.messages || !Array.isArray(output.messages)) {
            return
        }

        logger.log("Transform handler called", { messageCount: output.messages.length })

        // Find the last user message (most recent user input)
        for (let i = output.messages.length - 1; i >= 0; i--) {
            const message = output.messages[i]

            // Only transform user role messages
            if (message.role !== "user") {
                continue
            }

            logger.log("Found user message to transform", { index: i })

            // Transform all text parts in the user message
            if (message.parts && Array.isArray(message.parts)) {
                for (const part of message.parts) {
                    if (part.type === "text" && part.text) {
                        const originalText = part.text
                        const transformedText = transformer.transform(originalText)

                        logger.log("Transformed text part", {
                            originalLength: originalText.length,
                            transformedLength: transformedText.length,
                        })

                        part.text = transformedText
                    }
                }
            }

            // Only transform the most recent user message
            break
        }
    }
}
