export const STORAGE_DISCLAIMER =
  'All data is stored purely within your local browser storage. LifeTools never syncs, transmits, or uploads personal records to external servers. Clearing your browser cache or site data will remove saved local records. We recommend exporting regular backups for important data.';

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },

  getItem<T>(key: string, defaultValue: T): T {
    return this.get<T>(key, defaultValue);
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    return this.set<T>(key, value);
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },

  clearPrefix(prefix: string): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  },

  exportToCsv(filename: string, headers: string[], rows: (string | number | boolean)[][]): void {
    const escapeCsv = (val: string | number | boolean) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headerLine = headers.map(escapeCsv).join(',');
    const dataLines = rows.map(r => r.map(escapeCsv).join(','));
    const csvContent = '\uFEFF' + [headerLine, ...dataLines].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportToJson(filename: string, data: any): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  downloadFile(filename: string, content: Blob | Uint8Array | string, mimeType: string): void {
    const blob = content instanceof Blob ? content : new Blob([content as any], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const safeStorage = storage;

export const exportToCsv = (
  dataOrFilename: Record<string, any>[] | string,
  headersOrFilename?: string[] | string,
  rowsOptional?: (string | number | boolean)[][]
): void => {
  if (Array.isArray(dataOrFilename) && typeof headersOrFilename === 'string') {
    // Array of objects format: exportToCsv(objects, 'filename')
    const objects = dataOrFilename;
    const filename = headersOrFilename;
    if (objects.length === 0) return;
    const headers = Object.keys(objects[0]);
    const rows = objects.map(obj => headers.map(h => obj[h]));
    storage.exportToCsv(filename, headers, rows);
  } else if (typeof dataOrFilename === 'string' && Array.isArray(headersOrFilename) && Array.isArray(rowsOptional)) {
    // Standard format: exportToCsv(filename, headers, rows)
    storage.exportToCsv(dataOrFilename, headersOrFilename, rowsOptional);
  }
};

export const exportToJson = storage.exportToJson;
export const downloadFile = storage.downloadFile;
