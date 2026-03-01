import yaml from 'js-yaml';
import { AlgorithmMetadata } from '../types/pattern';

export function parseAlgorithmMetadata(
  filepath: string,
  content: string
): AlgorithmMetadata {
  try {
    const data = yaml.load(content) as AlgorithmMetadata;

    // Validate required fields
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid YAML structure');
    }

    if (!data.name || !data.slug || !data.category) {
      throw new Error('Missing required fields: name, slug, and category are required');
    }

    // Ensure patterns is an array
    if (!data.patterns) {
      data.patterns = [];
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to parse ${filepath}: ${error}`);
  }
}
