/**
 * @file lib/api-utils.ts
 * Centralized API response and error handling utilities
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standard API response wrapper
 */
export function apiResponse<T>(
  data: T,
  status: number = 200,
  headers?: Record<string, string>
) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      ...headers,
    },
  });
}

/**
 * Standard API error response
 */
export function apiError(
  message: string,
  status: number = 500,
  details?: any
) {
  const response = {
    error: message,
    ...(details && { details }),
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Handle validation errors from Zod
 */
export function handleValidationError(error: ZodError) {
  return apiError(
    "Validation failed",
    400,
    {
      issues: error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    }
  );
}

/**
 * Log API errors with context
 */
export function logApiError(
  context: string,
  error: unknown,
  userId?: string
) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  console.error(`[${timestamp}] ${context}`, {
    error: errorMessage,
    userId,
    stack: error instanceof Error ? error.stack : undefined,
  });
}
