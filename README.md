# Spring Converter

## 简介 | Introduction

Spring Converter 是一个 Figma 插件，用于在不同平台之间转换弹簧动画参数。它允许设计师和开发者轻松地将弹簧动画参数从一种格式转换为另一种格式，确保在不同平台上实现一致的动画效果。

Spring Converter is a Figma plugin for converting spring animation parameters between different platforms. It allows designers and developers to easily translate spring animation parameters from one format to another, ensuring consistent animation effects across different platforms.

## 功能特点 | Features

- 通过设置 Duration 和 Bounce 参数生成弹簧动画参数
- 实时预览动画效果
- 支持多平台代码生成：
  - TUXMotionCurve (iOS & Android)
  - iOS 原生
  - Android 原生
  - Framer Motion (Web)
- 曲线降级预览功能，可查看贝塞尔曲线替代效果

---

- Generate spring animation parameters by setting Duration and Bounce values
- Real-time animation preview
- Support for multi-platform code generation:
  - TUXMotionCurve (iOS & Android)
  - iOS native
  - Android native
  - Framer Motion (Web)
- Fallback curve preview feature to compare with cubic-bezier alternative

## 使用方法 | How to Use

1. 在 Figma 中安装并启动 Spring Converter 插件
2. 设置所需的 Duration (持续时间) 和 Bounce (弹性) 参数
3. 点击 "Convert" 按钮生成对应的弹簧参数
4. 切换到 "Code" 标签查看各平台的代码实现
5. 使用曲线降级预览功能，可以比较弹簧动画与贝塞尔曲线动画的差异

---

1. Install and launch the Spring Converter plugin in Figma
2. Set the desired Duration and Bounce parameters
3. Click the "Convert" button to generate corresponding spring parameters
4. Switch to the "Code" tab to view code implementations for different platforms
5. Use the fallback curve preview feature to compare spring animations with cubic-bezier animations

## 开发说明 | Development

### 安装依赖 | Install Dependencies

```bash
npm install
 ```
```

### 开发模式 | Development Mode
```bash
npm run dev
 ```

### 构建插件 | Build Plugin
```bash
npm run build
 ```

## 技术栈 | Tech Stack
- Figma Plugin API
- React/Preact
- Framer Motion
- @create-figma-plugin/ui
## 贡献指南 | Contribution Guidelines
欢迎提交 Pull Request 或创建 Issue 来帮助改进这个插件。

We welcome Pull Requests or Issues to help improve this plugin.

## 许可证 | License
MIT License