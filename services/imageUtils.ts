
import { HistogramData, ProcessedChannels } from '../types';

export const processImage = async (file: File): Promise<ProcessedChannels> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return reject('Could not create canvas context');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = imageData;

        const results: Partial<ProcessedChannels> = {
          original: canvas.toDataURL(),
        };

        // Red Channel
        const redData = new Uint8ClampedArray(data);
        for (let i = 0; i < redData.length; i += 4) {
          redData[i + 1] = 0; // G
          redData[i + 2] = 0; // B
        }
        results.red = createDataURL(redData, width, height);

        // Green Channel
        const greenData = new Uint8ClampedArray(data);
        for (let i = 0; i < greenData.length; i += 4) {
          greenData[i] = 0;   // R
          greenData[i + 2] = 0; // B
        }
        results.green = createDataURL(greenData, width, height);

        // Blue Channel
        const blueData = new Uint8ClampedArray(data);
        for (let i = 0; i < blueData.length; i += 4) {
          blueData[i] = 0;   // R
          blueData[i + 1] = 0; // G
        }
        results.blue = createDataURL(blueData, width, height);

        // Grayscale
        const grayData = new Uint8ClampedArray(data);
        for (let i = 0; i < grayData.length; i += 4) {
          const avg = (grayData[i] + grayData[i + 1] + grayData[i + 2]) / 3;
          grayData[i] = avg;
          grayData[i + 1] = avg;
          grayData[i + 2] = avg;
        }
        results.grayscale = createDataURL(grayData, width, height);

        resolve(results as ProcessedChannels);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

const createDataURL = (data: Uint8ClampedArray, width: number, height: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const idata = ctx.createImageData(width, height);
  idata.data.set(data);
  ctx.putImageData(idata, 0, 0);
  return canvas.toDataURL();
};

export const calculateHistogram = (imageData: ImageData, channel: 'r' | 'g' | 'b'): HistogramData[] => {
  const bins = new Array(256).fill(0);
  const data = imageData.data;
  const offset = channel === 'r' ? 0 : channel === 'g' ? 1 : 2;

  for (let i = 0; i < data.length; i += 4) {
    bins[data[i + offset]]++;
  }

  return bins.map((count, value) => ({ value, count }));
};
