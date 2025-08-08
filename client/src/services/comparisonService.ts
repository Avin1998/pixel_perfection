import axios from 'axios';
import { ComparisonResult, ComparisonOptions } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ComparisonService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async compareImages(
    designFile: File,
    implementationFile: File,
    options: ComparisonOptions = {}
  ): Promise<ComparisonResult> {
    try {
      const formData = new FormData();
      formData.append('designImage', designFile);
      formData.append('implementationImage', implementationFile);
      formData.append('options', JSON.stringify(options));

      const response = await axios.post(
        `${this.baseURL}/comparison/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 second timeout
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Comparison failed: ${message}`);
      }
      throw new Error('An unexpected error occurred during comparison');
    }
  }

  async compareWithUrl(
    designFile: File,
    url: string,
    options: ComparisonOptions = {}
  ): Promise<ComparisonResult> {
    try {
      const formData = new FormData();
      formData.append('designImage', designFile);
      formData.append('url', url);
      formData.append('options', JSON.stringify(options));

      const response = await axios.post(
        `${this.baseURL}/comparison/url`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 120000, // 2 minute timeout for URL screenshots
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`URL comparison failed: ${message}`);
      }
      throw new Error('An unexpected error occurred during URL comparison');
    }
  }

  async getComparisonHistory(): Promise<ComparisonResult[]> {
    try {
      const response = await axios.get(`${this.baseURL}/comparison/history`);
      return response.data.comparisons || [];
    } catch (error) {
      console.error('Failed to fetch comparison history:', error);
      return [];
    }
  }

  async deleteComparison(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/comparison/${id}`);
    } catch (error) {
      console.error('Failed to delete comparison:', error);
      throw new Error('Failed to delete comparison');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL.replace('/api', '')}/api/health`);
      return response.data.status === 'OK';
    } catch (error) {
      return false;
    }
  }
}

export const comparisonService = new ComparisonService();