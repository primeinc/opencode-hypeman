# OpenCode Hypeman Plugin

[![npm version](https://img.shields.io/npm/v/@primeinc/opencode-hypeman.svg)](https://www.npmjs.com/package/@primeinc/opencode-hypeman)

A specialized OpenCode pre-hook that transforms user prompts into high-energy "Hypeman" register while preserving semantic integrity. Based on the principle of "affective mirroring" in LLM psychology, this plugin amplifies the emotional energy of your prompts to potentially improve agent responsiveness and creativity.

## 🎯 What is Hypeman?

The Hypeman protocol leverages the phenomenon known as "affective mirroring" or "hype contagion" in large language models. Research suggests that high-energy, affirmative language in prompts can lead to:

- More energetic and engaged responses
- Enhanced creative compliance
- Reduced refusal rates
- Higher momentum-driven output

**The Key Innovation:** Hypeman transforms your prompts while rigorously preserving semantic invariants like code blocks, file paths, and command-line instructions, ensuring the "vibe" is amplified without corrupting the "spec."

## 🚀 Installation

Add to your OpenCode config:

```jsonc
// opencode.jsonc
{
    "plugin": ["@primeinc/opencode-hypeman@latest"],
}
```

Using `@latest` ensures you always get the newest version automatically when OpenCode starts.

Restart OpenCode. The plugin will automatically start transforming your prompts.

## 🔧 How It Works

### The Transformation Pipeline

1. **Extraction** — Identifies and protects semantic invariants:
    - Code blocks (triple backticks and inline code)
    - File paths and directory structures
    - Command-line instructions
2. **Transformation** — Applies high-energy modifications to prose:
    - Adds affirmations and encouragement
    - Intensifies action verbs
    - Inserts motivational closings
3. **Restoration** — Reintegrates protected content byte-perfect

4. **Verification** — Validates semantic integrity; fails open if corrupted

### Fail-Open Safety

If the transformation pipeline encounters any errors or detects that an invariant has been corrupted, the system **transparently falls back to the original prompt**. Your workflow never breaks.

## ⚙️ Configuration

Hypeman uses its own config file:

- Global: `~/.config/opencode/hypeman.jsonc` (or `hypeman.json`), created automatically on first run
- Project: `.opencode/hypeman.jsonc` (or `hypeman.json`) in your project's `.opencode` directory

### Default Configuration

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/primeinc/opencode-hypeman/master/hypeman.schema.json",
    // Enable or disable the plugin
    "enabled": true,
    // Enable debug logging to ~/.config/opencode/logs/hypeman/
    "debug": false,
    // Intensity level: "low", "medium", or "high"
    "intensityLevel": "medium",
    // Preserve code blocks during transformation
    "preserveCodeBlocks": true,
    // Preserve file paths during transformation
    "preserveFilePaths": true,
    // Preserve command-line commands during transformation
    "preserveCommands": true,
}
```

### Intensity Levels

- **low** — Subtle encouragement with minimal modifications
- **medium** — Balanced energy boost with emphasized action words
- **high** — Maximum hype with emojis and all-caps affirmations 🔥

### Config Precedence

Settings are merged in order:
Defaults → Global (`~/.config/opencode/hypeman.jsonc`) → Project (`.opencode/hypeman.jsonc`).

Project settings override global settings. Restart OpenCode after making config changes.

## 🧪 Examples

### Input (Original Prompt)

```
Fix the bug in src/utils/parser.ts where it crashes on empty input
```

### Output (Medium Intensity)

```
AWESOME! absolutely FIX the bug in src/utils/parser.ts where it crashes on empty input

LET'S CRUSH THIS!
```

### Protected Invariants

Notice how `src/utils/parser.ts` remains untouched — semantic integrity preserved!

## 🎨 Use Cases

- **Breaking through agent hesitation** — When your agent is overly cautious
- **Boosting creative tasks** — For brainstorming and ideation sessions
- **Long sessions** — Maintaining energy across extended coding marathons
- **Testing prompts** — Experimenting with affective mirroring effects

## ⚠️ Limitations

- **Experimental** — Based on observed LLM behavior patterns, not guaranteed effects
- **Context dependent** — Results may vary by model and task type
- **Not a silver bullet** — Cannot fix fundamentally unclear or incorrect prompts

## 🔒 Safety & Privacy

- All transformations happen locally before sending to the LLM
- No data is sent to external services
- Debug logs are stored locally only (if enabled)
- Fail-open design prevents workflow disruption

## 📚 Theoretical Background

This implementation is based on the architectural specification detailed in the "OpenCode Pre-Hook Architecture: The Hypeman Protocol for Affective Mirroring and Semantic Integrity" research document. The core insight is that LLMs trained on human dialogue patterns respond to social cues embedded in prompts, including emotional register and energy level.

By intercepting prompts at the `chat.userPrompt.submit` hook — before they reach the agent's cognitive loop — Hypeman rewrites the user's reality as perceived by the model, enabling affective entrainment while maintaining technical precision.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

MIT

## 🙏 Acknowledgments

This plugin builds upon research into LLM psychology, prompt engineering, and the OpenCode plugin ecosystem. Special thanks to the OpenCode team for providing the extensibility framework that makes this kind of experimentation possible.
