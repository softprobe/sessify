## 目标
- 安装依赖并执行 TypeScript 编译，生成 `dist/` 产物（JS 与类型声明）。

## 编译前检查
- 读取 `package.json`，确认 `scripts.build` 为 `tsc`，入口 `main: dist/index.js`、`types: dist/index.d.ts`。
- 使用本机 Node 版本（参考 `.nvmrc` 如存在），若无则直接使用当前环境。
- 安装依赖：优先 `npm ci`（存在 `package-lock.json`），否则 `npm install`。

## 执行编译
- 运行 `npm run build`（使用 `tsconfig.json` 的 `outDir: dist`）。

## 结果验证
- 检查是否生成：`dist/index.js`、`dist/index.d.ts` 及相关文件。
- 确认没有 TypeScript 错误或缺失的模块引用。
- 验证包入口与产物一致（`package.json` 的 `main`/`types` 指向存在的文件）。

## 常见问题处理
- 若出现 DOM 类型缺失或 TS 配置警告，必要时在 `tsconfig.json` 增补 `lib: ["ES6", "DOM"]`（仅在编译失败时调整）。
- 若包名变更影响文档导入示例，不影响编译；如需，我可在编译后同步更新示例。

## 可选后续
- 运行 `npm run test` 验证单测（若有）。
- 输出简要报告：依赖安装/编译日志摘要与产物清单。