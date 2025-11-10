import '@wristband/typescript-session';

/**
 * Augment SessionData with custom application-specific fields.
 *
 * This declaration merging allows you to add custom properties to the session
 * that will be type-checked throughout your application. All custom fields should
 * be optional since they may not be present in all session states.
 *
 * @example
 * ```typescript
 * // After declaring custom fields, they're fully typed in your routes
 * app.get('/cart', (req, res) => {
 *   req.session.customField = 'value';  // ✅ Type-safe
 *   req.session.foo = 'bar';            // ❌ Not type-safe
 * });
 * ```
 */
declare module '@wristband/typescript-session' {
  interface SessionData {
    /** Custom application-specific field */
    customField?: string;
  }
}
