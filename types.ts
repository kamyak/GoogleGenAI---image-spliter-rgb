
export type ChannelType = 'original' | 'red' | 'green' | 'blue' | 'alpha' | 'grayscale';

export interface HistogramData {
  value: number;
  count: number;
}

export interface AnalysisResult {
  dominantColor: string;
  suggestion: string;
  balance: string;
}

export interface ProcessedChannels {
  original: string;
  red: string;
  green: string;
  blue: string;
  grayscale: string;
}
