/**
 * @fileOverview أمثلة استخدام محرك برانو
 * أمثلة عملية شاملة لاستخدام جميع ميزات المحرك
 */

import {
  PRANOOrchestrator,
  SessionConfig,
  SecurityLevel,
  CustomVerificationRule,
  CustomFlowBuilder,
} from './index';

/**
 * مثال 1: الاستخدام الأساسي
 */
export async function basicExample() {
  console.log('\n=== مثال 1: الاستخدام الأساسي ===\n');

  // إنشاء جلسة
  const sessionConfig: SessionConfig = {
    id: 'session_basic_001',
    userId: 'user_123',
    securityLevel: 'medium',
    enableLogging: true,
    enableVerification: true,
    timeout: 30000,
    maxRetries: 3,
  };

  // إنشاء المنسق
  const orchestrator = new PRANOOrchestrator(sessionConfig);

  // تنفيذ مسار
  const result = await orchestrator.execute('flow_inference', {
    text: 'مرحباً بك في محرك برانو',
    timestamp: Date.now(),
    securityLevel: 'medium',
  });

  console.log('التنفيذ نجح:', result.success);
  console.log('المعرف:', result.executionId);
  console.log('وقت التنفيذ:', result.executionTime, 'ms');
  console.log('البيانات:', result.data);

  return orchestrator;
}

/**
 * مثال 2: إضافة أدوات مخصصة
 */
export async function customToolsExample(orchestrator: PRANOOrchestrator) {
  console.log('\n=== مثال 2: الأدوات المخصصة ===\n');

  const toolsManager = orchestrator.getToolsManager();

  // إنشاء أداة مخصصة
  const customTool = {
    id: 'tool_custom_analysis',
    name: 'Custom Analysis Tool',
    description: 'أداة تحليل مخصصة',
    version: '1.0.0',
    enabled: true,
    requiredSecurityLevel: 'high' as SecurityLevel,
    validate: (input: Record<string, unknown>) => {
      return input.data !== undefined;
    },
    execute: async (input: Record<string, unknown>) => {
      console.log('تنفيذ الأداة المخصصة...');
      return {
        analyzed: input.data,
        analysisResult: 'تم التحليل بنجاح',
        timestamp: Date.now(),
      };
    },
  };

  // تسجيل الأداة
  toolsManager.registerTool(customTool);
  console.log('تم تسجيل الأداة المخصصة');

  // قائمة الأدوات المتاحة
  const tools = toolsManager.listTools();
  console.log('الأدوات المتاحة:', tools.map((t: any) => t.name));
}

/**
 * مثال 3: سياسات التحقق المخصصة
 */
export async function customVerificationExample(orchestrator: PRANOOrchestrator) {
  console.log('\n=== مثال 3: سياسات التحقق المخصصة ===\n');

  const verificationManager = orchestrator.getVerificationManager();

  // إنشاء قاعدة تحقق مخصصة
  const customRule = new CustomVerificationRule(
    'rule_custom_validation',
    'قاعدة تحقق مخصصة لفحص البيانات',
    async (context) => {
      console.log('تنفيذ قاعدة التحقق المخصصة...');
      // تحقق من أن المصدر يحتوي على حقل معين
      return !!context.sourceData.requiredField;
    }
  );

  verificationManager.registerRule(customRule);
  console.log('تم تسجيل قاعدة التحقق المخصصة');
}

/**
 * مثال 4: إنشاء مسار مخصص
 */
export async function customFlowExample(orchestrator: PRANOOrchestrator) {
  console.log('\n=== مثال 4: المسار المخصص ===\n');

  const flowsManager = orchestrator.getFlowsManager();

  // بناء مسار مخصص باستخدام المنشئ
  const customFlow = new CustomFlowBuilder()
    .withId('flow_custom_analysis')
    .withName('Custom Analysis Flow')
    .withDescription('مسار تحليل مخصص متقدم')
    .addNode('N1_Initiator')
    .addNode('N2_VerificationGate')
    .addNode('N3_Processing')
    .addNode('N4_Output')
    .addNode('N5_Terminator')
    .addTool('tool_custom_analysis')
    .addVerificationPolicy('rule_custom_validation')
    .enable()
    .build();

  flowsManager.registerFlow(customFlow);
  console.log('تم تسجيل المسار المخصص');

  // تنفيذ المسار
  const sessionConfig: SessionConfig = {
    id: 'session_custom_001',
    securityLevel: 'high',
    enableLogging: true,
    enableVerification: true,
    timeout: 30000,
    maxRetries: 3,
  };

  const customOrchestrator = new PRANOOrchestrator(sessionConfig);
  // نسخ المسار المخصص
  customOrchestrator.getFlowsManager().registerFlow(customFlow);

  const result = await customOrchestrator.execute('flow_custom_analysis', {
    data: 'بيانات للتحليل',
    requiredField: true,
  });

  console.log('نتائج التنفيذ المخصص:', {
    success: result.success,
    status: result.status,
  });
}

