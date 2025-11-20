/**
 * Utility functions for common operations
 */

export class Utils {
  /**
   * Format currency value
   */
  static formatCurrency(amount: number, currency: string = 'PEN'): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format date to local string
   */
  static formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-PE');
  }

  /**
   * Format date and time
   */
  static formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('es-PE');
  }

  /**
   * Generate unique ID
   */
  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number (Peru format)
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^(\+51|51)?9\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Truncate text
   */
  static truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
