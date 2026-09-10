---
title: "ASD Identification Platform — Viva and Technical Q&A"
---

# LIKELY VIVA / TECHNICAL QUESTIONS & ANSWERS

### Section A: Model & AI Questions

**Q1. How did you integrate the trained model into the web platform?**
**Answer:** "After training the model on Google Colab, we saved the Keras `asd_model.h5` file and converted it mathematically into a TensorFlow.js (TF.js) `GraphModel`. Inside our Next.js backend, we wrote an `asdModel.ts` singleton loader that runs exactly once when the server starts. It loads the `model.json` topology and 21 binary weight shards directly into NodeJS memory using a custom `nodeFileSystemHandler`. When a user uploads an image, the API (`POST /api/screening/image`) calls `model.predict()` in memory. It passes the image as a `[1, 224, 224, 3]` float32 tensor and receives a binary classification score wrapped instantly into a JSON response."

**Q2. Why did you choose EfficientNet-B4 specifically, and not B0 or B7?**
**Answer:** "EfficientNet uses compound scaling, which uniformly balances network depth, width, and image resolution. We opted for B4 because it hit the 'sweet spot'. B0 was fast but didn't extract enough fine-grained localized facial features from our `224x224` images, whereas B7 was massively over-parameterized and caused severe inference bottlenecks without GPU acceleration on a Node server. B4 provided optimal feature maps (`7x7x1792`) while remaining computationally lightweight."

**Q3. What is a Vision Transformer (ViT) and why did you use it alongside a CNN?**
**Answer:** "A Vision Transformer splits an image (or in our case, a CNN feature map) into localized patches, treating them like words in a sentence. It uses mechanisms called 'Self-Attention' to track complex global distances and relationships across the entire face—something a standard CNN struggles with due to its strict, local receptive fields. Combining the two ensures we get pixel-perfect local features from the CNN and holistic facial context from the ViT."

**Q4. How does the hybrid model combine EfficientNet-B4 and ViT outputs?**
**Answer:** "The frozen EfficientNet-B4 backbone generates a `7x7x1792` tensor output. We reshape this into a sequence of 49 tokens (patches). These tokens are linearly projected and fed into our Multi-Head Attention layer. The ViT globalizes the context, passing the output through a dense classification head parameterized with heavy Dropouts (0.5 and 0.4) and L2 regularization to prevent overfitting."

**Q5. What is the significance of 99.25% accuracy in medical screening?**
**Answer:** "While 99.25% accuracy is excellent, in medical screening, False Negatives are the true enemy—telling a parent their child is fine when they actually need help. That’s why we prioritized a Sensitivity (Recall) of 98.9%. Accuracy alone can be misleading if the dataset is imbalanced, but our high sensitivity confirms the model is extremely reliable at flagging actual ASD cases for clinical follow-up."

**Q6. What is ROC-AUC and why is 0.995 a strong result?**
**Answer:** "The Receiver Operating Characteristic (ROC) curve plots True Positive Rate versus False Positive Rate. AUC is the Area Under that Curve. A score of 0.995 mathematically demonstrates that if our model is given a random ASD face and a random Non-ASD face, there is a 99.5% probability it will correctly rank the ASD image as having a higher probability score. It proves the prediction threshold isn't just lucky—the underlying distribution mapping is highly accurate."

**Q7. How did you prevent overfitting during training?**
**Answer:** "We utilized several rigorous techniques. First, we leveraged Transfer Learning by freezing the EfficientNet ImageNet weights. At the classification head, we injected dense dropouts (0.5 and 0.4) combined with L2 regularization. Geometrically, we used `ImageDataGenerator` in Keras for heavy data augmentation—shearing, zooming, and flipping images so the model never memorizes the dataset. We also enforced an Early Stopping criteria monitoring validation loss."

**Q8. What activation function is used at the output layer and why?**
**Answer:** "We use a single-neuron output layer with a `sigmoid` activation function. Since this is a binary classification problem (ASD vs Non-ASD), the sigmoid function elegantly squashes the raw un-normalized output (logits) into a strict probability range between exactly `0.0` and `1.0`. We then threshold it at `0.5`."

**Q9. What loss function did you use and why?**
**Answer:** "We used Binary Cross-Entropy (BCE) Loss. Since our output is a single probability value, BCE mathematically penalizes the model based on the logarithmic distance between the predicted probability (e.g., 0.9) and the true label (1). It aggressively forces the model to be confident and correct, which is ideal for binary classes."

**Q10. What dataset did you use? How did you handle class imbalance?**
**Answer:** "We used the `Processed_ASD_Data_GroupSplit` dataset derived from Kaggle repositories. It consists of uniform frontal facial images curated into Class 0 ('ASD') and Class 1 ('Non-ASD'). We used standard undersampling configurations during data loading splits to ensure batch parity, maintaining an even 50/50 balance metric during the multi-epoch training."

---

### Section B: Web Platform / System Questions

**Q11. How does image data travel from the React frontend to the AI model?**
**Answer:** "On the frontend, the `ScreeningModule.tsx` component captures the user's image drop. It dynamically generates a Javascript `FormData` object, appends the image buffer, and uses Axios/Fetch to send a `POST` request. On the Next.js server side (`/api/screening/image`), the Node environment intercepts the multipart data, uses `jimp` to decode the buffer into an uncompressed array, and feeds it into the `global.asdModel.predict()` tensor engine."