/**
 * مثال 5: المراقبة والتسجيل
 */
export async function monitoringExample(orchestrator: PRANOOrchestrator) {
  console.log('\n=== مثال 5: المراقبة والتسجيل ===\n');

  const logManager = orchestrator.getLogManager();
  const performanceMonitor = orchestrator.getPerformanceMonitor();

  // إضافة مستمع للسجلات
  logManager.addListener((entry: any) => {
    if (entry.level >= 1) {
      // INFO وما فوق
      console.log(`[${entry.level}] ${entry.message}`);
    }
  });

  // تنفيذ عدة عمليات لقياس الأداء
  for (let i = 0; i < 3; i++) {
    const startTime = Date.now();
    await orchestrator.execute('flow_inference', {
      text: `العملية ${i + 1}`,
    });
    performanceMonitor.recordMetric('execution_time', Date.now() - startTime);
  }

  // إحصائيات الأداء
  const stats = performanceMonitor.getMetricStats('execution_time');
  console.log('\nإحصائيات الأداء:');
  console.log('- المتوسط:', stats?.avg, 'ms');
  console.log('- الحد الأدنى:', stats?.min, 'ms');
  console.log('- الحد الأقصى:', stats?.max, 'ms');

  // تصدير السجلات
  const logsJSON = logManager.exportAsJSON();
  console.log('\nتم تصدير السجلات بصيغة JSON');
}

/**
 * مثال 6: إدارة الحالة والجلسات
 */
export async function stateManagementExample(orchestrator: PRANOOrchestrator) {
  console.log('\n=== مثال 6: إدارة الحالة والجلسات ===\n');

  const stateManager = orchestrator.getStateManager();

  // إنشاء جلسة
  const sessionConfig: SessionConfig = {
    id: 'session_state_001',
    securityLevel: 'high',
    enableLogging: true,
    enableVerification: true,
    timeout: 60000,
    maxRetries: 3,
  };

  const sessionId = stateManager.createSession(sessionConfig);
  console.log('تم إنشاء الجلسة:', sessionId);

  // الحصول على إحصائيات الحالة
  const stats = stateManager.getStatusStatistics();
  console.log('إحصائيات الحالة:');
  console.log('- إجمالي السياقات:', stats.totalContexts);
  console.log('- إجمالي الجلسات:', stats.totalSessions);

  // إنهاء الجلسة
  stateManager.terminateSession(sessionId);
  console.log('تم إنهاء الجلسة');
}

/**
 * مثال 7: تنفيذ شامل
 */
export async function completExample() {
  console.log('\n========== تنفيذ شامل لمحرك برانو ==========\n');

  try {
    // 1. الاستخدام الأساسي
    const orchestrator = await basicExample();

    // 2. الأدوات المخصصة
    await customToolsExample(orchestrator);

    // 3. سياسات التحقق
    await customVerificationExample(orchestrator);

    // 4. المسارات المخصصة
    await customFlowExample(orchestrator);

    // 5. المراقبة والتسجيل
    await monitoringExample(orchestrator);

    // 6. إدارة الحالة
    await stateManagementExample(orchestrator);

    // إحصائيات النظام الشاملة
    console.log('\n=== إحصائيات النظام الشاملة ===\n');
    const systemStats = orchestrator.getStatistics();
    console.log(JSON.stringify(systemStats, null, 2));

    console.log('\n✅ اكتمل التنفيذ الشامل بنجاح!\n');
  } catch (error) {
    console.error('❌ حدث خطأ:', error);
  }
}

// تشغيل الأمثلة
if (require.main === module) {
  completExample();
}
