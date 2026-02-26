"""
ASD Model Batch Inference Test
================================
Tests the .h5 model directly against known ASD and Non-ASD images from the dataset.
This validates the model's raw behavior WITHOUT the website pipeline.

Training configuration (verified from notebook):
  - ImageDataGenerator(rescale=1./255) → input range [0, 1]
  - class_mode='binary', class_indices: {'ASD': 0, 'Non-ASD': 1}
  - Loss: binary_crossentropy, Output: sigmoid (1 neuron)
  - Score → 0 means ASD, Score → 1 means Non-ASD

Usage:
  Activate your tfenv venv, then run:
    python test_batch.py

  Make sure you have TensorFlow installed in the active environment.
"""

import os
import numpy as np
import glob

# ── Configuration ──────────────────────────────────────────────────────────────
MODEL_PATH = r"C:\Users\Dipanjan\OneDrive\Desktop\ASD Website\asd_model.h5"

# Dataset base path — adjust if yours differs
DATASET_BASE = r"C:\Users\Dipanjan\OneDrive\Desktop\ASD Website\Processed_ASD_Data_GroupSplit"
# Fallback paths to try
POSSIBLE_BASES = [
    DATASET_BASE,
    r"C:\Users\Dipanjan\Downloads\Processed_ASD_Data_GroupSplit",
    r"C:\Users\Dipanjan\OneDrive\Desktop\Processed_ASD_Data_GroupSplit",
]

IMG_SIZE = (224, 224)
SAMPLES_PER_CLASS = 5

# ── Load Model ─────────────────────────────────────────────────────────────────
print("=" * 60)
print("ASD Model Batch Inference Test")
print("=" * 60)
print(f"\nModel path: {MODEL_PATH}")

try:
    import tensorflow as tf
    from tensorflow.keras.preprocessing.image import load_img, img_to_array

    print(f"TensorFlow version: {tf.__version__}")
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("✓ Model loaded successfully")
    print(f"  Input shape: {model.input_shape}")
    print(f"  Output shape: {model.output_shape}")
    print(f"  Output activation: {model.layers[-1].activation.__name__}")
except ImportError:
    print("ERROR: TensorFlow not installed. Activate your tfenv virtual environment:")
    print("  .\\tfenv\\Scripts\\activate")
    print("  pip install tensorflow")
    raise
except Exception as e:
    print(f"ERROR loading model: {e}")
    raise

# ── Find Dataset ───────────────────────────────────────────────────────────────
dataset_base = None
for base in POSSIBLE_BASES:
    train_path = os.path.join(base, "Train", "ASD")
    if not os.path.exists(train_path):
        train_path = os.path.join(base, "train", "ASD")
    if os.path.exists(train_path):
        dataset_base = base
        break

if dataset_base is None:
    print("\n⚠️  Dataset not found locally. Please set DATASET_BASE in this script.")
    print("    Tested paths:")
    for b in POSSIBLE_BASES:
        print(f"      {b}")
    print("\nRunning with dummy data instead (pixel values only, no path validation)...")
    USE_DUMMY = True
else:
    USE_DUMMY = False
    print(f"\nDataset found: {dataset_base}")


# ── Predict Function ────────────────────────────────────────────────────────────
def predict_image_h5(img_path: str) -> dict:
    """Predict a single image using the .h5 model."""
    # Load and preprocess exactly as training:
    # ImageDataGenerator(rescale=1./255) does /255 before feeding to model
    img = load_img(img_path, target_size=IMG_SIZE)
    arr = img_to_array(img)           # [0-255] float32
    arr = arr / 255.0                  # rescale to [0-1] — matches ImageDataGenerator
    arr = np.expand_dims(arr, axis=0)  # [1, 224, 224, 3]

    raw_score = model.predict(arr, verbose=0)[0][0]

    prob_non_asd = float(raw_score)   # P(Non-ASD) — since Non-ASD=1
    prob_asd     = 1.0 - raw_score    # P(ASD)    — since ASD=0

    predicted_class = "Non-ASD" if raw_score >= 0.5 else "ASD"

    return {
        "path": os.path.basename(img_path),
        "raw_score": raw_score,
        "P_ASD": prob_asd,
        "P_NonASD": prob_non_asd,
        "predicted": predicted_class,
    }


