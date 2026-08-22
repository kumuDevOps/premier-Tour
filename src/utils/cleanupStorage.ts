export function sanitizeLocalDatabase() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('premier_')) {
        const value = localStorage.getItem(key);
        if (value && value.includes('blob:')) {
          console.warn(`[Cleanup] Found blob URLs in ${key}. Sanitizing...`);
          try {
            let parsed = JSON.parse(value);
            const sanitize = (obj: any): any => {
              if (Array.isArray(obj)) {
                return obj.map(sanitize);
              } else if (obj !== null && typeof obj === 'object') {
                const newObj: any = {};
                for (const [k, v] of Object.entries(obj)) {
                  if (typeof v === 'string' && v.startsWith('blob:')) {
                    newObj[k] = ''; // Remove blob URL
                  } else {
                    newObj[k] = sanitize(v);
                  }
                }
                return newObj;
              }
              return obj;
            };
            
            const sanitized = sanitize(parsed);
            localStorage.setItem(key, JSON.stringify(sanitized));
          } catch (e) {
            console.error('Failed to parse or sanitize localStorage key', key, e);
          }
        }
      }
    }
  } catch (e) {
    console.error('Failed to sanitize localStorage', e);
  }
}
