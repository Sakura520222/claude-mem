# 项目概述：Sakura520222/claude-mem

## 项目简介
`claude-mem` 是一个为 [Claude Code](https://claude.com/claude-code) 设计的**持久化内存压缩系统**，旨在优化和管理 AI 编程助手在长会话中的上下文信息。

## 技术栈
*   **核心语言**：JavaScript 与 TypeScript（两者代码量相当，构成项目主体）。
*   **运行时环境**：Node.js（`>=20.0.0`）。
*   **包管理与工具**：可能使用 `npm`/`bun`（存在 `bunfig.toml`, `.npmrc` 等配置文件）。
*   **容器化与部署**：Docker（存在 `Dockerfile`, `docker-compose.yml` 用于测试与生产环境）。
*   **IDE 集成与插件**：针对 Claude Code、Cursor IDE、Windsurf 等多款 AI 编程工具提供插件支持（见 `.claude-plugin/`, `.codex-plugin/`, `cursor-hooks/`, `.windsurf/` 目录）。
*   **自动化**：GitHub Actions（见 `.github/workflows/`）。
*   **文档与国际化**：Markdown，支持超过 20 种语言（见 `docs/i18n/`）。

## 项目结构
*   **核心功能**：
    *   `.claude/`, `.agent/`, `.agents/`：包含 Claude Code 相关的命令、设置、规则与子代理配置。
    *   `docs/`：包含详细的项目架构、API、适配器等设计文档。
    *   `docker/`, `docker-compose*.yml`：提供用于端到端测试和核心服务的容器化环境。
*   **多平台插件系统**：
    *   `.claude-plugin/`：为 Claude Code 市场准备的插件配置。
    *   `.codex-plugin/`：为其他 Codex 类平台准备的插件。
    *   `cursor-hooks/`：专门为 Cursor IDE 提供的钩子和集成方案。
*   **开发与规划**：
    *   `.plan/`：包含具体的技术设计或任务方案。
    *   `.github/`：包含 Issue 模板、CI/CD 工作流。
    *   `fixtures/`：存放测试用例的示例数据。
*   **配置与元数据**：
    *   `CLAUDE.md`, `WARP.md`：可能是给 AI 助手（如 Claude, Warp）的指令文件。
    *   `CHANGELOG.md`, `README.md`, `LICENSE`：标准的项目文档与开源协议（Apache 2.0）。

## 开发约定
1.  **国际化**：项目文档（特别是 README）支持多语言翻译，体现了对全球化贡献者的友好。
2.  **严格的代码与仓库管理**：使用 `.gitignore`, `.npmignore`, `.npmrc`, `.gitattributes` 等文件规范代码提交和发布流程。
3.  **插件化架构**：项目为不同的 AI 编程工具设计了独立的插件目录和配置，表明其核心是一个可扩展的框架，而非单一工具。
4.  **重视测试与文档**：拥有完整的 `docker` 测试环境、`fixtures` 测试数据以及详尽的 `docs` 架构说明，体现了专业的软件工程实践。
5.  **AI 协同开发**：通过 `CLAUDE.md`, `WARP.md` 等文件以及专门的 `.agent` 目录配置，深度集成了与 AI 编程助手的协同工作流。