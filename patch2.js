const fs = require('fs');
const file = 'src/services/api.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
`async function safeFetch<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const json = await res.json();
      return json;
    }

    // Server returned HTML or text (e.g. 404, 500 error page)
    const text = await res.text();
    return {
      success: false,
      error: \`Server returned non-JSON response (\${res.status}): \${text.slice(0, 120)}...\`,
      message: \`Request failed with HTTP \${res.status}\`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network request failed',
      message: 'Network request failed'
    };
  }
}`,
`async function safeFetch<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    console.log('Fetching:', url, options?.method || 'GET');
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    console.log('Response status:', res.status, 'Content-Type:', contentType);
    
    if (contentType.includes('application/json')) {
      const json = await res.json();
      console.log('Response JSON:', json);
      return json;
    }

    // Server returned HTML or text (e.g. 404, 500 error page)
    const text = await res.text();
    console.log('Response text:', text.substring(0, 100));
    return {
      success: false,
      error: \`Server returned non-JSON response (\${res.status}): \${text.slice(0, 120)}...\`,
      message: \`Request failed with HTTP \${res.status}\`,
    };
  } catch (err: any) {
    console.error('Fetch error:', err);
    return {
      success: false,
      error: err?.message || 'Network request failed',
      message: 'Network request failed'
    };
  }
}`
);
fs.writeFileSync(file, content);
console.log('Patched safeFetch');
