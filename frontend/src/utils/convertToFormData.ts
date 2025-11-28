export function toFormData(payload: Record<string, any>): FormData {
    const fd = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        // If file
        if (value instanceof File || value instanceof Blob) {
            fd.append(key, value);
            return;
        }

        // Arrays → append each item
        if (Array.isArray(value)) {
            value.forEach((item) => {
                fd.append(`${key}[]`, item instanceof File ? item : String(item));
            });
            return;
        }

        // Booleans, numbers → string
        fd.append(key, String(value));
    });

    return fd;
}