**Q12. How did you handle CORS between React and Flask?**
**Answer:** "Since we built the entire platform using the Next.js App Router (where the API and frontend inhabit the absolute same domain and origin), strict CORS management between disparate ports (like 3000 to 5000) was entirely eliminated. Both the UI and backend run on the exact same origin, which drastically hardens the security pipeline."

**Q13. What is FastAPI / Flask and why did you choose it for the backend?**
**Answer:** "Initially, typical ML projects look to Flask. However, we specifically bypassed standard Python frameworks and deployed `@tensorflow/tfjs` entirely inside NodeJS/Next.js. This choice produced a monolithic 'Full-Stack' deployment avoiding brittle inter-language loopbacks, drastically reducing inference latency."

**Q14. How is the model loaded in the backend? Is it loaded on every request?**
**Answer:** "No, loading a 122MB graph model on every request would crush the server. We used the Singleton architectural pattern inside `asdModel.ts`. Check logical conditions verify if `global.asdModel` is instantiated. If not, it executes `tf.loadGraphModel` once during the cold-start and caches the weights inside Node’s persistent memory heap for all subsequent requests."

**Q15. What format does the backend return the prediction in?**
**Answer:** "It returns a tightly structured JSON response indicating the raw numerical score and string threshold tag. For example: `{ score: 0.166, prediction: "ASD Positive" }`."

**Q16. What preprocessing steps happen in the backend before model inference?**
**Answer:** "The server-side `preprocess.ts` file intercepts the buffer and reads it via `jimp` (which avoids native C bindings). We resize the image matrix to `224x224`. Crucially, we parse the raw RGB `[0-255]` pixel array directly into a `[1, 224, 224, 3]` tensor. Our TF.js GraphModel has an internal pre-processing node (`rescaling_1`) baked into its topography that natively executes the `/255` normalization."

**Q17. How did you make the platform mobile-responsive?**
**Answer:** "The React architecture leverages CSS Modules equipped with explicit flexible grid schemas and media queries. The dashboard uses dynamic viewport tracking (`vh/vw` constraints) to collapse sidebars and stack elements on standard mobile endpoints, maintaining the diagnostic accessibility for users without desktops."

**Q18. How does the heatmap/visual indicator on the result dashboard work?**
**Answer:** "The dashboard employs a dynamic, SVG-driven progress tracking threshold bar. It parses the likelihood floating-point confidence generated by the backend and uses strict React state logic to visually update the styling color mappings (Green vs. Red) and mathematical positioning along the HTML element track."

**Q19. What security measures did you implement?**
**Answer:** "We utilized isolated JWT Session encryption verified on every API hit restricting endpoint access heavily (e.g. only PATIENT roles can run inferences). For files, we validate the header bytes strictly verifying `image/jpeg` or `image/png` formats to stop script injection, capped at 5MB limits. Finally, processed images are wiped off the memory heap immediately via `tensor.dispose()` and are never saved to disks."

**Q20. Can this platform be used as a clinical diagnosis tool?**
**Answer:** "Absolutely not. This is strictly engineered as a non-invasive preliminary *screening* framework. The platform UI actively displays medical disclaimers dictating that output generated only highlights mathematical likelihoods, and any diagnosis must be legally and clinically formulated via an experienced healthcare professional."

---

### Section C: General CS / Project Questions

**Q21. What is transfer learning and how did you use it?**
**Answer:** "Transfer learning is taking knowledge (parameters) an AI learned from one massive task and applying it to a smaller, specific task. We initialized our EfficientNet-B4 backbone using pre-trained weights from ImageNet (trained on millions of generic images) and froze them, allowing our model to immediately recognize abstract lines, edges, and complex geometries before fine-tuning it specifically for ASD phenotypes."

**Q22. What is the difference between sensitivity and specificity?**
**Answer:** "Sensitivity (True Positive Rate) measures how well the model catches actual ASD cases without missing them (False Negatives). Specificity (True Negative Rate) handles how efficiently the model ignores Non-ASD cases. In a medical screening scenario, high Sensitivity is considered the most critical metric."

**Q23. Why is early diagnosis of ASD important?**
**Answer:** "The neurological plasticity of the human brain peaks incredibly high before age 3. Initiating behavioral and occupational therapy early allows clinicians to actively map and augment communication and structural behavior trajectories. Missing this window severely curtails lifelong intervention outcomes."

**Q24. What are the limitations of your project?**
**Answer:** "Currently, our dataset doesn’t hold perfect mappings across incredibly diverse geographic and severe ethnic groups. Additionally, it formulates binary (Yes/No) outputs instead of charting exact clinical severity grading (Mild, Moderate, Severe), and naturally requires verified field-testing deployment in Indian pediatric settings."

**Q25. What would you improve if you had 6 more months?**
**Answer:** "I would rapidly port the architecture into a multimodal format—where the system synchronously evaluates video-gaze tracking, speech cadence, and parents' textual M-CHAT survey responses. We would also attempt mapping the architecture down into TFLite structures to support full offline Edge Computing via mobile phones in rural communities lacking active bandwidth."
