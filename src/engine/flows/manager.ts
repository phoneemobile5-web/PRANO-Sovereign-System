/**
 * @fileOverview نظام المسارات (Flows)
 * تعريف ومدير المسارات المختلفة للتنفيذ
 */

import { PRANOFlow, ExecutionContext, ExecutionNode } from '../types';

/**
 * مدير المسارات
 */
export class FlowsManager {
  private flows: Map<string, PRANOFlow> = new Map();

  /**
   * تسجيل مسار جديد
   */
  registerFlow(flow: PRANOFlow): void {
    if (this.flows.has(flow.id)) {
      throw new Error(`Flow already registered: ${flow.id}`);
    }
    this.flows.set(flow.id, flow);
  }

  /**
   * الحصول على مسار
   */
  getFlow(flowId: string): PRANOFlow | undefined {
    return this.flows.get(flowId);
  }

  /**
   * قائمة المسارات المفعلة
   */
  listEnabledFlows(): PRANOFlow[] {
    return Array.from(this.flows.values()).filter((f) => f.enabled);
  }

  /**
   * تفعيل مسار
   */
  enableFlow(flowId: string): void {
    const flow = this.flows.get(flowId);
    if (flow) {
      flow.enabled = true;
    }
  }

  /**
   * تعطيل مسار
   */
  disableFlow(flowId: string): void {
    const flow = this.flows.get(flowId);
    if (flow) {
      flow.enabled = false;
    }
  }
}

/**
 * مسار نموذجي - مسار الاستدلال (Inference Flow)
 */
export class InferenceFlow implements PRANOFlow {
  id = 'flow_inference';
  name = 'Inference Flow';
  description = 'مسار الاستدلال والمعالجة الأساسية';
  version = '1.0.0';
  nodes: ExecutionNode[] = ['N1_Initiator' as ExecutionNode, 'N2_VerificationGate' as ExecutionNode, 'N3_Processing' as ExecutionNode, 'N4_Output' as ExecutionNode, 'N5_Terminator' as ExecutionNode];
  tools = ['tool_text_processing', 'tool_security_validation'];
  verificationPolicies = ['policy_basic'];
  enabled = true;

  async execute(input: Record<string, unknown>): Promise<ExecutionContext> {
    // سيتم تنفيذه بواسطة المحرك الرئيسي
    throw new Error('Execute should be called by PRANOEngine');
  }
}

/**
 * مسار نموذجي - مسار معالجة البيانات
 */
export class DataProcessingFlow implements PRANOFlow {
  id = 'flow_data_processing';
  name = 'Data Processing Flow';
  description = 'مسار معالجة وتحويل البيانات';
  version = '1.0.0';
  nodes: ExecutionNode[] = ['N1_Initiator' as ExecutionNode, 'N3_Processing' as ExecutionNode, 'N4_Output' as ExecutionNode, 'N5_Terminator' as ExecutionNode];
  tools = ['tool_data_transformation'];
  verificationPolicies = [];
  enabled = true;

  async execute(input: Record<string, unknown>): Promise<ExecutionContext> {
    throw new Error('Execute should be called by PRANOEngine');
  }
}

/**
 * مسار نموذجي - مسار التحقق الأمني
 */
export class SecurityVerificationFlow implements PRANOFlow {
  id = 'flow_security_verification';
  name = 'Security Verification Flow';
  description = 'مسار التحقق الأمني المكثف';
  version = '1.0.0';
  nodes: ExecutionNode[] = ['N1_Initiator' as ExecutionNode, 'N2_VerificationGate' as ExecutionNode, 'N2_VerificationGate' as ExecutionNode, 'N4_Output' as ExecutionNode, 'N5_Terminator' as ExecutionNode];
  tools = ['tool_security_validation'];
  verificationPolicies = ['policy_high_security', 'policy_compliance'];
  enabled = true;

  async execute(input: Record<string, unknown>): Promise<ExecutionContext> {
    throw new Error('Execute should be called by PRANOEngine');
  }
}

/**
 * منشئ المسارات المخصصة
 */
export class CustomFlowBuilder {
  private flow: Partial<PRANOFlow> = {
    enabled: true,
    nodes: [],
    tools: [],
    verificationPolicies: [],
  };

  /**
   * تعيين المعرف والاسم
   */
  withId(id: string): CustomFlowBuilder {
    this.flow.id = id;
    return this;
  }

  /**
   * تعيين الاسم
   */
  withName(name: string): CustomFlowBuilder {
    this.flow.name = name;
    return this;
  }

  /**
   * تعيين الوصف
   */
  withDescription(description: string): CustomFlowBuilder {
    this.flow.description = description;
    return this;
  }

  /**
   * إضافة نقطة تنفيذ
   */
  addNode(node: string): CustomFlowBuilder {
    this.flow.nodes!.push(node as any);
    return this;
  }

  /**
   * إضافة أداة
   */
  addTool(toolId: string): CustomFlowBuilder {
    this.flow.tools!.push(toolId);
    return this;
  }

  /**
   * إضافة سياسة تحقق
   */
  addVerificationPolicy(policyId: string): CustomFlowBuilder {
    this.flow.verificationPolicies!.push(policyId);
    return this;
  }

  /**
   * تفعيل المسار
   */
  enable(): CustomFlowBuilder {
    this.flow.enabled = true;
    return this;
  }

  /**
   * تعطيل المسار
   */
  disable(): CustomFlowBuilder {
    this.flow.enabled = false;
    return this;
  }

  /**
   * بناء المسار
   */
  build(): PRANOFlow {
    if (!this.flow.id || !this.flow.name) {
      throw new Error('Flow must have id and name');
    }

    return {
      id: this.flow.id,
      name: this.flow.name,
      description: this.flow.description || '',
      version: '1.0.0',
      nodes: this.flow.nodes as any,
      tools: this.flow.tools || [],
      verificationPolicies: this.flow.verificationPolicies || [],
      enabled: this.flow.enabled!,
      execute: async (input: Record<string, unknown>): Promise<ExecutionContext> => {
        throw new Error('Execute should be called by PRANOEngine');
      },
    };
  }
}
