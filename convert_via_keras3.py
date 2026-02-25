"""
convert_via_keras3.py

Converts asd_model.h5 to TF.js format using Keras 3 + tensorflowjs_converter CLI.

The model was saved with a newer Keras (3+), so we use keras.saving directly.

Run: .\\tfenv\\Scripts\\python.exe convert_via_keras3.py
"""

import os
import sys
import subprocess

MODEL_H5 = "asd_model.h5"
SAVEDMODEL_DIR = "asd_savedmodel"
TFJS_OUTPUT = os.path.join("public", "model_tfjs")

print(f"[Step 1] Loading model using keras.saving.load_model: {MODEL_H5}")
try:
    import keras
    print(f"  keras version: {keras.__version__}")
    model = keras.saving.load_model(MODEL_H5, compile=False)
    print(f"  Input shape : {model.input_shape}")
    print(f"  Output shape: {model.output_shape}")
except Exception as e:
    print(f"  keras load failed: {e}")
    print("  Trying tf.keras fallback...")
    import tensorflow as tf
    # Use custom_object_scope to handle batch_shape
    from tensorflow.python.keras import backend as K
    model = tf.keras.models.load_model(MODEL_H5, compile=False, custom_objects={})
    print(f"  Input shape : {model.input_shape}")

print(f"\n[Step 2] Saving as SavedModel: {SAVEDMODEL_DIR}")
import tensorflow as tf
tf.saved_model.save(model, SAVEDMODEL_DIR)
print("  Done.")

print(f"\n[Step 3] Converting to TF.js GraphModel via CLI")
os.makedirs(TFJS_OUTPUT, exist_ok=True)
converter = os.path.join(os.path.dirname(sys.executable), "tensorflowjs_converter")

cmd = [
    converter,
    "--input_format", "tf_saved_model",
    "--output_format", "tfjs_graph_model",
    SAVEDMODEL_DIR,
    TFJS_OUTPUT,
]
print(f"  CMD: {' '.join(cmd)}")
r = subprocess.run(cmd, capture_output=True, text=True)
print(r.stdout)
if r.returncode != 0:
    print("STDERR:", r.stderr[-3000:])
    sys.exit(1)

model_json = os.path.join(TFJS_OUTPUT, "model.json")
if os.path.exists(model_json):
    shards = [f for f in os.listdir(TFJS_OUTPUT) if f.endswith(".bin")]
    sz = os.path.getsize(model_json)
    print(f"\n✓ model.json ready ({sz:,} bytes), {len(shards)} shard(s).")
else:
    print("ERROR: model.json missing.")
    sys.exit(1)
