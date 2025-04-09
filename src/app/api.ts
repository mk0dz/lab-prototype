/**
 * API utilities for connecting to the backend
 */

// Use the correct port for the backend
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Generic fetch function with error handling
 */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    console.log(`API Request: ${endpoint}`, options.body ? JSON.parse(options.body as string) : '');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('API Error Response:', errorData);
      
      // Handle detailed validation errors
      if (response.status === 422 && errorData.detail) {
        let errorMessage = 'Validation error: ';
        
        // Handle Pydantic validation errors (array of errors)
        if (Array.isArray(errorData.detail)) {
          errorMessage += errorData.detail.map((err: any) => 
            `${err.loc.join('.')}: ${err.msg}`
          ).join('; ');
        } else {
          errorMessage += JSON.stringify(errorData.detail);
        }
        
        throw new Error(errorMessage);
      }
      
      throw new Error(errorData.message || errorData.detail || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Systems API functions
 */
export const systemsApi = {
  // Get all available quantum systems
  getSystems: () => fetchApi<any>('/systems'),
  
  // Get a specific quantum system by ID
  getSystem: (systemId: string) => fetchApi<any>(`/systems/${systemId}`),
  
  // Get all available basis sets
  getBasisSets: () => fetchApi<any>('/basis-sets'),
  
  // Get all available experiment types
  getExperimentTypes: () => fetchApi<any>('/experiment-types'),
};

/**
 * Experiments API functions
 */
export const experimentsApi = {
  // Create a new experiment
  createExperiment: (data: any) => fetchApi<any>('/experiments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Get all experiments
  getExperiments: () => fetchApi<any>('/experiments'),
  
  // Get a specific experiment by ID
  getExperiment: (experimentId: number) => fetchApi<any>(`/experiments/${experimentId}`),
  
  // Run an experiment
  runExperiment: (experimentId: number) => fetchApi<any>(`/experiments/${experimentId}/run`, {
    method: 'POST',
  }),
  
  // Estimate resources for an experiment
  estimateResources: (systemId: string, configuration: any) => fetchApi<any>('/estimate-resources', {
    method: 'POST',
    body: JSON.stringify({ system_id: systemId, configuration }),
  }),
};

/**
 * Results API functions
 */
export const resultsApi = {
  // Get all experiment results
  getResults: () => fetchApi<any>('/results'),
  
  // Get a specific result by ID
  getResult: (resultId: number) => fetchApi<any>(`/results/${resultId}`),
  
  // Get all results for a specific experiment
  getExperimentResults: (experimentId: number) => fetchApi<any>(`/experiments/${experimentId}/results`),
  
  // Get detailed information about a result
  getResultDetails: (resultId: number) => fetchApi<any>(`/results/${resultId}/details`),
};

export default {
  systems: systemsApi,
  experiments: experimentsApi,
  results: resultsApi,
}; 