# ── Collect Test Images ─────────────────────────────────────────────────────────
def get_images(cls_name: str, n: int) -> list:
    """Get up to n images from a class folder (tries Train and Test)."""
    exts = ["*.jpg", "*.jpeg", "*.png", "*.JPG", "*.PNG"]
    for split in ["Train", "train", "Test", "test"]:
        folder = os.path.join(dataset_base, split, cls_name)
        if not os.path.exists(folder):
            continue
        imgs = []
        for ext in exts:
            imgs += glob.glob(os.path.join(folder, ext))
        if imgs:
            return sorted(imgs)[:n]
    return []


# ── Run Tests ──────────────────────────────────────────────────────────────────
CLASSES = {"ASD": "ASD", "Non-ASD": "Non-ASD"}

print("\n" + "=" * 60)
print("BATCH TEST RESULTS")
print("=" * 60)

if USE_DUMMY:
    # Generate synthetic images to at least test the inference path
    print("\n[Using synthetic images — 128x128 gray patch, resized to 224x224]\n")
    import cv2, tempfile

    results = []
    for cls, expected in [("ASD (dummy)", "ASD"), ("Non-ASD (dummy)", "Non-ASD")]:
        print(f"{'─'*40}")
        print(f"TRUE CLASS: {cls}")
        print(f"{'─'*40}")
        for i in range(SAMPLES_PER_CLASS):
            # Random pixel values per "class" — just tests the pipeline works
            pixels = np.random.randint(50, 200, (224, 224, 3), dtype=np.uint8)
            arr = pixels.astype(np.float32)[np.newaxis] / 255.0
            raw_score = model.predict(arr, verbose=0)[0][0]
            prob_asd = 1.0 - raw_score
            prob_nsd = raw_score
            pred = "Non-ASD" if raw_score >= 0.5 else "ASD"
            result_mark = "✓" if pred == expected else "✗"
            print(f"  Sample {i+1}: raw={raw_score:.4f}  P(ASD)={prob_asd*100:.1f}%  P(Non-ASD)={prob_nsd*100:.1f}%  → {pred} {result_mark}")
else:
    all_correct = 0
    all_total = 0

    for cls_name, true_label in [("ASD", "ASD"), ("Non-ASD", "Non-ASD")]:
        imgs = get_images(cls_name, SAMPLES_PER_CLASS)
        if not imgs:
            print(f"⚠️  No images found for class '{cls_name}'")
            continue

        print(f"\n{'─'*60}")
        print(f"TRUE CLASS: {cls_name}  ({len(imgs)} images tested)")
        print(f"{'─'*60}")

        class_correct = 0
        for img_path in imgs:
            r = predict_image_h5(img_path)
            correct = r["predicted"] == true_label
            mark = "✓" if correct else "✗"
            if correct:
                class_correct += 1
            print(f"  {mark} {r['path'][:45]:45s}  raw={r['raw_score']:.4f}  "
                  f"P(ASD)={r['P_ASD']*100:.1f}%  P(Non-ASD)={r['P_NonASD']*100:.1f}%  → {r['predicted']}")
        
        all_correct += class_correct
        all_total += len(imgs)
        print(f"  Class accuracy: {class_correct}/{len(imgs)} = {class_correct/len(imgs)*100:.0f}%")


    print("\n" + "=" * 60)
    print(f"OVERALL: {all_correct}/{all_total} correct ({all_correct/all_total*100:.0f}%)")
    print("=" * 60)
    print()
    print("Expected output if model is working correctly:")
    print("  - ASD images: raw score close to 0, P(ASD) > 50%")
    print("  - Non-ASD images: raw score close to 1, P(Non-ASD) > 50%")
    print()

    if all_total > 0 and all_correct / all_total < 0.5:
        print("⚠️  WARNING: Accuracy < 50% — This may indicate:")
        print("   1. Label mapping is inverted (try flipping probASD/probNonASD)")
        print("   2. Model did not generalize well (training issue, not pipeline)")
        print("   3. Test images have different characteristics than training data")
    else:
        print("✓ Model is classifying as expected — pipeline is correct!")

print("\nDone.")
