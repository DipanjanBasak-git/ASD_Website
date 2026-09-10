"""
ASD Questionnaire Inference Microservice
=========================================
Flask server that loads ASD_Model_Package.pkl (joblib) and serves
questionnaire-based ASD predictions at POST /infer.

Encoding (derived from imputer statistics and training data analysis):
  Gender: Male=0, Female=1
  Y/N fields: Y=1, N=0 (any string starting with Y case-insensitive = 1)
  Age, Diagnosed (in yrs): numeric (float)

The model was trained on Mild vs Moderate ISAA cases only.
label_encoder.classes_ = ['Mild', 'Moderate']
"""

import os
import sys
import json
import logging
import numpy as np

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [QModel] %(levelname)s: %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

# ── Load model at startup ─────────────────────────────────────────────────────
PKL_PATH = os.path.join(os.path.dirname(__file__), '..', 'asd_savedmodel', 'ASD_Model_Package.pkl')
PKL_PATH = os.path.normpath(PKL_PATH)

logger.info(f"Loading questionnaire model from: {PKL_PATH}")

try:
    import joblib
    import warnings
    warnings.filterwarnings('ignore')
    
    package = joblib.load(PKL_PATH)
    
    MODEL = package['model']
    LABEL_ENCODER = package['label_encoder']
    FEATURE_ORDER = package['feature_order']
    IMPUTER = package['imputer']
    
    logger.info(f"Model loaded: {type(MODEL).__name__}")
    logger.info(f"Features ({len(FEATURE_ORDER)}): {FEATURE_ORDER}")
    logger.info(f"Classes: {LABEL_ENCODER.classes_}")
    logger.info(f"RF classes: {MODEL.classes_}")
    
except Exception as e:
    logger.error(f"FATAL: Failed to load model: {e}")
    sys.exit(1)

# ── Feature encoding ──────────────────────────────────────────────────────────
GENDER_MAP = {'male': 0, 'female': 1, 'm': 0, 'f': 1}

def encode_yn(value):
    """
    Encode Y/N field to 0 or 1.
    Any string starting with 'y' (case-insensitive) → 1
    Any string starting with 'n' (case-insensitive) → 0
    None / empty → np.nan (will be imputed)
    """
    if value is None:
        return np.nan
    s = str(value).strip().lower()
    if not s:
        return np.nan
    if s.startswith('y'):
        return 1.0
    if s.startswith('n'):
        return 0.0
    # Try numeric
    try:
        return float(s)
    except ValueError:
        return np.nan

def encode_features(raw):
    """
    Encode raw questionnaire input dict to numeric feature vector.
    
    Expected raw keys (case-insensitive matching):
      age, gender, hyperactive, responsive, epilepsy,
      diagnosed, color_recognize, emotional_response,
      head_injury, speech, eye_contact
    
    Returns: np.array of shape (1, 11) in FEATURE_ORDER
    """
    # Normalize keys
    key_map = {
        'Age': float(raw.get('age', np.nan)),
        'Gender': GENDER_MAP.get(str(raw.get('gender', '')).strip().lower(), np.nan),
        'Hyperactive (Y/N)': encode_yn(raw.get('hyperactive')),
        'Responsive (Y/N)': encode_yn(raw.get('responsive')),
        'Epilepsy History (Y/N)': encode_yn(raw.get('epilepsy')),
        'Diagnosed (in yrs)': float(raw.get('diagnosed', np.nan)),
        'Color recognize (y/n)': encode_yn(raw.get('color_recognize')),
        'emotional Response(y/n)': encode_yn(raw.get('emotional_response')),
        'Head Injury': encode_yn(raw.get('head_injury')),
        'Speech': encode_yn(raw.get('speech')),
        'Eye Contact': encode_yn(raw.get('eye_contact')),
    }
    
    vec = np.array([[key_map[f] for f in FEATURE_ORDER]], dtype=np.float64)
    return vec

# ── Flask app ─────────────────────────────────────────────────────────────────
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': type(MODEL).__name__})

@app.route('/infer', methods=['POST'])
def infer():
    """
    POST /infer
    Body: JSON with questionnaire answers
    Returns: { prediction, confidence, probabilities, classes }
    """
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'error': 'No JSON body provided'}), 400
        
        logger.info(f"Inference request: {data}")
        
        # Encode features
        X = encode_features(data)
        logger.info(f"Encoded features: {X}")
        
        # Validate — check all NaN
        non_nan = np.sum(~np.isnan(X))
        if non_nan == 0:
            return jsonify({'error': 'All features are missing or invalid'}), 400
        
        # Apply imputer (fills NaN with training medians)
        X_imputed = IMPUTER.transform(X)
        logger.info(f"Imputed features: {X_imputed}")
        
        # Predict
        raw_pred = MODEL.predict(X_imputed)          # [0] or [1]
        proba = MODEL.predict_proba(X_imputed)        # [[P(Mild), P(Moderate)]]
        
        # Decode label
        label = LABEL_ENCODER.inverse_transform(raw_pred)[0]
        
        # Confidence = probability of predicted class
        pred_idx = int(raw_pred[0])
        confidence = float(proba[0][pred_idx])
        
        result = {
            'prediction': label,           # 'Mild' or 'Moderate'
            'confidence': confidence,       # float [0, 1]
            'probabilities': {
                str(cls): float(p)
                for cls, p in zip(LABEL_ENCODER.classes_, proba[0])
            },
            'raw_class_index': int(raw_pred[0]),
            'classes': list(LABEL_ENCODER.classes_),
        }
        
        logger.info(f"Result: {result}")
        return jsonify(result)
        
    except ValueError as e:
        logger.error(f"ValueError in inference: {e}")
        return jsonify({'error': f'Feature encoding error: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"Inference error: {e}", exc_info=True)
        return jsonify({'error': 'Model inference failed'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('QUESTIONNAIRE_MODEL_PORT', 5001))
    logger.info(f"Starting questionnaire inference service on port {port}")
    # threaded=False to avoid sklearn thread safety issues
    app.run(host='127.0.0.1', port=port, threaded=False, debug=False)
