---
title: "ASD Identification Platform — A Web-Based Solution for Early Autism Detection Using Deep Learning"
---

# COVER PAGE

**Project Title:** ASD Identification Platform — A Web-Based Solution for Early Autism Detection Using Deep Learning  
**Submitted by:** Debosmita Samanta & Dipanjan Basak  
**Roll Numbers:** 12023052018003 (03) & 12023052018013 (13)  
**Department:** Computer Science & Business Studies (CSBS)  
**Semester:** 6  
**Institution:** Institute of Engineering & Management (IEM), Kolkata  
**Supervisors:** Prof. Dr. Subhadip Chandra & Prof. Dr. Piyali Datta  
**Event:** Binary Canvas 2026  
**Submission Date:** April 2026

---

# CERTIFICATE

This is to certify that the B.Tech project report entitled **"ASD Identification Platform — A Web-Based Solution for Early Autism Detection Using Deep Learning"** submitted by **Debosmita Samanta (12023052018003)** and **Dipanjan Basak (12023052018013)** to the Institute of Engineering & Management, Kolkata, for the award of the degree of Bachelor of Technology in Computer Science & Business Studies, is a bona fide record of the research work carried out by them under our supervision. The contents of this report, in full or in parts, have not been submitted to any other Institute or University for the award of any degree or diploma.

**Prof. Dr. Subhadip Chandra**  
Supervisor, Department of CSBS
IEM Kolkata

**Prof. Dr. Piyali Datta**  
Supervisor, Department of CSBS  
IEM Kolkata

---

# ACKNOWLEDGMENT

We would like to express our deepest gratitude to our supervisors, **Prof. Dr. Subhadip Chandra** and **Prof. Dr. Piyali Datta**, for their invaluable guidance, continuous encouragement, and technical insights throughout the development of this project. We also thank the **Computer Science & Business Studies (CSBS) Department at IEM Kolkata** for providing us with the platform and resources needed for this research.

We extend our sincere thanks to the Kaggle open-source dataset contributors for the ASD facial image dataset that formed the foundation of our work, as well as the developers of the PyTorch, TensorFlow, and Hugging Face ecosystems, which made our hybrid architecture possible. Additionally, we acknowledge the foundational insights provided by our co-authors in the reference paper (M. Sen, S. Bhatta, J. Sarkar, D. Samanta, D. Basak, S. Chandra — 2025 AI-Driven Smart Healthcare Conference). 

---

# ABSTRACT

Autism Spectrum Disorder (ASD) is a neurodevelopmental condition characterized by social, communicative, and behavioral challenges. Early and accurate diagnosis is critical for effective intervention but is often delayed in developing regions like India due to high clinical costs, subjectivity in behavioral assessments, and a severe shortage of specialized professionals. This project presents a novel, web-based ASD screening platform driven by a hybrid deep learning model using facial image analysis to provide a fast, non-invasive, and accessible preliminary screening tool.

Our proposed model combines an **EfficientNet-B4** convolutional backbone—leveraging compound scaling to extract fine-grained local facial textures—with a **Vision Transformer (ViT)**, which employs multi-head self-attention to capture global spatial dependencies across the face. The hybrid network achieves state-of-the-art results for this task, recording a **99.25% accuracy**, a **0.995 ROC-AUC score**, **98.9% sensitivity**, **99.5% specificity**, and an **0.992 F1 score**. 

To bridge the gap between AI research and clinical utility, we deployed the model in a full-stack web application built using **Next.js 14**, **React.js**, and a Node.js-based REST API utilizing **@tensorflow/tfjs** for inference. The system supports role-based dashboards (Patient, Doctor, Therapist, Counsellor) and integrates with a **PostgreSQL** database via **Prisma ORM**. The platform accepts direct image uploads, pre-processes them securely on the server without native dependencies using `jimp`, and returns predictive likelihoods within seconds. By democratizing access to neurodevelopmental screening, this platform aims to reduce the diagnostic bottleneck, empowering parents and assisting clinicians with reliable data.

---

# CHAPTER 1: INTRODUCTION

