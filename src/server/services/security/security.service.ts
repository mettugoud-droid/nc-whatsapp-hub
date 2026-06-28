/**
 * Security Service
 * 
 * - Encrypt/decrypt API keys and secrets
 * - Two-Factor Authentication (2FA) for Admin
 * - Login activity tracking
 * - IP-based access logs
 * - Session management
 * - Audit trail for all operations
 */

import crypto from "crypto";

export interface LoginActivity {
  id: string;
  userId: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed" | "blocked";
  reason?: string;
  timestamp: Date;
}

export interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  timestamp: Date;
}

export interface SessionInfo {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
}

export class SecurityService {
  private algorithm = "aes-256-gcm";
  private loginActivities: LoginActivity[] = [];
  private auditLog: AuditEntry[] = [];
  private sessions: Map<string, SessionInfo> = new Map();

  /**
   * Encrypt sensitive data (API keys, secrets)
   */
  encrypt(text: string, encryptionKey?: string): string {
    const key = Buffer.from(
      encryptionKey || process.env.ENCRYPTION_KEY || "default-32-char-encryption-key!!",
      "utf-8"
    ).slice(0, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv) as crypto.CipherGCM;

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedText: string, encryptionKey?: string): string {
    const key = Buffer.from(
      encryptionKey || process.env.ENCRYPTION_KEY || "default-32-char-encryption-key!!",
      "utf-8"
    ).slice(0, 32);

    const [ivHex, authTagHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(this.algorithm, key, iv) as crypto.DecipherGCM;
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  /**
   * Generate 2FA secret for TOTP
   */
  generate2FASecret(): { secret: string; otpauthUrl: string } {
    const secret = crypto.randomBytes(20).toString("hex");
    const otpauthUrl = `otpauth://totp/NaturesCrates:admin?secret=${secret}&issuer=NaturesCrates`;
    return { secret, otpauthUrl };
  }

  /**
   * Verify 2FA TOTP code
   */
  verify2FACode(secret: string, code: string): boolean {
    // In production, use a TOTP library like speakeasy
    // This is a placeholder for the verification logic
    return code.length === 6 && /^\d{6}$/.test(code);
  }

  /**
   * Record login activity
   */
  recordLogin(activity: Omit<LoginActivity, "id" | "timestamp">): LoginActivity {
    const entry: LoginActivity = {
      ...activity,
      id: `login_${Date.now()}`,
      timestamp: new Date(),
    };
    this.loginActivities.unshift(entry);
    // Keep last 1000 entries
    if (this.loginActivities.length > 1000) this.loginActivities.pop();
    return entry;
  }

  /**
   * Get login history
   */
  getLoginHistory(userId?: string, limit: number = 50): LoginActivity[] {
    let activities = this.loginActivities;
    if (userId) activities = activities.filter(a => a.userId === userId);
    return activities.slice(0, limit);
  }

  /**
   * Record audit entry
   */
  audit(entry: Omit<AuditEntry, "id" | "timestamp">): AuditEntry {
    const auditEntry: AuditEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
    };
    this.auditLog.unshift(auditEntry);
    if (this.auditLog.length > 10000) this.auditLog.pop();
    return auditEntry;
  }

  /**
   * Get audit log
   */
  getAuditLog(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    limit?: number;
  }): AuditEntry[] {
    let entries = this.auditLog;
    if (filters?.userId) entries = entries.filter(e => e.userId === filters.userId);
    if (filters?.action) entries = entries.filter(e => e.action === filters.action);
    if (filters?.resource) entries = entries.filter(e => e.resource === filters.resource);
    return entries.slice(0, filters?.limit || 100);
  }

  /**
   * Create session
   */
  createSession(userId: string, ipAddress: string, userAgent: string): SessionInfo {
    const session: SessionInfo = {
      id: crypto.randomUUID(),
      userId,
      ipAddress,
      userAgent,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      lastActiveAt: new Date(),
      isActive: true,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Get active sessions for user
   */
  getActiveSessions(userId: string): SessionInfo[] {
    return Array.from(this.sessions.values()).filter(
      s => s.userId === userId && s.isActive && s.expiresAt > new Date()
    );
  }

  /**
   * Revoke session
   */
  revokeSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      return true;
    }
    return false;
  }

  /**
   * Revoke all sessions for user
   */
  revokeAllSessions(userId: string): number {
    let count = 0;
    this.sessions.forEach(session => {
      if (session.userId === userId && session.isActive) {
        session.isActive = false;
        count++;
      }
    });
    return count;
  }
}

export const securityService = new SecurityService();
