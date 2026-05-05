# 09_DESIGN_TOKENS

## 1. Colors

```ts
export const colors = {
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primaryLight: '#EFF6FF',
  primaryBorder: '#BFDBFE',

  success: '#16A34A',
  successLight: '#ECFDF5',

  warning: '#F59E0B',
  warningLight: '#FFFBEB',

  danger: '#DC2626',
  dangerLight: '#FEF2F2',

  purple: '#7C3AED',
  purpleLight: '#F5F3FF',

  gray50: '#F8FAFC',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  gray900: '#111827',
  white: '#FFFFFF'
};
```

## 2. 状态颜色

| 状态 | 颜色 |
|---|---|
| 执行中 | primary |
| 已完成 | success |
| 待确认 | warning |
| 冲突 / 异常 | danger |
| 待开始 | gray400 |
| 草稿 | gray600 + warning badge |

## 3. Typography

| Token | Size | Weight | Use |
|---|---:|---:|---|
| `text-page-hero` | 32px | 700 | 首页主标题 |
| `text-page-title` | 24px | 700 | 页面标题 |
| `text-section-title` | 16px | 600 | 区块标题 |
| `text-body` | 14px | 400/500 | 正文 |
| `text-caption` | 12px | 400 | 辅助说明 |
| `text-metric` | 24px-32px | 700 | 指标数字 |

## 4. Layout

```ts
export const layout = {
  topBarHeight: 64,
  leftNavWidth: 240,
  pagePadding: 24,
  cardGap: 16,
  sectionGap: 24,
  cardPadding: 16,
  taskSidebarWidth: 380,
  draftDrawerWidth: 540,
};
```

## 5. Radius

```ts
export const radius = {
  button: 8,
  input: 16,
  card: 12,
  largeCard: 16,
  drawer: 16
};
```

## 6. Shadow

使用轻阴影，不使用厚重阴影。

```css
--shadow-card: 0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 8px rgba(15, 23, 42, 0.04);
--shadow-drawer: -8px 0 24px rgba(15, 23, 42, 0.08);
```

## 7. Component Styling Rules

### Card

```text
background: white
border: 1px solid gray200
border-radius: 12px or 16px
padding: 16px or 24px
```

### Button

Primary：蓝底白字。
Secondary：白底灰边框。
Danger：浅红底红字。
Warning：浅橙底橙字。

### Table

- 表头浅灰背景。
- 行高 44-52px。
- 字段名可用蓝色链接。
- 操作按钮小尺寸。
- 分页放底部右侧。

### Badge

- 小圆角。
- 文字 12px。
- 使用浅底 + 深色文字。

## 8. Interaction Visuals

- 对话更新的草稿卡片高亮 1.5 秒。
- 当前阶段在右侧任务计划中使用蓝色背景。
- 已完成阶段使用绿色 check。
- 风险使用红/橙 icon 与浅色背景。
