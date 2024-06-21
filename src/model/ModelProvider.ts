export interface Model {
  name: string;
  displayName: string;
  contextLength: number;
}
export interface Provider {
  name: string;
  apiKey: string;
  models: Model[];
}
