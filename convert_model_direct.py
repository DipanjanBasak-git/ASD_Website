"""
convert_model_direct.py

Converts asd_model.h5 to TF.js LayersModel format by:
1. Loading the Keras H5 model
2. Exporting to SavedModel format
3. Using tensorflowjs_converter CLI (which doesn't require the full tfjs Python import chain)

Run: .\\tfenv\\Scripts\\python.exe convert_model_direct.py
"""

import os
import sys
import subprocess
import tensorflow as tf

MODEL_H5 = os.path.join(os.path.dirname(os.path.abspath(__file__)), "asd_model.h5")
SAVEDMODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "asd_savedmodel")
TFJS_OUTPUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "model_tfjs")

print(f"[Step 1] Loading Keras model: {MODEL_H5}")
model = tf.keras.models.load_model(MODEL_H5, compile=False)
print(f"  Input shape : {model.input_shape}")
print(f"  Output shape: {model.output_shape}")

print(f"\n[Step 2] Exporting to SavedModel: {SAVEDMODEL_DIR}")
tf.saved_model.save(model, SAVEDMODEL_DIR)
print("  SavedModel export done.")

print(f"\n[Step 3] Converting SavedModel → TF.js")
os.makedirs(TFJS_OUTPUT, exist_ok=True)

converter_path = os.path.join(
    os.path.dirname(sys.executable), "tensorflowjs_converter"
)

cmd = [
    sys.executable, "-m", "tensorflowjs.converters.converter",
    "--input_format", "tf_saved_model",
    "--output_format", "tfjs_graph_model",
    SAVEDMODEL_DIR,
    TFJS_OUTPUT,
]

print(f"  Running: {' '.join(cmd)}")
result = subprocess.run(cmd, capture_output=True, text=True)
print(result.stdout)
if result.returncode != 0:
    print("  ERROR:", result.stderr[-2000:])
    sys.exit(1)

# Verify
model_json = os.path.join(TFJS_OUTPUT, "model.json")
if os.path.exists(model_json):
    shards = [f for f in os.listdir(TFJS_OUTPUT) if f.endswith(".bin")]
    print(f"\n✓ Conversion complete!")
    print(f"  model.json: {os.path.getsize(model_json):,} bytes")
    print(f"  Shard files: {len(shards)}")
    print(f"  Output: {TFJS_OUTPUT}")
else:
    print("\nERROR: model.json not found in output.")
    sys.exit(1)
