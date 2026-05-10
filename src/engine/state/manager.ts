/**
 * @fileOverview نظام إدارة الحالة والجلسات
 * إدارة حالة المحرك والجلسات النشطة والسياق المشترك
 */

import { ExecutionContext, SessionConfig, ExecutionStatus } from '../types';

/**
 * مدير الحالة المركزي
 */
export class StateManager {
  private sessions: Map<string, SessionConfig> = new Map();
  private activeContexts: Map<string, ExecutionContext> = new Map();
  private sessionTimestamps: Map<string, number> = new Map();

  /**
   * إنشاء جلسة جديدة
   */
  createSession(config: SessionConfig): string {
    this.sessions.set(config.id, config);
    this.sessionTimestamps.set(config.id, Date.now());
    return config.id;
  }

  /**
   * الحصول على جلسة
   */
  getSession(sessionId: string): SessionConfig | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * إنهاء جلسة
   */
  terminateSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    this.sessionTimestamps.delete(sessionId);

    // حذف جميع السياقات المرتبطة بهذه الجلسة
    const contextsToDelete: string[] = [];
    for (const [id, context] of this.activeContexts) {
      if (context.sessionId === sessionId) {
        contextsToDelete.push(id);
      }
    }
    contextsToDelete.forEach((id) => this.activeContexts.delete(id));
  }

  /**
   * حفظ السياق
   */
  saveContext(context: ExecutionContext): void {
    this.activeContexts.set(context.id, context);
  }

  /**
   * الحصول على السياق
   */
  getContext(executionId: string): ExecutionContext | undefined {
    return this.activeContexts.get(executionId);
  }

  /**
   * تحديث حالة السياق
   */
  updateContextStatus(executionId: string, status: ExecutionStatus): void {
    const context = this.activeContexts.get(executionId);
    if (context) {
      context.status = status;
    }
  }

  /**
   * إضافة بيانات التحقق إلى السياق
   */
  setVerificationData(executionId: string, data: Record<string, unknown>): void {
    const context = this.activeContexts.get(executionId);
    if (context) {
      context.verificationData = {
        ...context.verificationData,
        ...data,
      };
    }
  }

  /**
   * إضافة بيانات الإخراج إلى السياق
   */
  setOutput(executionId: string, data: Record<string, unknown>): void {
    const context = this.activeContexts.get(executionId);
    if (context) {
      context.output = {
        ...context.output,
        ...data,
      };
    }
  }

  /**
   * حذف السياق
   */
  deleteContext(executionId: string): void {
    this.activeContexts.delete(executionId);
  }

  /**
   * الحصول على جميع السياقات النشطة
   */
  getActiveContexts(): ExecutionContext[] {
    return Array.from(this.activeContexts.values());
  }

  /**
   * تنظيف الجلسات المنتهية
   */
  cleanupExpiredSessions(maxAge: number): void {
    const now = Date.now();
    const sessionsToDelete: string[] = [];

    for (const [sessionId, timestamp] of this.sessionTimestamps) {
      if (now - timestamp > maxAge) {
        sessionsToDelete.push(sessionId);
      }
    }

    sessionsToDelete.forEach((sessionId) => this.terminateSession(sessionId));
  }

  /**
   * إحصائيات الحالة
   */
  getStatusStatistics() {
    const statusCounts: Record<ExecutionStatus, number> = {
      pending: 0,
      processing: 0,
      verification: 0,
      verified: 0,
      executing: 0,
      completed: 0,
      failed: 0,
      terminated: 0,
    };

    for (const context of this.activeContexts.values()) {
      statusCounts[context.status]++;
    }

    return {
      totalContexts: this.activeContexts.size,
      totalSessions: this.sessions.size,
      statusCounts,
    };
  }
}

/**
 * إدارة الذاكرة المشتركة بين النقاط
 */
export class SharedMemory {
  private cache: Map<string, Record<string, unknown>> = new Map();
  private locks: Map<string, boolean> = new Map();

  /**
   * تعيين بيانات مشتركة
   */
  set(key: string, value: Record<string, unknown>): void {
    this.cache.set(key, value);
  }

  /**
   * الحصول على بيانات مشتركة
   */
  get(key: string): Record<string, unknown> | undefined {
    return this.cache.get(key);
  }

  /**
   * حذف بيانات مشتركة
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * تأمين الوصول إلى البيانات
   */
  acquire(key: string): boolean {
    if (this.locks.has(key)) {
      return false;
    }
    this.locks.set(key, true);
    return true;
  }

  /**
   * إطلاق التأمين
   */
  release(key: string): void {
    this.locks.delete(key);
  }

  /**
   * مسح الذاكرة
   */
  clear(): void {
    this.cache.clear();
    this.locks.clear();
  }
}

/**
 * إدارة نسخ احتياطية من السياق
 */
export class ContextSnapshot {
  private snapshots: Map<string, ExecutionContext> = new Map();

  /**
   * أخذ لقطة من السياق
   */
  takeSnapshot(context: ExecutionContext, label?: string): string {
    const snapshotId = label || `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.snapshots.set(snapshotId, JSON.parse(JSON.stringify(context)));
    return snapshotId;
  }

  /**
   * استرجاع لقطة
   */
  restoreSnapshot(snapshotId: string): ExecutionContext | undefined {
    const snapshot = this.snapshots.get(snapshotId);
    return snapshot ? JSON.parse(JSON.stringify(snapshot)) : undefined;
  }

  /**
   * حذف لقطة
   */
  deleteSnapshot(snapshotId: string): void {
    this.snapshots.delete(snapshotId);
  }

  /**
   * قائمة اللقطات
   */
  listSnapshots(): string[] {
    return Array.from(this.snapshots.keys());
  }
}
