"""
convert_model.py
One-time conversion of asd_model.h5 → TF.js LayersModel format.

Usage:
    python convert_model.py

Output:
    public/model_tfjs/model.json
    public/model_tfjs/group1-shard*.bin

Run this ONCE from the project root before starting the Next.js server.
"""

import os
import sys

def main():
    try:
        import tensorflowjs as tfjs
    except ImportError:
        print("ERROR: tensorflowjs not installed.")
        print("Please run: pip install tensorflow tensorflowjs")
        sys.exit(1)

    model_h5 = os.path.join(os.path.dirname(__file__), "asd_model.h5")
    output_dir = os.path.join(os.path.dirname(__file__), "public", "model_tfjs")

    if not os.path.exists(model_h5):
        print(f"ERROR: Model file not found: {model_h5}")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    print(f"[convert_model] Loading Keras model: {model_h5}")
    print("[convert_model] This may take 30–60 seconds for a 116MB model...")

    try:
        import tensorflow as tf
        model = tf.keras.models.load_model(model_h5, compile=False)
        print(f"[convert_model] Model loaded — input shape: {model.input_shape}")

        tfjs.converters.save_keras_model(model, output_dir)
        print(f"[convert_model] ✓ Conversion complete!")
        print(f"[convert_model] Output written to: {output_dir}")

        # Verify output
        model_json = os.path.join(output_dir, "model.json")
        if os.path.exists(model_json):
            print(f"[convert_model] ✓ model.json exists ({os.path.getsize(model_json)} bytes)")
            shards = [f for f in os.listdir(output_dir) if f.endswith(".bin")]
            print(f"[convert_model] ✓ {len(shards)} shard file(s) created")
        else:
            print("[convert_model] WARNING: model.json not found in output directory!")

    except Exception as e:
        print(f"[convert_model] ERROR: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