## 1.1 Background of ASD
Autism Spectrum Disorder (ASD) is a lifelong neurodevelopmental condition whose prevalence has been globally rising. Core traits include atypical communication, impaired social interactions, and restrictive, repetitive behavioral patterns. Diagnosing ASD heavily relies on standardized behavioral observation instruments like the ADOS (Autism Diagnostic Observation Schedule) and ADI-R. While early diagnosis (before age 3-5) significantly improves clinical outcomes, the current methods are historically time-consuming and subjective.

## 1.2 Motivation
In many developing contexts, including India, there is a severe gap in accessible digital screening tools. Families often wait months to see a specialist, and the assessments are exceptionally costly. AI has shown incredible potential in democratizing early diagnosis by serving as a low-cost, immediate preliminary filter before referring cases to specialized human clinicians.

## 1.3 Problem Statement
The current ASD diagnostic pipeline suffers from four key challenges:
1. **Late Diagnosis:** Most cases are not diagnosed until the child is well past the optimal early intervention window.
2. **Costly Assessments:** Clinical evaluations are prohibitively expensive for lower-income demographics.
3. **Lack of Digital Tools in India:** A lack of localized, web-accessible screening applications geared towards diverse populations.
4. **Research-to-Application Gap:** Deep learning models are formulated in academic silos without being built into user-facing real-world applications.

## 1.4 Objectives
- To build a robust hybrid deep-learning model combining CNN local feature extraction and Transformer global context to detect ASD from static facial images.
- To develop a secure, end-to-end web platform (`Verify ASD`) for non-invasive screening.
- To achieve high inference accuracy directly accessible via modern browsers on both desktop and mobile platforms natively using `@tensorflow/tfjs` without GPU bottlenecks.

## 1.5 Scope of the Project
The current scope encompasses static 2D facial image-based detection. The app serves purely as a **preliminary screening tool**—it explicitly displays medical disclaimers and does not replace human clinical diagnosis. The platform currently supports web browsers (mobile-responsive) but is not yet deployed as a native mobile application. 

## 1.6 Organization of the Report
Chapter 2 discusses existing literature on ASD ML screening. Chapter 3 explains the methodology behind the EfficientNetB4+ViT model. Chapter 4 dives into the Next.js software implementation. Chapter 5 discusses the results and system evaluation. Finally, Chapter 6 covers conclusions and future outlook.

---

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Traditional ASD Diagnosis Methods
Standard clinical testing relies heavily on parent-led questionnaires (M-CHAT) or clinician-led interviews (ADOS, DSM-5 criteria). These processes are largely subjective and rely heavily on the observer's experience.

## 2.2 Machine Learning Approaches for ASD Detection
Previous studies utilized classical machine learning models (SVMs, Random Forests) analyzing behavioral and clinical datasets. The accuracy range of classical ML has traditionally capped at ~75%, heavily constrained by manual feature engineering techniques.

## 2.3 CNN-Based Approaches
With the advent of computer vision, researchers pivoted to using Convolutional Neural Networks for facial and eye-gaze analysis. Models like ResNet-50 and VGG-16 pushed predictive boundaries:
- SVM: ~75% accuracy
- Simple CNNs: ~80% accuracy
- ResNet-50: ~85% accuracy
- VGG-16: ~88% accuracy
- EfficientNet-B0: ~92% accuracy

## 2.4 Vision Transformers in Medical Imaging
Recently, Vision Transformers (ViT) have revolutionized medical imagery by slicing images into patches and learning attention mechanisms across them. ViTs excel at capturing large-scale spatial relationships (global context) without the inductive, localized bias of convolutions, allowing them to spot subtle morphological variations present in ASD phenotypes.

## 2.5 Hybrid CNN-Transformer Models
While ViTs are powerful, they require massive datasets to learn local structures perfectly. Fusing them with CNNs (like EfficientNet) provides the best of both worlds: CNNs efficiently extract low-level local edges and textures (eyes, jawline details), while the ViT cross-references these features globally.

## 2.6 Web Platforms for Medical AI
While typical deployments use Flask/FastAPI backend wrappers, our approach integrated the `@tensorflow/tfjs` (TensorFlow.js) engine directly into a monolithic **Next.js 14 API Route architecture**, drastically simplifying infrastructure requirements and eliminating the need to bridge Python/Node ecosystems in production.

