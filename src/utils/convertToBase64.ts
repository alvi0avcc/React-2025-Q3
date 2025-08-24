export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('File read resulted in non-string data'));
      }
    });

    reader.addEventListener('error', event => {
      const target = event.target;
      const error = target instanceof FileReader ? target.error : null;
      reject(new Error('File read error', { cause: error }));
    });

    reader.readAsDataURL(file);
  });
};
