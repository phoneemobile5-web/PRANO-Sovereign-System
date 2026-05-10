/**
 * @fileOverview نظام التسجيل والمراقبة
 * تسجيل جميع أحداث التنفيذ والمتابعة في الوقت الفعلي
 */

import { ExecutionLog, ExecutionContext, PRANOError, NodeExecutionLog } from '../types';

/**
 * مستويات التسجيل
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

/**
 * إدخال سجل واحد
 */
export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  executionId?: string;
  node?: string;
}

/**
 * مدير التسجيل المركزي
 */
export class LogManager {
  private logs: LogEntry[] = [];
  private executionLogs: Map<string, ExecutionLog> = new Map();
  private listeners: ((entry: LogEntry) => void)[] = [];
  private maxLogs = 10000;
  private outputToConsole = true;

  /**
   * تسجيل إدخال جديد
   */
  log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    executionId?: string,
    node?: string
  ): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      context,
      executionId,
      node,
    };

    this.logs.push(entry);

    // الحفاظ على حد أقصى من السجلات
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // إخطار المستمعين
    this.listeners.forEach((listener) => listener(entry));

    // إخراج إلى وحدة التحكم
    if (this.outputToConsole) {
      this.outputToConsoleInternal(entry);
    }
  }

  /**
   * تسجيل قيمة تصحيح (DEBUG)
   */
  debug(message: string, context?: Record<string, unknown>, executionId?: string): void {
    this.log(LogLevel.DEBUG, message, context, executionId);
  }

  /**
   * تسجيل قيمة معلومات (INFO)
   */
  info(message: string, context?: Record<string, unknown>, executionId?: string): void {
    this.log(LogLevel.INFO, message, context, executionId);
  }

  /**
   * تسجيل تحذير (WARN)
   */
  warn(message: string, context?: Record<string, unknown>, executionId?: string): void {
    this.log(LogLevel.WARN, message, context, executionId);
  }

  /**
   * تسجيل خطأ (ERROR)
   */
  error(message: string, context?: Record<string, unknown>, executionId?: string): void {
    this.log(LogLevel.ERROR, message, context, executionId);
  }

  /**
   * تسجيل خطأ حرج (CRITICAL)
   */
  critical(message: string, context?: Record<string, unknown>, executionId?: string): void {
    this.log(LogLevel.CRITICAL, message, context, executionId);
  }

  /**
   * إخراج إلى وحدة التحكم
   */
  private outputToConsoleInternal(entry: LogEntry): void {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
    const levelName = levelNames[entry.level];
    const timestamp = new Date(entry.timestamp).toISOString();

    let prefix = `[${timestamp}] [${levelName}]`;
    if (entry.executionId) {
      prefix += ` [${entry.executionId}]`;
    }
    if (entry.node) {
      prefix += ` [${entry.node}]`;
    }

    const message = `${prefix}: ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, entry.context || '');
        break;
      case LogLevel.INFO:
        console.log(message, entry.context || '');
        break;
      case LogLevel.WARN:
        console.warn(message, entry.context || '');
        break;
      case LogLevel.ERROR:
        console.error(message, entry.context || '');
        break;
      case LogLevel.CRITICAL:
        console.error('🚨 CRITICAL:', message, entry.context || '');
        break;
    }
  }

  /**
   * تسجيل سجل التنفيذ الكامل
   */
  logExecution(executionLog: ExecutionLog): void {
    this.executionLogs.set(executionLog.executionId, executionLog);
    this.info(`Execution logged: ${executionLog.executionId}`, {
      status: executionLog.status,
      errorCount: executionLog.errors.length,
    });
  }

  /**
   * الحصول على سجل التنفيذ
   */
  getExecutionLog(executionId: string): ExecutionLog | undefined {
    return this.executionLogs.get(executionId);
  }

  /**
   * الحصول على جميع السجلات
   */
  getLogs(filter?: { level?: LogLevel; executionId?: string; limit?: number }): LogEntry[] {
    let result = [...this.logs];

    if (filter?.level !== undefined) {
      result = result.filter((log) => log.level >= filter.level!);
    }

    if (filter?.executionId) {
      result = result.filter((log) => log.executionId === filter.executionId);
    }

    if (filter?.limit) {
      result = result.slice(-filter.limit);
    }

    return result;
  }

  /**
   * إضافة مستمع للسجلات
   */
  addListener(listener: (entry: LogEntry) => void): void {
    this.listeners.push(listener);
  }

  /**
   * إزالة مستمع
   */
  removeListener(listener: (entry: LogEntry) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * مسح جميع السجلات
   */
  clear(): void {
    this.logs = [];
    this.executionLogs.clear();
  }

  /**
   * تصدير السجلات كـ JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(
      {
        timestamp: Date.now(),
        logs: this.logs,
        executionLogs: Array.from(this.executionLogs.values()),
      },
      null,
      2
    );
  }

  /**
   * تصدير السجلات كـ CSV
   */
  exportAsCSV(): string {
    const headers = ['timestamp', 'level', 'message', 'executionId', 'node'];
    const rows = this.logs.map((log) => [
      new Date(log.timestamp).toISOString(),
      LogLevel[log.level],
      log.message,
      log.executionId || '',
      log.node || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return csv;
  }
}

/**
 * مراقب الأداء
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  /**
   * تسجيل قياس أداء
   */
  recordMetric(metricName: string, value: number): void {
    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }
    this.metrics.get(metricName)!.push(value);
  }

  /**
   * الحصول على إحصائيات مقياس
   */
  getMetricStats(metricName: string) {
    const values = this.metrics.get(metricName) || [];
    if (values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted[Math.floor(sorted.length / 2)];

    return {
      count: values.length,
      sum,
      avg,
      min,
      max,
      median,
    };
  }

  /**
   * جميع المقاييس المسجلة
   */
  getAllMetrics(): string[] {
    return Array.from(this.metrics.keys());
  }

  /**
   * مسح المقاييس
   */
  clear(): void {
    this.metrics.clear();
  }
}