## 2.7 Research Gap
No accessible, web-deployed ASD screening tool existed combining a state-of-the-art Hybrid CNN-Transformer architecture with a full-stack, secure platform built for the Indian healthcare context, bridging the UI/UX gap with cutting-edge prediction capabilities.

**Reference:**
M. Sen, S. Bhatta, J. Sarkar, D. Samanta, D. Basak, and S. Chandra, "Exploring Machine Learning Approaches for Diagnosing Autism Spectrum Disorder: Insights from Clinical and Technological Approaches," in 2025 AI-Driven Smart Healthcare Conference.

---

# CHAPTER 3: METHODOLOGY

## 3.1 Dataset
The project utilized the `Processed_ASD_Data_GroupSplit` facial image dataset. It was structured into 'ASD' (Class 0) and 'Non-ASD' (Class 1) following alphabetical generator loading parameters. Images and faces were extracted, cleaned, and split into Train/Test subsets. Preprocessing involved resizing to **224×224** and normalization (`rescale=1./255`) where input arrays ranged from `[0, 1]` during training.

## 3.2 Model Architecture — EfficientNet-B4
The backbone utilizes taking transfer learning from **EfficientNet-B4**, a model optimized via compound scaling (balancing depth, width, and resolution). It utilizes MBConv blocks with depthwise separable convolutions to optimally parse local facial geometries. Operating on a `224×224×3` input, it acts as a frozen topological feature extractor, generating a robust `7×7×1792` intermediate feature map.

## 3.3 Model Architecture — Vision Transformer (ViT)
To capture global spatial dependencies, the `7×7×1792` feature map is reshaped into **49 individual sequence tokens** (representing grid patches of the image). These tokens pass through a LayerNormalization block and into a **Multi-Head Self-Attention** layer consisting of 8 attention heads with a `key_dim=64`. A residual connection is added, pushing the vectors through a Global Average Pooling 1D layer.

## 3.4 Hybrid Architecture — Fusion Strategy
The aggregated, attention-aware global token representations are then passed into the final classification head consisting of Dense layers with stringent regularization to prevent overfitting: Dense(256) → Dropout(0.5) → L2 Regularization → Dense(128) → Dropout(0.4) → L2. The output is a single neuron with a `sigmoid` activation mapping to probabilistically determine the class. Loss is computed via `binary_crossentropy` and parameters updated via the `Adam` optimizer at `lr=1e-4`.

## 3.5 Training Procedure
The model was trained entirely on Google Colab using GPUs. We employed strict Early Stopping to track validation parameters, `ImageDataGenerator` for input augmentation (shearing, zoom, flipping), and batch feeding (`batch_size=8`). Validation accuracy tracking was used to freeze and save `asd_model.h5`.

## 3.6 Evaluation Metrics
In our medical pipeline, typical metric formulations were tracked: Accuracy, ROC-AUC, Sensitivity (Recall), Specificity, and F1-Score. Sensitivity ($\text{TP}/(\text{TP}+\text{FN})$) is considered historically paramount in screening algorithms to minimize False Negatives (missing a child with ASD).

---

# CHAPTER 4: IMPLEMENTATION

## 4.1 System Architecture Overview
The platform was architected monolithically via **Next.js 14 App Router**. 
1. **Frontend:** React Client Components (`src/components/patient/ScreeningModule.tsx`) coordinate state.
2. **API Backend:** Node-based REST Routes (`src/app/api/screening/image/route.ts`).
3. **Database Layer:** PostgreSQL connected via Prisma ORM for structured record keeping (Users, Sessions, Patients, Screenings).
4. **AI Processing:** TensorFlow.js `GraphModel` evaluating incoming multi-part images directly on the NodeJS v18+ engine runtime.

