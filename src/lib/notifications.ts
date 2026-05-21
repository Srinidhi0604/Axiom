/**
 * Email and notification utilities
 */

export interface EmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

export interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate multiple emails
 */
export function areValidEmails(emails: string[]): boolean {
  return emails.every(isValidEmail);
}

/**
 * Format email address
 */
export function formatEmail(name: string, email: string): string {
  if (!isValidEmail(email)) return email;
  return `${name} <${email}>`;
}

/**
 * Parse email address
 */
export function parseEmail(emailString: string): { name: string; email: string } {
  const match = emailString.match(/^([^<]*)<([^>]+)>$|^(.+)$/);

  if (match?.[2]) {
    return { name: match[1].trim(), email: match[2] };
  }

  return { name: "", email: emailString.trim() };
}

/**
 * Email template for welcome
 */
export function getWelcomeEmailTemplate(name: string, activationUrl: string): string {
  return `
    <h2>Welcome to Axiom, ${name}!</h2>
    <p>Thank you for signing up. Please confirm your email by clicking the link below:</p>
    <p><a href="${activationUrl}">Activate your account</a></p>
    <p>This link expires in 24 hours.</p>
  `;
}

/**
 * Email template for password reset
 */
export function getPasswordResetTemplate(name: string, resetUrl: string): string {
  return `
    <h2>Password Reset Request</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the link below to proceed:</p>
    <p><a href="${resetUrl}">Reset your password</a></p>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;
}

/**
 * Email template for verification
 */
export function getVerificationEmailTemplate(name: string, code: string): string {
  return `
    <h2>Email Verification</h2>
    <p>Hi ${name},</p>
    <p>Your verification code is:</p>
    <h3>${code}</h3>
    <p>This code expires in 10 minutes.</p>
  `;
}

/**
 * Notification types
 */
export enum NotificationType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  PROBLEM_SOLVED = "problem_solved",
  NEW_COMMENT = "new_comment",
  ACHIEVEMENT = "achievement",
}

/**
 * Create notification payload
 */
export function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: Record<string, unknown>
): NotificationPayload {
  return {
    userId,
    type,
    title,
    message,
    data,
    timestamp: new Date(),
  };
}

/**
 * Get notification icon
 */
export function getNotificationIcon(type: NotificationType): string {
  const iconMap: Record<NotificationType, string> = {
    [NotificationType.INFO]: "ℹ️",
    [NotificationType.SUCCESS]: "✅",
    [NotificationType.WARNING]: "⚠️",
    [NotificationType.ERROR]: "❌",
    [NotificationType.PROBLEM_SOLVED]: "🎉",
    [NotificationType.NEW_COMMENT]: "💬",
    [NotificationType.ACHIEVEMENT]: "🏆",
  };

  return iconMap[type] || "📢";
}

/**
 * Format notification for display
 */
export function formatNotification(notification: NotificationPayload): string {
  const icon = getNotificationIcon(notification.type as NotificationType);
  return `${icon} ${notification.title}: ${notification.message}`;
}

/**
 * Notification subscriber
 */
export class NotificationSubscriber {
  private subscribers: Map<string, Array<(notification: NotificationPayload) => void>> = new Map();

  /**
   * Subscribe to notifications
   */
  subscribe(userId: string, callback: (notification: NotificationPayload) => void): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, []);
    }

    this.subscribers.get(userId)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(userId) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Publish notification
   */
  publish(notification: NotificationPayload): void {
    const callbacks = this.subscribers.get(notification.userId) || [];
    for (const callback of callbacks) {
      callback(notification);
    }
  }

  /**
   * Broadcast to all subscribers
   */
  broadcast(notification: NotificationPayload): void {
    for (const callbacks of this.subscribers.values()) {
      for (const callback of callbacks) {
        callback(notification);
      }
    }
  }

  /**
   * Get subscriber count
   */
  getSubscriberCount(userId?: string): number {
    if (userId) {
      return this.subscribers.get(userId)?.length || 0;
    }

    let count = 0;
    for (const callbacks of this.subscribers.values()) {
      count += callbacks.length;
    }
    return count;
  }

  /**
   * Clear all subscribers
   */
  clear(): void {
    this.subscribers.clear();
  }
}

/**
 * Global notification subscriber
 */
export const globalNotificationSubscriber = new NotificationSubscriber();
