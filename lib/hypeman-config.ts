import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "fs"
import { join, dirname } from "path"
import { homedir } from "os"
import { parse } from "jsonc-parser"
import type { PluginInput } from "@opencode-ai/plugin"

export interface HypemanConfig {
    enabled: boolean
    debug: boolean
    intensityLevel: "low" | "medium" | "high"
    preserveCodeBlocks: boolean
    preserveFilePaths: boolean
    preserveCommands: boolean
}

const defaultConfig: HypemanConfig = {
    enabled: true,
    debug: false,
    intensityLevel: "medium",
    preserveCodeBlocks: true,
    preserveFilePaths: true,
    preserveCommands: true,
}

const GLOBAL_CONFIG_DIR = join(homedir(), ".config", "opencode")
const GLOBAL_CONFIG_PATH_JSONC = join(GLOBAL_CONFIG_DIR, "hypeman.jsonc")
const GLOBAL_CONFIG_PATH_JSON = join(GLOBAL_CONFIG_DIR, "hypeman.json")

function findOpencodeDir(startDir: string): string | null {
    let current = startDir
    while (current !== "/") {
        const candidate = join(current, ".opencode")
        if (existsSync(candidate) && statSync(candidate).isDirectory()) {
            return candidate
        }
        const parent = dirname(current)
        if (parent === current) break
        current = parent
    }
    return null
}

function getConfigPaths(ctx?: PluginInput): {
    global: string | null
    project: string | null
} {
    let globalPath: string | null = null
    if (existsSync(GLOBAL_CONFIG_PATH_JSONC)) {
        globalPath = GLOBAL_CONFIG_PATH_JSONC
    } else if (existsSync(GLOBAL_CONFIG_PATH_JSON)) {
        globalPath = GLOBAL_CONFIG_PATH_JSON
    }

    let projectPath: string | null = null
    if (ctx?.directory) {
        const opencodeDir = findOpencodeDir(ctx.directory)
        if (opencodeDir) {
            const projectJsonc = join(opencodeDir, "hypeman.jsonc")
            const projectJson = join(opencodeDir, "hypeman.json")
            if (existsSync(projectJsonc)) {
                projectPath = projectJsonc
            } else if (existsSync(projectJson)) {
                projectPath = projectJson
            }
        }
    }

    return { global: globalPath, project: projectPath }
}

function createDefaultConfig(): void {
    if (!existsSync(GLOBAL_CONFIG_DIR)) {
        mkdirSync(GLOBAL_CONFIG_DIR, { recursive: true })
    }

    const configContent = `{
  "$schema": "https://raw.githubusercontent.com/primeinc/opencode-hypeman/master/hypeman.schema.json",
  // Enable or disable the plugin
  "enabled": true,
  // Enable debug logging to ~/.config/opencode/logs/hypeman/
  "debug": false,
  // Intensity level of the hype transformation: "low", "medium", or "high"
  "intensityLevel": "medium",
  // Preserve code blocks during transformation
  "preserveCodeBlocks": true,
  // Preserve file paths during transformation
  "preserveFilePaths": true,
  // Preserve command-line commands during transformation
  "preserveCommands": true
}
`
    writeFileSync(GLOBAL_CONFIG_PATH_JSONC, configContent, "utf-8")
}

function loadConfigFile(configPath: string): Record<string, any> | null {
    try {
        const fileContent = readFileSync(configPath, "utf-8")
        const parsed = parse(fileContent)
        return parsed || null
    } catch {
        return null
    }
}

export function getConfig(ctx: PluginInput): HypemanConfig {
    let config = { ...defaultConfig }
    const configPaths = getConfigPaths(ctx)

    // Load and merge global config
    if (configPaths.global) {
        const data = loadConfigFile(configPaths.global)
        if (data) {
            config = {
                enabled: data.enabled ?? config.enabled,
                debug: data.debug ?? config.debug,
                intensityLevel: data.intensityLevel ?? config.intensityLevel,
                preserveCodeBlocks: data.preserveCodeBlocks ?? config.preserveCodeBlocks,
                preserveFilePaths: data.preserveFilePaths ?? config.preserveFilePaths,
                preserveCommands: data.preserveCommands ?? config.preserveCommands,
            }
        }
    } else {
        createDefaultConfig()
    }

    // Load and merge project config (overrides global)
    if (configPaths.project) {
        const data = loadConfigFile(configPaths.project)
        if (data) {
            config = {
                enabled: data.enabled ?? config.enabled,
                debug: data.debug ?? config.debug,
                intensityLevel: data.intensityLevel ?? config.intensityLevel,
                preserveCodeBlocks: data.preserveCodeBlocks ?? config.preserveCodeBlocks,
                preserveFilePaths: data.preserveFilePaths ?? config.preserveFilePaths,
                preserveCommands: data.preserveCommands ?? config.preserveCommands,
            }
        }
    }

    return config
}