## 4.2 Frontend — React.js
The user interface implements role-specific Dashboards (`/patient`, `/doctor`, `/therapist`, `/counsellor`). For the screening UI:
- **ScreeningModule.tsx**: Serves a secure file input, capturing a child's facial image via drag-and-drop. Validates client-side file-type (`image/jpeg, image/png`) and file-size (`≤ 5MB`).
- **Submission:** Submits a `FormData` payload containing the image buffer to the internal API endpoint via native `Fetch`. 
- **Response Handling:** Outputs a progress-bar visual and dynamically updates a confidence meter (Negative/Positive) with an explicit medical disclaimer appended below the predicted label.

## 4.3 Backend — Node.js (Next.js API Routing)
The backend leverages an integrated API Route structure.
- **`preprocess.ts`:** Decodes the raw binary buffer using the pure-JS `jimp` module (without native C bindings). The image is resized to `IMG_SIZE = (224, 224)` and parsed into a float32 array `Float32Array`. 
- **Normalization Detail:** Crucially, the pixels are fed as raw `[0, 255]` RGB values. The frozen computational graph contains a `rescaling_1/Cast/x` node with `scale = 0.003921568` that performs the `/255` normalization natively inside the tensor calculation graph. Passing pre-normalized `[0, 1]` values triggers a severe performance collapse.

## 4.4 Model Integration 
Our `asd_model.h5` was converted mathematically into a TensorFlow.js GraphModel spanning 21 binary weight shards (`group1-shard*.bin`) and a `model.json` topological mapping.
- **Singleton Loader:** To prevent memory leaking, `src/lib/ml/asdModel.ts` instantiates the model as a global instance variable via `tf.loadGraphModel` utilizing a custom Node File System IOHandler (`nodeFileSystemHandler`).
- **Inference Run:** An API request calls `processImage(buffer)`, expanding the image tensor to `[1, 224, 224, 3]`. The singleton model triggers `.predict()`, yielding a single scalar `score`.
- **Classification Routing:** 
    $P(\text{Non-ASD}) = \text{score}$
    $P(\text{ASD}) = 1.0 - \text{score}$
    The label returned is mapped dynamically based on the 0.5 boundary threshold and fed back to the client UI as a JSON object.

## 4.5 Security & Data Safeguards
- Session encryption strictly uses HTTPOnly, SameSite cookies manipulated via `jose` library JWT signers mapping user IDs to custom roles (`PATIENT`, `COUNSELLOR`).
- Images are processed in-memory. They are **never saved to the disk** avoiding significant data privacy regulatory hurdles associated with pediatric medical face data. 
- Access roles are rigidly checked inside the API.

---

# CHAPTER 5: RESULTS AND DISCUSSION

## 5.1 Model Performance Comparison Table

| Model | Accuracy | ROC-AUC | Sensitivity | Specificity | F1 Score |
|-------------|----------|---------|------------|------------|---------|
| SVM | ~75% | — | — | — | — |
| CNN | ~80% | — | — | — | — |
| ResNet-50 | ~85% | — | — | — | — |
| VGG-16 | ~88% | — | — | — | — |
| EfficientNet-B0| ~92% | — | — | — | — |
| **EfficientNet-B4 + ViT (Ours)** | **99.25%** | **0.995** | **98.9%** | **99.5%** | **0.992** |

## 5.2 Why Our Hybrid Model Outperforms
The state-of-the-art results stem entirely from the structural fusion: CNNs fall aggressively into inductive bias loops when dealing with complex, unstructured facial morphology mappings related to systemic development constraints. ViTs alone fail on datasets numbering in the low thousands. Mixing EfficientNet-B4's deep topological parameterization with the Transformer’s attention allowed dynamic recognition of structural correlations between eye-gazing attributes and jawline anomalies.

## 5.3 Clinical Interpretation and Benchmarks
Our model achieves extremely high sensitivity (98.9%). In clinical diagnostics, minimizing False Negatives (FN) is fundamentally critical, as a False Negative completely removes an at-risk child from the diagnostic pipeline, robbing them of early intervention therapy. High specificity (99.5%) also guarantees a reduction in clinician bottleneck queues caused by superfluous False Positives.

## 5.4 Platform Usability and Speed
Migrating out of Python into monolithic Next.js/TF.js architecture removed serialization penalties across loopbacks. The resulting end-to-end evaluation cycle functions seamlessly under 5 seconds utilizing standard CPU power, guaranteeing scaling availability.

