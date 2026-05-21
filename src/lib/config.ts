/**
 * Environment and configuration utilities
 */

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value || defaultValue || "";
}

/**
 * Get environment variable as boolean
 */
export function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return ["true", "1", "yes", "on"].includes(value.toLowerCase());
}

/**
 * Get environment variable as number
 */
export function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

/**
 * Get API base URL
 */
export function getApiBaseUrl(): string {
  if (isProduction()) {
    return getEnvVar("API_BASE_URL_PROD");
  }
  return getEnvVar("API_BASE_URL_DEV", "http://localhost:3000");
}

/**
 * Get application config object
 */
export function getAppConfig() {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    apiPort: getEnvNumber("API_PORT", 3000),
    apiBaseUrl: getApiBaseUrl(),
    isDev: isDevelopment(),
    isProd: isProduction(),
    isTest: isTest(),
    mongodbUri: getEnvVar("MONGODB_URI", "mongodb://localhost:27017/axiom"),
    jwtSecret: getEnvVar("JWT_SECRET"),
  } as const;
}

/**
 * Validate required environment variables
 */
export function validateRequiredEnvVars(keys: string[]): void {
  const missing = keys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

/**
 * Validate configuration object
 */
export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateConfig(): ConfigValidationResult {
  const errors: string[] = [];

  // Check required environment variables
  const requiredVars = ["MONGODB_URI", "JWT_SECRET"];
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    errors.push(`Missing required environment variables: ${missing.join(", ")}`);
  }

  // Validate MongoDB URI format
  const mongodbUri = process.env.MONGODB_URI;
  if (mongodbUri && !mongodbUri.startsWith("mongodb")) {
    errors.push("Invalid MONGODB_URI format");
  }

  // Validate JWT secret length
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 16) {
    errors.push("JWT_SECRET must be at least 16 characters");
  }

  // Validate port number
  const apiPort = getEnvNumber("API_PORT", 3000);
  if (apiPort < 1 || apiPort > 65535) {
    errors.push("API_PORT must be between 1 and 65535");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get configuration with validation
 */
export function getValidatedConfig() {
  const validation = validateConfig();

  if (!validation.valid) {
    throw new Error(`Configuration validation failed: ${validation.errors.join("; ")}`);
  }

  return getAppConfig();
}

/**
 * Log configuration (safe - no secrets)
 */
export function logConfig(): void {
  const config = {
    nodeEnv: process.env.NODE_ENV,
    apiPort: getEnvNumber("API_PORT", 3000),
    isDev: isDevelopment(),
    isProd: isProduction(),
    jwtSecretLength: process.env.JWT_SECRET?.length || 0,
    mongodbUriSet: !!process.env.MONGODB_URI,
  };

  console.log("Application Configuration:", config);
}
