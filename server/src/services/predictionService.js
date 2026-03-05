const fetch = require('node-fetch');
const logger = require('../utils/logger');
const NLPAnalyzer = require('./nlpAnalyzer');

class PredictionService {
  /**
   * Get prediction from ML microservice or fallback to NLP analysis
   */
  static async predict(text) {
    try {
      // Try ML microservice first
      const mlResult = await this.callMLService(text);
      if (mlResult) {
        return mlResult;
      }
    } catch (error) {
      logger.warn(
        'ML service unavailable, falling back to NLP analysis:',
        error.message
      );
    }

    // Fallback to built-in NLP analysis
    return NLPAnalyzer.analyze(text);
  }

  static async callMLService(text) {
    const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${mlUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`ML service returned ${response.status}`);
      }

      const data = await response.json();
      return {
        label: data.label,
        confidence: data.confidence,
        details: data.details || NLPAnalyzer.analyze(text).details,
      };
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  }
}

module.exports = PredictionService;
