"""
Fake News Detection ML Microservice

FastAPI server that loads a trained model and exposes prediction endpoints.
Falls back to heuristic analysis if no trained model is available.
"""

import os
import re
import logging
from contextlib import asynccontextmanager

import joblib
import nltk
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
stemmer = PorterStemmer()
stop_words = set(stopwords.words('english'))

# Global model references
model = None
vectorizer = None


def preprocess_text(text: str) -> str:
    """Clean and preprocess text for model input."""
    if not isinstance(text, str):
        return ''
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    words = text.split()
    words = [stemmer.stem(w) for w in words if w not in stop_words and len(w) > 2]
    return ' '.join(words)


def load_model():
    """Load trained model and vectorizer."""
    global model, vectorizer

    model_path = os.path.join(MODELS_DIR, 'fake_news_model.joblib')
    vectorizer_path = os.path.join(MODELS_DIR, 'tfidf_vectorizer.joblib')

    if os.path.exists(model_path) and os.path.exists(vectorizer_path):
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        logger.info('Trained model loaded successfully.')
        return True
    else:
        logger.warning('No trained model found. Service will use heuristic analysis.')
        logger.warning('Run train_model.py first to train the ML model.')
        return False


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield


app = FastAPI(
    title='Fake News Detection ML Service',
    description='AI-powered fake news detection microservice',
    version='1.0.0',
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


# --- Schemas ---
class PredictionRequest(BaseModel):
    text: str = Field(..., min_length=10, description='News text to analyze')


class CredibilityIndicators(BaseModel):
    hasClickbait: bool = False
    hasEmotionalLanguage: bool = False
    hasSourceAttribution: bool = False
    hasStatisticalClaims: bool = False
    readabilityScore: float = 0.0


class PredictionDetails(BaseModel):
    sentimentScore: float = 0.0
    subjectivityScore: float = 0.0
    credibilityIndicators: CredibilityIndicators = CredibilityIndicators()


class PredictionResponse(BaseModel):
    label: str
    confidence: float
    details: PredictionDetails
    model_used: str


# --- Heuristic fallback ---
CLICKBAIT_PATTERNS = [
    r'you won\'t believe', r'shocking', r'mind-blowing', r'what happens next',
    r'exposed', r'secret', r'they don\'t want you to know', r'breaking',
    r'unbelievable', r'jaw-dropping',
]

EMOTIONAL_WORDS = {
    'outrage', 'fury', 'terrifying', 'devastating', 'horrifying',
    'incredible', 'amazing', 'disgusting', 'destroy', 'catastrophe',
    'crisis', 'panic', 'fear', 'hate', 'miracle', 'nightmare',
    'scandal', 'chaos', 'explosive', 'bombshell',
}


def heuristic_predict(text: str) -> dict:
    """Fallback heuristic-based prediction when no ML model is available."""
    text_lower = text.lower()
    words = text_lower.split()
    word_count = len(words)

    score = 50  # baseline credibility

    # Clickbait detection
    has_clickbait = any(re.search(p, text_lower) for p in CLICKBAIT_PATTERNS)
    if has_clickbait:
        score -= 15

    # Emotional language
    emotional_count = sum(1 for w in words if w in EMOTIONAL_WORDS)
    has_emotional = emotional_count >= 2
    if has_emotional:
        score -= 10

    # Source attribution
    source_patterns = [
        r'according to', r'reported by', r'study shows', r'research finds',
        r'officials said', r'spokesperson', r'published in',
    ]
    has_source = any(re.search(p, text_lower) for p in source_patterns)
    if has_source:
        score += 15

    # Statistical claims
    has_stats = bool(re.search(r'\d+(\.\d+)?%|\d+ percent|\$[\d,.]+', text))
    if has_stats and has_source:
        score += 10

    # Caps and exclamation
    caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
    if caps_ratio > 0.3:
        score -= 10
    excl_count = text.count('!')
    if excl_count > 3:
        score -= 5

    # Short text penalty
    if word_count < 50:
        score -= 10

    score = max(0, min(100, score))

    if score >= 60:
        label = 'REAL'
        confidence = min(95, score + 10)
    elif score <= 35:
        label = 'FAKE'
        confidence = min(95, (100 - score) + 5)
    else:
        label = 'UNCERTAIN'
        confidence = 50 + abs(score - 50)

    return {
        'label': label,
        'confidence': round(confidence, 2),
        'details': {
            'sentimentScore': 0,
            'subjectivityScore': 0,
            'credibilityIndicators': {
                'hasClickbait': has_clickbait,
                'hasEmotionalLanguage': has_emotional,
                'hasSourceAttribution': has_source,
                'hasStatisticalClaims': has_stats,
                'readabilityScore': min(100, max(0, word_count * 0.5)),
            },
        },
        'model_used': 'heuristic',
    }


# --- Endpoints ---
@app.get('/health')
async def health():
    return {
        'status': 'healthy',
        'model_loaded': model is not None,
    }


@app.post('/predict', response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    text = request.text.strip()

    if len(text) < 10:
        raise HTTPException(status_code=400, detail='Text is too short for analysis')

    if model is not None and vectorizer is not None:
        try:
            processed = preprocess_text(text)
            features = vectorizer.transform([processed])
            prediction = model.predict(features)[0]
            probabilities = model.predict_proba(features)[0]

            label = 'FAKE' if prediction == 1 else 'REAL'
            confidence = round(float(np.max(probabilities)) * 100, 2)

            if confidence < 55:
                label = 'UNCERTAIN'

            # Run heuristic for additional details
            heuristic = heuristic_predict(text)

            return {
                'label': label,
                'confidence': confidence,
                'details': heuristic['details'],
                'model_used': 'ensemble_ml',
            }
        except Exception as e:
            logger.error(f'ML prediction failed: {e}')
            result = heuristic_predict(text)
            result['model_used'] = 'heuristic_fallback'
            return result
    else:
        return heuristic_predict(text)


@app.get('/model/info')
async def model_info():
    return {
        'model_loaded': model is not None,
        'model_type': type(model).__name__ if model else None,
        'vectorizer_loaded': vectorizer is not None,
    }


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('app:app', host='0.0.0.0', port=8000, reload=True)
