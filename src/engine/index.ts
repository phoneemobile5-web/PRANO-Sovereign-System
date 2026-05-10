/**
 * @fileOverview نقطة الدخول الرئيسية لمحرك برانو
 * تصدير جميع المكونات والأدوات الرئيسية
 */

// Types
export type {
  ExecutionNode,
  ExecutionStatus,
  SecurityLevel,
  PRANOError,
  ExecutionContext,
  PRANOTool,
  VerificationPolicy,
  VerificationRule,
  PRANOFlow,
  PRANOResponse,
  SessionConfig,
  ExecutionLog,
  NodeExecutionLog,
} from './types';

// Core Engine
export { PRANOEngine } from './core/engine';

// Tools
export { ToolsManager, TextProcessingTool, SecurityValidationTool, DataTransformationTool } from './tools/manager';

// Verification
export {
  VerificationManager,
  HashVerificationRule,
  SignatureVerificationRule,
  SchemaComplianceRule,
  CustomVerificationRule,
  SecurityLevelRule,
  TimestampVerificationRule,
} from './verification/manager';

// State Management
export { StateManager, SharedMemory, ContextSnapshot } from './state/manager';

// Logging & Monitoring
export { LogManager, LogLevel, PerformanceMonitor, type LogEntry } from './logging/manager';

// Flows
export {
  FlowsManager,
  InferenceFlow,
  DataProcessingFlow,
  SecurityVerificationFlow,
  CustomFlowBuilder,
} from './flows/manager';

import type { SessionConfig } from './types';
import { PRANOEngine } from './core/engine';
import { ToolsManager, TextProcessingTool, SecurityValidationTool, DataTransformationTool } from './tools/manager';
import { VerificationManager, HashVerificationRule, SignatureVerificationRule, SecurityLevelRule, TimestampVerificationRule } from './verification/manager';
import { StateManager } from './state/manager';
import { LogManager } from './logging/manager';
import { FlowsManager, InferenceFlow, DataProcessingFlow, SecurityVerificationFlow } from './flows/manager';
import { PerformanceMonitor } from './logging/manager';

/**
 * فئة التوازن - الواجهة الرئيسية الموحدة لاستخدام PRANO Engine
 */
export class PRANOOrchestrator {
  private engine!: PRANOEngine;
  private toolsManager!: ToolsManager;
  private verificationManager!: VerificationManager;
  private stateManager!: StateManager;
  private logManager!: LogManager;
  private flowsManager!: FlowsManager;
  private performanceMonitor!: PerformanceMonitor;

  constructor(config: SessionConfig) {
    this.engine = new PRANOEngine(config);
    this.toolsManager = new ToolsManager();
    this.verificationManager = new VerificationManager();
    this.stateManager = new StateManager();
    this.logManager = new LogManager();
    this.flowsManager = new FlowsManager();
    this.performanceMonitor = new PerformanceMonitor();

    // إعداد الأدوات الافتراضية
    this.setupDefaultTools();

    // إعداد السياسات الافتراضية
    this.setupDefaultPolicies();

    // إعداد المسارات الافتراضية
    this.setupDefaultFlows();
  }

  /**
   * إعداد الأدوات الافتراضية
   */
  private setupDefaultTools(): void {
    this.toolsManager.registerTool(new TextProcessingTool());
    this.toolsManager.registerTool(new SecurityValidationTool());
    this.toolsManager.registerTool(new DataTransformationTool());
  }

  /**
   * إعداد السياسات الافتراضية
   */
  private setupDefaultPolicies(): void {
    this.verificationManager.registerRule(new HashVerificationRule());
    this.verificationManager.registerRule(new SignatureVerificationRule());
    this.verificationManager.registerRule(new SecurityLevelRule());
    this.verificationManager.registerRule(new TimestampVerificationRule());
  }

  /**
   * إعداد المسارات الافتراضية
   */
  private setupDefaultFlows(): void {
    this.flowsManager.registerFlow(new InferenceFlow());
    this.flowsManager.registerFlow(new DataProcessingFlow());
    this.flowsManager.registerFlow(new SecurityVerificationFlow());
  }

  /**
   * تنفيذ مسار
   */
  async execute(flowId: string, input: Record<string, unknown>) {
    const startTime = Date.now();
    const result = await this.engine.executeFlow(flowId, input);
    this.performanceMonitor.recordMetric(`flow_${flowId}`, Date.now() - startTime);
    return result;
  }

  /**
   * الحصول على مدير الأدوات
   */
  getToolsManager(): ToolsManager {
    return this.toolsManager;
  }

  /**
   * الحصول على مدير التحقق
   */
  getVerificationManager(): VerificationManager {
    return this.verificationManager;
  }

  /**
   * الحصول على مدير الحالة
   */
  getStateManager(): StateManager {
    return this.stateManager;
  }

  /**
   * الحصول على مدير التسجيل
   */
  getLogManager(): LogManager {
    return this.logManager;
  }

  /**
   * الحصول على مدير المسارات
   */
  getFlowsManager(): FlowsManager {
    return this.flowsManager;
  }

  /**
   * الحصول على مراقب الأداء
   */
  getPerformanceMonitor(): PerformanceMonitor {
    return this.performanceMonitor;
  }

  /**
   * إحصائيات النظام
   */
  getStatistics() {
    return {
      tools: this.toolsManager.listTools().length,
      flows: this.flowsManager.listEnabledFlows().length,
      state: this.stateManager.getStatusStatistics(),
      performance: {
        metrics: this.performanceMonitor.getAllMetrics(),
      },
    };
  }
}
