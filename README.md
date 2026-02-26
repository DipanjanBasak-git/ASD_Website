# Verify ASD — Research Platform

> AI-assisted ASD screening platform built with **Next.js 14 (App Router)**, **TensorFlow.js**, and **Prisma**.  
> Trained model: **EfficientNetB4 + Vision Transformer (ViT)** hybrid, binary classification.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [ML Model — Architecture & Training](#3-ml-model--architecture--training)
4. [Critical Bug Fix — Inference Pipeline](#4-critical-bug-fix--inference-pipeline)
5. [File Structure](#5-file-structure)
6. [Key Files Reference](#6-key-files-reference)
7. [Roles & Dashboards](#7-roles--dashboards)
8. [Navigation Architecture](#8-navigation-architecture)
9. [Running Locally](#9-running-locally)
10. [Environment Variables](#10-environment-variables)
11. [Batch Model Testing](#11-batch-model-testing)
12. [Known Limitations](#12-known-limitations)
13. [Future Work](#13-future-work)

---

## 1. Project Overview

**Verify ASD** is a research-oriented, multi-role web platform for structured AI-assisted ASD (Autism Spectrum Disorder) screening using facial image analysis.

Users are segmented by role:

| Role | Dashboard Path | Purpose |
|------|----------------|---------|
| Patient / Guardian | `/patient/dashboard` | Upload facial image for ASD screening |
| Doctor | `/doctor/dashboard` | Clinical review of patient risk flags |
| Therapist | `/therapist/dashboard` | Session notes & occupational therapy log |
| Counsellor | `/counsellor/dashboard` | New patient registration & intake |

Authentication is session-based using encrypted cookies (no JWT library; custom `decryptSession` in `src/lib/auth/session.ts`).

---

## 2. Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | CSS Modules + global CSS variables |
| Database | PostgreSQL via Prisma ORM |
| ML Inference | `@tensorflow/tfjs` (Node.js backend, no native bindings) |
| Image Decode | `jimp` (pure JS, no native deps) |
| Auth | Custom session cookies + `AuthContext` (React Context) |
| Font | Inter (Google Fonts via `next/font`) |

---

## 3. ML Model — Architecture & Training

### Architecture

```
Input (224×224×3)
  │
  ├── EfficientNetB4 backbone (frozen, ImageNet weights)
  │     └── Output: 7×7×1792 feature map
  │
  ├── Reshape → 49 tokens of dim 1792
  │
  ├── LayerNormalization
  ├── Multi-Head Attention (8 heads, key_dim=64)
  ├── Residual Add
  ├── GlobalAveragePooling1D
  │
  ├── BatchNormalization
  ├── Dense(256, relu) + Dropout(0.5) + L2 regularization
  ├── Dense(128, relu) + Dropout(0.4) + L2 regularization
  │
  └── Dense(1, activation='sigmoid')   ← single binary output
```

### Training Configuration (from `training_notebook.ipynb.ipynb`)

```python
IMG_SIZE    = (224, 224)
BATCH_SIZE  = 8
OPTIMIZER   = Adam(lr=1e-4)
LOSS        = binary_crossentropy
METRICS     = [accuracy, AUC]

ImageDataGenerator(rescale=1./255, ...)   # input normalized to [0, 1]
class_mode  = 'binary'
```

### Class Mapping

Keras `flow_from_directory` uses **alphabetical order**:

```
{'ASD': 0, 'Non-ASD': 1}
```

Sigmoid output interpretation:
- Score → **0** = ASD (class 0)
- Score → **1** = Non-ASD (class 1)

Therefore: `P(ASD) = 1 - rawScore`

### Model Files

| File | Description |
|------|-------------|
| `asd_model.h5` | Original Keras `.h5` model (for Python eval/training) |
| `public/model_tfjs/model.json` | TF.js frozen GraphModel manifest |
| `public/model_tfjs/group1-shard*.bin` | 21 binary weight shards (~total model weights) |
| `training_notebook.ipynb.ipynb` | Full Google Colab training notebook |

#### Internal Preprocessing in the Frozen Graph

The TF.js `model.json` contains **baked-in preprocessing layers** verified by reading weight shard bytes:

| Node | Value | Effect |
|------|-------|--------|
| `rescaling_1/Cast/x` | `0.003921568 = 1/255` | Divides input by 255 |
| `rescaling_1/add` | `[-0.485, -0.456, -0.406]` | Subtracts ImageNet channel means |
| `normalization_1/truediv` | `[4.367, 4.464, 4.444]` | Divides by ImageNet channel stds |

This means the **model itself handles `/255`** — the website must send **raw `[0–255]` pixel values**.

---

## 4. Critical Bug Fix — Inference Pipeline

### The Bug (Double Normalization)

**Before fix** — `src/lib/ml/preprocess.ts` divided pixels by 255:
```ts
pixelData[pixelIdx++] = image.bitmap.data[idx] / 255.0; // ❌ WRONG
```

**Problem**: The TF.js model **already** has an internal `rescaling_1` node with `scale = 1/255`. Feeding already-normalized `[0, 1]` data into it produced values in `[0, 0.004]` — completely corrupted input causing the sigmoid to output random noise in the `~0.45–0.55` band.

**Symptom**: Every image (both ASD and Non-ASD) predicted "ASD Positive ~55%".

### The Fix

```ts
// CORRECT — send raw [0-255] pixel values, model handles /255 internally
pixelData[pixelIdx++] = image.bitmap.data[idx];       // R
pixelData[pixelIdx++] = image.bitmap.data[idx + 1];  // G
pixelData[pixelIdx++] = image.bitmap.data[idx + 2];  // B
```

### Debug Logging in Production

`src/app/api/screening/image/route.ts` now logs on every inference call:

```
[Screening API] Input tensor range: min=0.00, max=255.00   ← must be ~255
[Screening API] Raw sigmoid score (P(Non-ASD)): 0.8341
[Screening API] P(ASD):     16.6%
[Screening API] P(Non-ASD): 83.4%
[Screening API] Predicted class index: 1 (0=ASD, 1=Non-ASD)
[Screening API] Final prediction: ASD Negative (confidence: 83.4%)
```

> **If `max ≈ 1.0` appears in the log**, the double-normalization bug has reappeared somewhere.

---

## 5. File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/           # login, logout, /me endpoints
│   │   ├── patient/        # dashboard data, list, register
│   │   ├── screening/
│   │   │   └── image/      # POST — ML inference endpoint (route.ts)
│   │   └── therapy/        # therapy log endpoint
│   ├── patient/dashboard/  # Patient portal page
│   ├── doctor/dashboard/   # Doctor clinical review page
│   ├── therapist/dashboard/# Therapist session console
│   ├── counsellor/dashboard/# Counsellor patient intake form
│   ├── screening/          # ASD Image Screening page (uses ScreeningModule)
│   └── globals.css         # CSS variables + global utilities
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Global nav — profile dropdown when logged in
│   │   └── Navbar.module.css
│   ├── patient/
│   │   ├── ScreeningModule.tsx       # Main screening UI component
│   │   └── ScreeningModule.module.css
│   └── ui/
│       ├── BackButton.tsx            # Reusable back navigation button
│       ├── BackButton.module.css
│       ├── Container.tsx
│       └── Input.tsx
│
├── context/
│   └── AuthContext.tsx      # Global auth state (user, logout, refreshUser)
│
└── lib/
    ├── auth/
    │   ├── session.ts       # Session encryption/decryption
    │   └── otp.ts
    ├── ml/
    │   ├── asdModel.ts      # Singleton TF.js model loader
    │   └── preprocess.ts    # Image → float32 tensor [1,224,224,3]
    └── email.ts

public/
└── model_tfjs/
    ├── model.json           # TF.js frozen GraphModel
    └── group1-shard*.bin    # 21 weight shards

asd_model.h5                 # Original Keras model (Python only)
test_batch.py                # Batch inference test script (Python/tfenv)
test-eval.py                 # Legacy eval script
training_notebook.ipynb.ipynb# Full Colab training notebook
```

---

## 6. Key Files Reference

### `src/lib/ml/preprocess.ts`
Converts a raw image `Buffer` to a `[1, 224, 224, 3]` float32 tensor.
- Uses `jimp` for pure-JS image decoding (no native bindings)
- Passes pixels as **raw `[0–255]` values** — model handles normalization internally
- Logs input tensor min/max for debugging

### `src/lib/ml/asdModel.ts`
Singleton loader for the TF.js GraphModel.
- Caches model in a global variable to avoid reloading on every request
- Uses `nodeFileSystemHandler` to load from `public/model_tfjs/model.json`

### `src/app/api/screening/image/route.ts`
The main inference API endpoint (`POST /api/screening/image`).
- Auth guard: PATIENT role only
- Validates file type (JPG/PNG) and size (≤ 5MB)
- Calls `preprocessImage()` then `model.predict()`
- Returns `{ score: number, prediction: "ASD Positive" | "ASD Negative" }`

### `src/components/patient/ScreeningModule.tsx`
The main screening UI:
- Fetches patient name/ID from `/api/patient/dashboard`
- Breadcrumb: `Dashboard / ASD Image Screening`
- Drag-and-drop + browse image upload
- Displays result with confidence score, progress bar, model info, disclaimer

### `src/components/layout/Navbar.tsx`
Global navigation bar:
- When **logged in**: shows profile chip with initials → dropdown (name, role, Dashboard link, Sign Out)
- When **logged out**: shows Login + Register buttons
- Routes "Dashboard" link to correct role path automatically

---

## 7. Roles & Dashboards

| Role | Path | Data Source | Notes |
|------|------|-------------|-------|
| PATIENT | `/patient/dashboard` | `/api/patient/dashboard` | Screenings, prescriptions, therapy |
| DOCTOR | `/doctor/dashboard` | `/api/patient/list` | Risk flags, patient queue |
| THERAPIST | `/therapist/dashboard` | `/api/patient/list` + `/api/therapy/log` | Session notes |
| COUNSELLOR | `/counsellor/dashboard` | `/api/patient/register` | New patient intake form |

---

## 8. Navigation Architecture

### Back Navigation

A reusable `BackButton` component is available at `src/components/ui/BackButton.tsx`:

```tsx
// Uses browser history (router.back()) by default:
<BackButton />

// Or navigate to a specific path:
<BackButton label="← Dashboard" href="/patient/dashboard" />
```

All 4 dashboards include a `← Home` BackButton in their headers.

### Screening Page Breadcrumb

The screening page uses breadcrumb navigation instead of a floating back button:
```
Dashboard / ASD Image Screening
```
This follows standard dashboard UX patterns and reduces visual clutter.

---

## 9. Running Locally

### Prerequisites

- Node.js 18+
- PostgreSQL database running
- Python 3.11+ with TensorFlow (for batch testing only)

### Install and start

```powershell
npm install
npm run dev
```

App runs at `http://localhost:3000`.

### Python virtual environment (for ML testing)

```powershell
.\tfenv\Scripts\activate
python test_batch.py
```

### Database

```powershell
npx prisma migrate dev   # apply migrations
npx prisma db seed       # seed default roles
```

---

## 10. Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/asd_db"
SESSION_SECRET="your-32+-char-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 11. Batch Model Testing

Use `test_batch.py` to validate the `.h5` model directly against known images:

```powershell
.\tfenv\Scripts\python.exe test_batch.py
```

**Expected output for a correctly working model:**

```
TRUE CLASS: ASD (5 images)
  [PASS] img001.jpg    raw=0.1234  P(ASD)=87.7%  P(Non-ASD)=12.3%  -> ASD
  ...
  Class accuracy: 4/5 = 80%

TRUE CLASS: Non-ASD (5 images)
  [PASS] img002.jpg    raw=0.8901  P(ASD)=11.0%  P(Non-ASD)=89.0%  -> Non-ASD
  ...
```

**Score interpretation:**

```
raw sigmoid score → 0   = ASD
raw sigmoid score → 1   = Non-ASD
P(ASD) = 1 - rawScore
```

> **Note**: The dataset (`Processed_ASD_Data_GroupSplit/`) was processed on Google Colab and may not be present locally. The script auto-falls back to a dummy baseline test.

---

## 12. Known Limitations

- **Model training used `rescale=1./255`** in `ImageDataGenerator`. The converted TF.js model has this baked in as `rescaling_1`. Never add `/255` again in `preprocess.ts`.
- **No GPU inference**: The TF.js Node.js backend runs on CPU only. Inference takes ~2–5 seconds per image.
- **Session security**: The current session is cookie-based with custom encryption. In production, use a properly rotated key stored in a secrets manager.
- **Counsellor mock user ID**: `counsellor-01` is still hardcoded in `counsellor/dashboard/page.tsx`. Connect this to the real session once the API is wired.
- **Therapist visit selection**: `visits?.[0]?.id` selects the first visit. A proper patient-visit selection UI is needed.

---

## 13. Future Work

- [ ] Connect WebSocket or SSE for real-time screening status
- [ ] Save screening results to DB from the image screening page
- [ ] Add patient-facing report PDF export
- [ ] Replace alert() dialogs in Therapist dashboard with toast notifications
- [ ] Run batch validation on held-out test set and log model accuracy metrics
- [ ] Add Grad-CAM or attention map visualization overlay on screening result
- [ ] Implement refresh token rotation for production session security
- [ ] Add rate limiting on `/api/screening/image` to prevent abuse

---

*Last updated: 26 February 2026*  
*Platform: Verify ASD Research Platform — Internal Development Reference*
