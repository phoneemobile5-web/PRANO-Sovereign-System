/**
 * @fileOverview تعريفات الأنواع الأساسية لمحرك برانو
 * تعريفات TypeScript المركزية لكل مكونات المحرك
 */

/**
 * نقاط التنفيذ الخمس (P-R-A-N-O Nodes)
 * N1: Initiator | N2: Verification | N3: Processing | N4: Output | N5: Terminator
 */
export type ExecutionNode = 'N1_Initiator' | 'N2_VerificationGate' | 'N3_Processing' | 'N4_Output' | 'N5_Terminator';

/**
 * حالات التنفيذ
 */
export type ExecutionStatus = 'pending' | 'processing' | 'verification' | 'verified' | 'executing' | 'completed' | 'failed' | 'terminated';

/**
 * مستويات الأمان للتحقق
 */
export type SecurityLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * بيانات الخطأ والمشاكل
 */
export interface PRANOError {
  code: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  timestamp: number;
  node: ExecutionNode;
  details?: Record<string, unknown>;
}

/**
 * سياق التنفيذ - يحمل البيانات بين المراحل
 */
export interface ExecutionContext {
  id: string;
  sessionId: string;
  sourceData: Record<string, unknown>;
  currentNode: ExecutionNode;
  status: ExecutionStatus;
  startTime: number;
  endTime?: number;
  verificationData?: Record<string, unknown>;
  output?: Record<string, unknown>;
  errors: PRANOError[];
  metadata: {
    userId?: string;
    projectId?: string;
    toolsUsed?: string[];
    securityLevel: SecurityLevel;
  };
}

/**
 * تعريف الأداة (Tool/ADK)
 */
export interface PRANOTool {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  requiredSecurityLevel: SecurityLevel;
  execute: (input: Record<string, unknown>) => Promise<Record<string, unknown>>;
  validate?: (input: Record<string, unknown>) => boolean;
}

/**
 * سياسة التحقق (Verification Policy)
 */
export interface VerificationPolicy {
  id: string;
  name: string;
  rules: VerificationRule[];
  enabled: boolean;
  requiredApprovals: number;
}

/**
 * قاعدة تحقق فردية
 */
export interface VerificationRule {
  id: string;
  type: 'hash' | 'signature' | 'schema' | 'custom';
  description: string;
  check: (context: ExecutionContext) => Promise<boolean>;
}

/**
 * بيانات المسار (Flow)
 */
export interface PRANOFlow {
  id: string;
  name: string;
  description: string;
  version: string;
  nodes: ExecutionNode[];
  tools: string[];
  verificationPolicies: string[];
  enabled: boolean;
  execute: (input: Record<string, unknown>) => Promise<ExecutionContext>;
}

/**
 * استجابة المحرك
 */
export interface PRANOResponse {
  success: boolean;
  executionId: string;
  status: ExecutionStatus;
  data?: Record<string, unknown>;
  errors: PRANOError[];
  executionTime: number;
  verificationProof?: {
    timestamp: number;
    hash: string;
    approvals: number;
  };
}

/**
 * إعدادات الجلسة
 */
export interface SessionConfig {
  id: string;
  userId?: string;
  securityLevel: SecurityLevel;
  enableLogging: boolean;
  enableVerification: boolean;
  timeout: number; // بالميلي ثانية
  maxRetries: number;
}

/**
 * سجل تنفيذي (Execution Log)
 */
export interface ExecutionLog {
  executionId: string;
  flowId: string;
  sessionId: string;
  startTime: number;
  endTime: number;
  nodes: NodeExecutionLog[];
  errors: PRANOError[];
  status: ExecutionStatus;
}

/**
 * سجل نقطة تنفيذ واحدة
 */
export interface NodeExecutionLog {
  node: ExecutionNode;
  startTime: number;
  endTime: number;
  status: ExecutionStatus;
  dataIn: Record<string, unknown>;
  dataOut?: Record<string, unknown>;
  error?: PRANOError;
}
