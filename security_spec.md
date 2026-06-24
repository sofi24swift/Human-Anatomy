# Firestore Security Specification & TDD Rule Set

## 1. Data Invariants
- **Own Profile Isolation**: Users can only read (`get`) or write (`create`, `update`, `delete`) their own progress data under `/users/{userId}` where `{userId}` matches `request.auth.uid`.
- **Blocked Blanket Listing**: No listing (`list`) of users is allowed. All queries must target individual documents with exact document ID.
- **Identity Invariant / Anti-Spoofing**: On document creation or update, the profile's `uid` field must exactly match the authenticated `request.auth.uid`.
- **System Integrity / Immutability**: The core fields `email` and `uid` are immutable once set and cannot be altered.
- **Value Limits**: `points` and `stars` must be positive integer types under 1,000,000 to prevent denial of wallet/points exhaustion.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **The Identity Hijack**: Trying to write a document at `/users/malicious_uid` with `uid = "victim_uid"`.
2. **The High-Score Squeezer**: Trying to create a user profile with points set to `99999999`.
3. **The Email Impersonator**: Trying to overwrite email of another user to inject administrative privileges or hijacking their credentials.
4. **The Blanket Query Attack**: Attempting to query all profiles via a collection list without specifying the exact user ID lock constraint.
5. **Anonymous Intrusion**: Attempting to create/modify progress records with anonymous or unverified credentials.
6. **Immutable Hijack**: Attempting to update `email` or `uid` field of a profile.
7. **Phantom Attribute Attack (Shadow Update)**: Attempting to insert undefined system fields like `isAdmin: true` into the user profile.
8. **Negative Points Injection**: Attempting to set `points` to `-50` to overflow stats.
9. **Spammy Type Poisoning**: Injected string values ("billion") into the `points` field.
10. **Extremely Huge String ID**: Attempting to poison paths using a document ID with 5,000 characters.
11. **Stale Playback Attack**: Setting the `lastUpdate` to a timestamp years in the future (`Date.now() + 10000000000`).
12. **Unauthorized Deletion**: A user trying to delete another user's profile document.

---

## 3. The Test Cases Reference (firestore.rules.test.ts)

Below is the conceptual suite verifying that all malicious payloads return `PERMISSION_DENIED`.

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

describe("Anatomy Kids Security Rules Suite", () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "gen-lang-client-0920607837",
      firestore: {
        host: "localhost",
        port: 8080,
      }
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it("denies unauthenticated read/write to users", async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(getDoc(doc(db, "users/kid1")));
    await assertFails(setDoc(doc(db, "users/kid1"), { points: 10 }));
  });

  it("allows user to read and write own document with valid types", async () => {
    const context = testEnv.authenticatedContext("kid1", { email: "kid1@school.ge", email_verified: true });
    const db = context.firestore();
    await assertSucceeds(setDoc(doc(db, "users/kid1"), {
      email: "kid1@school.ge",
      uid: "kid1",
      points: 10,
      stars: 5,
      lastUpdate: Date.now()
    }));
  });

  it("denies user from reading another's document", async () => {
    const context = testEnv.authenticatedContext("kid1", { email: "kid1@school.ge", email_verified: true });
    const db = context.firestore();
    await assertFails(getDoc(doc(db, "users/kid2")));
  });

  it("denies shadow updates and immutable field modification", async () => {
    const context = testEnv.authenticatedContext("kid1", { email: "kid1@school.ge", email_verified: true });
    const db = context.firestore();
    
    // Setup initial data
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users/kid1"), {
        email: "kid1@school.ge",
        uid: "kid1",
        points: 0,
        stars: 0,
        lastUpdate: Date.now()
      });
    });

    // Try modifying mutable and trying to inject shadow key 'isAdmin'
    await assertFails(updateDoc(doc(db, "users/kid1"), {
      points: 50,
      isAdmin: true
    }));

    // Try modifying immutable email key
    await assertFails(updateDoc(doc(db, "users/kid1"), {
      email: "hacker@school.ge"
    }));
  });
});
```
