# 09_DESIGN_TOKENS.md

# 找数问数设计 Tokens v1.0

## 1. 色彩

### 主色

```text
Primary Blue：#2563EB
Primary Blue Hover：#1D4ED8
Primary Blue Light：#EFF6FF
Primary Blue Border：#BFDBFE
```

### 状态色

```text
Success Green：#16A34A
Success Light：#ECFDF5
Warning Orange：#F59E0B
Warning Light：#FFFBEB
Danger Red：#DC2626
Danger Light：#FEF2F2
Info Purple：#7C3AED
Info Light：#F5F3FF
```

### 灰阶

```text
Page Background：#F8FAFC
Card Background：#FFFFFF
Border：#E5E7EB
Border Strong：#CBD5E1
Text Primary：#111827
Text Secondary：#4B5563
Text Muted：#9CA3AF
```

---

## 2. 状态颜色语义

| 状态 | 色彩 |
|---|---|
| 高可信 | 绿色 |
| 增长 / 正向 | 绿色 |
| 下降 / 负向 | 红色 |
| 待确认 | 橙色 |
| 进行中 | 蓝色 |
| 可查询 | 绿色 |
| SQL / 专业信息 | 灰蓝 |

---

## 3. 字体层级

| 类型 | 字号 | 字重 |
|---|---:|---:|
| 页面标题 | 24px | 700 |
| 页面副标题 | 13px | 400 |
| 区块标题 | 15px - 16px | 600 |
| 卡片标题 | 14px - 15px | 600 |
| 正文 | 14px | 400 / 500 |
| 辅助说明 | 12px - 13px | 400 |
| 大数字 | 32px - 40px | 700 |
| 指标数字 | 20px - 24px | 700 |
| 按钮文字 | 13px - 14px | 500 |

---

## 4. 布局尺寸

```text
TopBar Height：64px
LeftNav Width：240px
RightSidebar Width：340px - 380px
Main Padding：24px
Card Padding：16px - 20px
Section Gap：20px - 28px
Card Gap：16px - 20px
```

---

## 5. 圆角

```text
Small Button Radius：8px
Input Radius：14px
Card Radius：12px - 16px
Sidebar Card Radius：12px
```

---

## 6. 阴影

```text
Card Shadow：0 1px 3px rgba(15, 23, 42, 0.06)
Elevated Shadow：0 8px 24px rgba(15, 23, 42, 0.08)
```

阴影必须轻，不要厚重。

---

## 7. 卡片规则

```text
白色背景
浅灰边框
圆角 12px - 16px
标题清楚
内容留白充足
模块间距大于 16px
```

首屏卡片不得过密。

---

## 8. 用户提问条规则

```text
右对齐
无气泡尖角
无明显聊天气泡背景
轻量文本条
宽度不超过主区 50%
```

---

## 9. Xino 输出块规则

```text
左对齐
先显示 Xino 名称 + 时间
再显示普通文本说明
结果卡片另起区域
不要把结果塞进气泡
```

---

## 10. 图表规则

```text
图表简洁
不使用过多颜色
趋势图只用蓝色主线，可加浅灰网格
增长用绿色
下降用红色
图表必须有标题和关键发现
```

---

## 11. 表格规则

```text
表头浅灰背景
行高 40px - 48px
默认只展示 3-5 行
支持查看全部
支持导出
```

明细表不得首屏大面积展开。

---

## 12. 右侧栏规则

```text
标题：答案依据
默认展开：当前口径、数据依据
默认折叠：查询计划 / SQL、追问上下文
卡片间距：16px
信息密度适中
```