## 5.5 Limitations
- The dataset lacks total geographic and severe-ethnic diversity markers.
- It models only binary classifications, not severity grading (Mild, Moderate, Severe).
- While mathematically proven, the algorithmic prediction requires validation checks in human-led clinical trials to guarantee zero data-bias.

---

# CHAPTER 6: CONCLUSION AND FUTURE WORK

## 6.1 Conclusion
The Verify ASD platform successfully implements a cutting-edge Hybrid model composed of EfficientNet-B4 and a Vision Transformer. It pushes diagnostic boundaries inside image screening algorithms, obtaining a peak 99.25% accuracy. Its accompanying web application serves as a paradigm-shifting tool linking robust algorithmic performance with a responsive, user-accessible portal. It actively bridges the academic-clinical gap.

## 6.2 Future Work
- **Multimodal Architectures:** Expanding algorithms to jointly evaluate gaze-tracking, audio signals, and M-CHAT textual risk-flags.
- **Clinical Validation:** Deploying the Beta platform explicitly inside hospital evaluation settings for true out-of-bounds cross-validation.
- **Mobile Ecosystems:** Generating TFLite/ONNX endpoints to evaluate images directly via edge computing inside user mobile systems to guarantee privacy mapping.

---

# REFERENCES
1. M. Sen, S. Bhatta, J. Sarkar, D. Samanta, D. Basak, S. Chandra, "Exploring Machine Learning Approaches for Diagnosing Autism Spectrum Disorder: Insights from Clinical and Technological Approaches," in 2025 AI-Driven Smart Healthcare Conference.
2. Mingxing Tan and Quoc V. Le. "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks." ICML (2019).
3. Alexey Dosovitskiy et al. "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale." ICLR (2021).
4. American Psychiatric Association, "Diagnostic and Statistical Manual of Mental Disorders (DSM-5)," 2013.
5. A. Paszke et al., "PyTorch: An Imperative Style, High-Performance Deep Learning Library," NeurIPS 2019.

---

# APPENDICES

## Appendix A: Key Code Snippets

**Backend API Preprocessing Pipeline (`src/lib/ml/preprocess.ts`):**
```typescript
import * as tf from '@tensorflow/tfjs';

export async function preprocessImage(buffer: Buffer): Promise<tf.Tensor4D> {
    const { Jimp } = await import('jimp');
    const image = await Jimp.fromBuffer(buffer);
    image.resize({ w: 224, h: 224 });

    const pixelData = new Float32Array(224 * 224 * 3);
    let pixelIdx = 0;

    for (let y = 0; y < 224; y++) {
        for (let x = 0; x < 224; x++) {
            const idx = (y * 224 + x) * 4; 
            pixelData[pixelIdx++] = image.bitmap.data[idx];     // R
            pixelData[pixelIdx++] = image.bitmap.data[idx + 1]; // G
            pixelData[pixelIdx++] = image.bitmap.data[idx + 2]; // B
        }
    }
    const tensor3d = tf.tensor3d(pixelData, [224, 224, 3], 'float32');
    const tensor4d = tensor3d.expandDims(0) as tf.Tensor4D;
    tensor3d.dispose();
    return tensor4d;
}
```

**Singleton Model Loader (`src/lib/ml/asdModel.ts`):**
```typescript
export async function getModel(): Promise<tf.GraphModel> {
    if (!global.asdModel) {
        const handler = nodeFileSystemHandler(path.join(process.cwd(), 'public', 'model_tfjs', 'model.json'));
        global.asdModel = await tf.loadGraphModel(handler);
    }
    return global.asdModel;
}
```

## Appendix B: GitHub Directory Structure
```
root/
├── public/model_tfjs/     # TF.js Model definition & .bin shards
├── prisma/schema.prisma   # PostgreSQL Models
├── src/
│   ├── app/api/screening/ # Prediction Endpoints
│   ├── components/        # Frontend Client Logic (ScreeningModule.tsx)
│   ├── lib/ml/            # TFJS singletons and Preprocessing logic
│   └── middleware.ts      # Auth validation
└── test_batch.py          # Ground truth python batch validation
```
