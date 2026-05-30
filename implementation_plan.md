# Implementation Plan - Security Check, Responsive 3D Canvas, and UI Tweaks

This plan details the design and implementation steps for completing a security check on the application and database, removing home page animations from specific sections, making 3D Canvas layouts responsive on all screen sizes, and cleaning up dead code.

## User Review Required

> [!IMPORTANT]
> - We will enforce NoSQL Injection sanitization across all request inputs (converting parameters like `phone`, `vpa`, `pin` to strings).
> - We will enable PIN verification for transaction actions (`/send` and `/withdraw`) which were previously bypassed.
> - We will change the 3D Canvas layouts to support three responsive breakpoints (mobile, tablet, and desktop).

## Proposed Changes

---

### Backend Components

#### [MODIFY] [Auth Routes](file:///d:/desktop%20stuff/web%20dev/cloud%20Income/cloud-income/server/src/routes/auth.js)
- Enforce strict type parsing of body inputs (`name`, `phone`, `vpa`, `pin`) by casting them to Strings before running database queries (`findOne`, `save`). This eliminates NoSQL Injection risks.

#### [MODIFY] [Transaction Routes](file:///d:/desktop%20stuff/web%20dev/cloud%20Income/cloud-income/server/src/routes/transactions.js)
- Sanitize inputs to prevent NoSQL query operators injection.
- Re-introduce PIN validation for `/send` and `/withdraw` routes. Verify that the provided `pin` matches the user's hashed PIN in the database (`bcrypt.compare`).

#### [MODIFY] [Stock Routes](file:///d:/desktop%20stuff/web%20dev/cloud%20Income/cloud-income/server/src/routes/stocks.js)
- Sanitize `symbol` and `quantity` inputs. Ensure `quantity` is strictly a positive integer and `symbol` is a string.

#### [MODIFY] [Admin Routes](file:///d:/desktop%20stuff/web%20dev/cloud%20Income/cloud-income/server/src/routes/admin.js)
- Sanitize parameters in all admin endpoints (specifically inputs for user update and stock addition).

---

### Frontend Components

#### [MODIFY] [Landing Content](file:///d:/desktop%20stuff/web%20dev/cloud%20Income/cloud-income/client/src/components/LandingContent.jsx)
- Remove `<FadeIn>` anim wraps around "We've cracked the code." (lines 11-56) and "See the Big Picture" (lines 74-120) to render these sections instantly without transitions.

#### [MODIFY] [Hero Component](file:///d:/desktop%20stuff/web%20dev/cloud%20Income/cloud-income/client/src/components/Hero.jsx)
- Introduce a 3-breakpoint media query hook (`mobile` < 640px, `tablet` < 1024px, and `desktop`).
- Adjust the 3D Canvas camera `fov`, `position`, model `scale` and float coordinates for each breakpoint:
  - **Bitcoin Model Scale**: mobile `0.4`, tablet `0.6`, desktop `0.8`.
  - **Bitcoin Model Position**: mobile `[-1.2, 5.2, -3]`, tablet `[-2.8, 3.5, -3]`, desktop `[-4.5, 2.5, -3]`.
  - **Credit Card Model Scale**: mobile `0.6`, tablet `0.8`, desktop `1.1`.
  - **Credit Card Model Position**: mobile `[1.2, -2.8, -3]`, tablet `[2.8, -1.2, -3]`, desktop `[4.5, -0.5, -3]`.
- Apply equivalent responsive updates to the CSS-based fallback images (`Hero3DFallback`) for compatibility when WebGL is disabled or unsupported.

---

## Verification Plan

### Automated/Unit Tests
- Verify sanitization scripts and request models reject NoSQL injection objects.
- Validate security responses (like checking that `/send` fails with an invalid PIN).

### Manual Verification
1. Sign up/Log in. Try to send money without a PIN or with a wrong PIN, verify it is blocked. Enter the correct PIN, verify transaction succeeds.
2. Open the landing page. Inspect "We've cracked the code" and "See the Big Picture" sections. Confirm they load immediately without fade-in transitions.
3. Inspect the 3D models in the Hero header. Resize the browser window to mobile (~375px), tablet (~768px), and desktop (>1024px) sizes. Verify the Bitcoin and Credit Card models scale down and reposition themselves out of the way of the centered text.
