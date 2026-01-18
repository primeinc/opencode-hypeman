import { existsSync, mkdirSync, appendFileSync } from "fs"
import { join } from "path"
import { homedir } from "os"

const LOG_DIR = join(homedir(), ".config", "opencode", "logs", "hypeman")

export class HypemanLogger {
    private debug: boolean

    constructor(debug: boolean = false) {
        this.debug = debug
        if (this.debug && !existsSync(LOG_DIR)) {
            mkdirSync(LOG_DIR, { recursive: true })
        }
    }

    log(message: string, data?: any): void {
        if (!this.debug) return

        const timestamp = new Date().toISOString()
        const logMessage = data
            ? `[${timestamp}] ${message}: ${JSON.stringify(data, null, 2)}\n`
            : `[${timestamp}] ${message}\n`

        const logFile = join(LOG_DIR, `hypeman-${new Date().toISOString().split("T")[0]}.log`)
        try {
            appendFileSync(logFile, logMessage)
        } catch (error) {
            // Silent fail - logging is not critical
        }
    }
}
