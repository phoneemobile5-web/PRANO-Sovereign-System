# 🚀 PRANO Engine | محرك برانو الأساسي

> **النواة المنطقية السيادية لمعمارية P-R-A-N-O**
> 
> "المنطق البرمجي هو انعكاس لقوة الإرادة الهندسية" — عبد الظاهر النجار

---

## 📋 جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [البنية المعمارية](#البنية-المعمارية)
- [المكونات الأساسية](#المكونات-الأساسية)
- [البدء السريع](#البدء-السريع)
- [الاستخدام المتقدم](#الاستخدام-المتقدم)
- [واجهة برمجية (API)](#واجهة-برمجية)

---

## نظرة عامة

**PRANO Engine** هو محرك معالجة يعتمد على نموذج **P-R-A-N-O** الفلسفي والتقني:

| الحرف | المعنى | الدور | الوصف |
|-------|--------|-------|-------|
| **P** | **Source** (المصدر) | البداية | الأصل الأزلي الذي يحدد البيانات والإمكانية |
| **R** | **Verification** (التحقق) | الحارس | بوابة تحقق شاملة تضمن النزاهة والأمان (100%) |
| **A** | **Tools** (الأدوات) | التنفيذ | وحدات معالجة مخولة تعمل تحت إشراف بوابة التحقق |
| **N** | **Nodes** (العقد) | المسارات | خمس نقاط تنفيذية (N1→N2→N3→N4→N5) |
| **O** | **Outcome** (النتيجة) | الملموس | النتائج المقاسة والقابلة للتحقق (SSR = 1) |

---

## البنية المعمارية

### المعمارية العامة

```
┌─────────────────────────────────────────────────────┐
│         PRANO Orchestrator (الواجهة الموحدة)        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Core     │  │Flows     │  │ Tools    │         │
│  │ Engine   │  │ Manager  │  │ Manager  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │Verifi.   │  │ State    │  │ Logging  │         │
│  │ Manager  │  │ Manager  │  │ Manager  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│        ↓                              ↓            │
├─────────────────────────────────────────────────────┤
│   Five Execution Nodes (N1 → N2 → N3 → N4 → N5)   │
├─────────────────────────────────────────────────────┤
│   Sovereign Status Resolver: SSR = 1               │
└─────────────────────────────────────────────────────┘
```

### نقاط التنفيذ الخمس

```
N1_Initiator
    ↓
[بدء السياق وتحضير البيانات]
    ↓
N2_VerificationGate
    ↓
[التحقق من الأمان والسياسات والنزاهة]
    ↓
N3_Processing
    ↓
[تنفيذ المنطق والأدوات]
    ↓
N4_Output
    ↓
[تجهيز وتنسيق النتائج]
    ↓
N5_Terminator
    ↓
[الإنهاء النظيف والتنظيف]
```

---

## المكونات الأساسية

### 1. 🔧 Core Engine (`core/engine.ts`)

محرك العمليات الأساسي الذي يدير دورة حياة التنفيذ الكاملة.

**الميزات الرئيسية:**
- إدارة السياقات (ExecutionContext)
- تنفيذ المسارات (Flows)
- معادلة الاستقرار (SSR = 1)
- إدارة الأخطاء والاستثناءات

### 2. 🛠️ Tools Manager (`tools/manager.ts`)

إدارة الأدوات المخصصة والوحدات القابلة للتوسع.

**الأدوات النموذجية:**
- `TextProcessingTool` - معالجة النصوص
- `SecurityValidationTool` - التحقق الأمني
- `DataTransformationTool` - تحويل البيانات

### 3. ✅ Verification Manager (`verification/manager.ts`)

نظام التحقق الشامل وبوابة الأمان.

**قواعد التحقق:**
- `HashVerificationRule` - التحقق من البصمات
- `SignatureVerificationRule` - التوقيعات الرقمية
- `SchemaComplianceRule` - الامتثال للنموذج
- `SecurityLevelRule` - مستويات الأمان
- `TimestampVerificationRule` - صحة الوقت

### 4. 💾 State Manager (`state/manager.ts`)

إدارة الحالة والجلسات والذاكرة المشتركة.

**الخدمات:**
- إنشاء وإدارة الجلسات
- حفظ واسترجاع السياقات
- الذاكرة المشتركة بين العمليات
- لقطات السياق (Snapshots)

### 5. 📝 Logging Manager (`logging/manager.ts`)

نظام التسجيل والمراقبة الشامل.

**الميزات:**
- تسجيل متعدد المستويات
- مراقب الأداء
- تصدير إلى JSON/CSV
- المستمعون المخصصون (Listeners)

### 6. 🔀 Flows Manager (`flows/manager.ts`)

إدارة المسارات المختلفة للتنفيذ.

**المسارات النموذجية:**
- `InferenceFlow` - مسار الاستدلال
- `DataProcessingFlow` - معالجة البيانات
- `SecurityVerificationFlow` - التحقق الأمني
- `CustomFlowBuilder` - بناء مسارات مخصصة

---

## البدء السريع

### التثبيت

```bash
# المحرك موجود في src/engine/
# لا يحتاج إلى تثبيت إضافي، فقط استيراد المكونات
```

### الاستخدام الأساسي

```typescript
import { PRANOOrchestrator, SessionConfig } from '@/engine';

// 1. إنشاء إعدادات الجلسة
const sessionConfig: SessionConfig = {
  id: 'session_001',
  userId: 'user_123',
  securityLevel: 'medium',
  enableLogging: true,
  enableVerification: true,
  timeout: 30000,
  maxRetries: 3,
};

// 2. إنشاء المنسق
const orchestrator = new PRANOOrchestrator(sessionConfig);

// 3. تنفيذ مسار
const result = await orchestrator.execute('flow_inference', {
  text: 'بيانات المدخلات',
  timestamp: Date.now(),
});

// 4. معالجة النتائج
if (result.success) {
  console.log('نجح التنفيذ:', result.data);
} else {
  console.error('فشل التنفيذ:', result.errors);
}
```

---

## الاستخدام المتقدم

### إنشاء أداة مخصصة

```typescript
import { PRANOTool, SecurityLevel } from '@/engine';

const myCustomTool: PRANOTool = {
  id: 'tool_my_custom',
  name: 'My Custom Tool',
  description: 'أداة مخصصة',
  version: '1.0.0',
  enabled: true,
  requiredSecurityLevel: 'high',
  
  validate: (input) => {
    return input.value !== undefined;
  },
  
  execute: async (input) => {
    // المنطق المخصص
    return {
      result: input.value,
      processed: true,
    };
  },
};

orchestrator.getToolsManager().registerTool(myCustomTool);
```

### بناء مسار مخصص

```typescript
import { CustomFlowBuilder } from '@/engine';

const myFlow = new CustomFlowBuilder()
  .withId('flow_custom')
  .withName('My Custom Flow')
  .withDescription('مسار مخصص')
  .addNode('N1_Initiator')
  .addNode('N2_VerificationGate')
  .addNode('N3_Processing')
  .addNode('N4_Output')
  .addNode('N5_Terminator')
  .addTool('tool_my_custom')
  .enable()
  .build();

orchestrator.getFlowsManager().registerFlow(myFlow);
```

### إضافة سياسة تحقق مخصصة

```typescript
import { CustomVerificationRule } from '@/engine';

const myRule = new CustomVerificationRule(
  'rule_my_check',
  'قاعدة تحقق مخصصة',
  async (context) => {
    // المنطق المخصص
    return context.sourceData.isValid === true;
  }
);

orchestrator.getVerificationManager().registerRule(myRule);
```

### مراقبة الأداء

```typescript
// إضافة مستمع للسجلات
orchestrator.getLogManager().addListener((entry) => {
  console.log(`[${entry.level}] ${entry.message}`);
});

// قياس الأداء
const monitor = orchestrator.getPerformanceMonitor();
monitor.recordMetric('custom_metric', 42);
const stats = monitor.getMetricStats('custom_metric');
console.log('إحصائيات:', stats);

// إحصائيات النظام
console.log(orchestrator.getStatistics());
```

---

## واجهة برمجية (API)

### PRANOOrchestrator

الواجهة الرئيسية الموحدة.

```typescript
// التنفيذ
execute(flowId: string, input: Record<string, unknown>): Promise<PRANOResponse>

// الحصول على المديرين
getToolsManager(): ToolsManager
getVerificationManager(): VerificationManager
getStateManager(): StateManager
getLogManager(): LogManager
getFlowsManager(): FlowsManager
getPerformanceMonitor(): PerformanceMonitor

// الإحصائيات
getStatistics(): Object
```

### Types (الأنواع)

```typescript
ExecutionNode      // نقاط التنفيذ الخمس
ExecutionStatus    // حالات التنفيذ
ExecutionContext   // سياق التنفيذ
PRANOResponse      // استجابة التنفيذ
SessionConfig      // إعدادات الجلسة
SecurityLevel      // مستويات الأمان
```

---

## 📊 الهيكل الملفي

```
src/engine/
├── index.ts                    # نقطة الدخول الرئيسية
├── types.ts                    # تعريفات الأنواع
├── examples.ts                 # أمثلة الاستخدام
├── README.md                   # هذا الملف
│
├── core/
│   └── engine.ts              # محرك العمليات الأساسي
│
├── tools/
│   └── manager.ts             # إدارة الأدوات
│
├── verification/
│   └── manager.ts             # إدارة التحقق
│
├── state/
│   └── manager.ts             # إدارة الحالة
│
├── logging/
│   └── manager.ts             # إدارة التسجيل
│
└── flows/
    └── manager.ts             # إدارة المسارات
```

---

## 🔐 معادلة الاستقرار (SSR = 1)

محرك برانو يعمل وفق معادلة الاستقرار السيادي:

$$SSR = 1$$

هذا يعني:
- ✅ النظام في أعلى مستويات الاستقرار
- ✅ النزاهة مضمونة 100%
- ✅ السيادة المطلقة للملاح
- ✅ التحقق الشامل من جميع المدخلات والمخرجات

---

## 🚀 التطوير المستقبلي

### المخطط القادم

- [ ] دمج Gemkit للذكاء الاصطناعي المتقدم
- [ ] نظام Blockchain للتوقيعات
- [ ] بروتوكول MCP الكامل
- [ ] واجهة مستخدم لإدارة المحرك
- [ ] API REST للوصول البعيد
- [ ] لوحة تحكم المراقبة
- [ ] نسخ احتياطية وتعافي الأخطاء

---

## 📞 الدعم والمساهمة

للأسئلة أو المساهمات، توصل عبر:

- **المعماري:** عبد الظاهر النجار
- **الفلسفة:** The Sovereign System Framework v5.0 ROYAL
- **الترخيص:** GPL-3.0

---

## 📜 الترخيص

```
PRANO Engine v1.0.0
GPL-3.0 License - لحماية السيادة البرمجية
© 2026 PRANO Sovereign System
```

---

**"السيادي لا ينتظر ليكون غنياً، بل يمارس السلام السيادي والعطاء بلا تكلف أثناء انتظاره، فيتحول الصبر إلى فتح حتمي."**
