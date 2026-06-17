# TODO - Demo signup allow everyone

- [x] Update `components/auth-form.tsx` to show full signup/signin error details.

- [x] Update `lib/auth.ts` to enforce demo mode signup allowance (env-driven, default true in dev) and improve server-side logging.

- [ ] Re-test: open `/sign-up`, create a new account, confirm redirect to `/` and session created.
- [ ] If signup still fails: inspect server logs to determine missing migrations/tables or DB schema mismatch, then update `lib/db/schema.ts` / migration strategy.

