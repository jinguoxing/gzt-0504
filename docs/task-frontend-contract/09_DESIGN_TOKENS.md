# 09｜Design Tokens

## 1. 色彩

### Primary

```css
--color-primary: #2563EB;
--color-primary-hover: #1D4ED8;
--color-primary-light: #EFF6FF;
--color-primary-border: #BFDBFE;
```

### Status

```css
--color-success: #16A34A;
--color-success-light: #ECFDF5;
--color-warning: #F59E0B;
--color-warning-light: #FFFBEB;
--color-danger: #DC2626;
--color-danger-light: #FEF2F2;
--color-info: #2563EB;
--color-info-light: #EFF6FF;
```

### Neutral

```css
--color-bg-page: #F8FAFC;
--color-bg-card: #FFFFFF;
--color-border: #E5E7EB;
--color-border-strong: #D1D5DB;
--color-text-primary: #111827;
--color-text-secondary: #4B5563;
--color-text-muted: #9CA3AF;
```

---

## 2. 状态映射

| 状态 | 背景 | 文本 | 用途 |
|---|---|---|---|
| 执行中 | `--color-primary-light` | `--color-primary` | 当前任务、当前阶段 |
| 已完成 | `--color-success-light` | `--color-success` | 成功完成 |
| 待确认/待审核 | `--color-warning-light` | `--color-warning` | 需要用户处理 |
| 异常/风险 | `--color-danger-light` | `--color-danger` | 阻塞、失败、风险 |
| 已归档/待开始 | `#F3F4F6` | `#6B7280` | 历史、未开始 |

---

## 3. 字体

```css
--font-family-sans: Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
```

| 类型 | 字号 | 行高 | 字重 |
|---|---:|---:|---:|
| 大标题 | 28px | 36px | 700 |
| 页面标题 | 24px | 32px | 700 |
| 模块标题 | 16px-18px | 24px | 600 |
| 正文 | 14px | 22px | 400/500 |
| 辅助说明 | 12px-13px | 18px | 400 |
| 指标数字 | 24px-32px | 36px | 700 |
| 按钮 | 14px | 20px | 500/600 |

---

## 4. 布局

```css
--topbar-height: 64px;
--leftnav-width: 240px;
--right-panel-width: 360px;
--draft-drawer-width: 540px;
--page-padding: 24px;
--card-padding: 16px;
--card-padding-lg: 24px;
--section-gap: 24px;
--card-gap: 16px;
```

---

## 5. 圆角

```css
--radius-xs: 6px;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
```

使用规则：

| 组件 | 圆角 |
|---|---|
| 小按钮 | 8px |
| 输入框 | 14px - 16px |
| 普通卡片 | 12px |
| 大卡片 | 16px |
| 抽屉 | 左上/左下 16px 或无圆角 |

---

## 6. 阴影

```css
--shadow-card: 0 1px 2px rgba(15, 23, 42, 0.04);
--shadow-popover: 0 8px 24px rgba(15, 23, 42, 0.08);
```

要求：

- 卡片默认轻阴影或无阴影。
- 不要使用厚重投影。

---

## 7. 尺寸

| 组件 | 高度 |
|---|---:|
| 顶部栏 | 64px |
| 主按钮 | 40px - 44px |
| 次按钮 | 36px - 40px |
| 输入框 | 40px / 大输入框自适应 |
| 表格行 | 48px - 56px |
| Badge | 24px |
| 指标卡 | 96px - 120px |

---

## 8. 表格样式

```css
--table-header-bg: #F9FAFB;
--table-row-hover: #F8FAFC;
--table-row-selected: #EFF6FF;
```

表格规则：

- 表头浅灰背景。
- 行高 48-56px。
- 任务名称/字段名使用蓝色链接。
- 进度用细进度条。
- 操作按钮保持小尺寸。

---

## 9. 图标规则

- 使用线性图标。
- 默认图标颜色使用 `#64748B`。
- 当前选中/主操作使用蓝色。
- 状态图标可以使用对应状态色，但面积小。
- 文件图标允许按文件类型轻度着色，但不要影响状态判断。
