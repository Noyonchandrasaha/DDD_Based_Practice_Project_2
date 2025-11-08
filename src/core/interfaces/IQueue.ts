// ============================================================================
// FILE: src/core/interfaces/IQueue.ts
// ============================================================================

export interface IQueue<T = any> {
  add(name: string, payload: T, options?: QueueJobOptions): Promise<string>; 
  process(name: string, handler: QueueJobHandler<T>): void;
  remove(jobId: string): Promise<void>;
  count(name?: string): Promise<number>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  empty(): Promise<void>;
}


// Optional configuration for a job
export interface QueueJobOptions {
  delay?: number;       
  attempts?: number;    
  priority?: number;    
  ttl?: number;        
  removeOnComplete?: boolean; 
  removeOnFail?: boolean;     
}


export type QueueJobHandler<T = any> = (payload: T, job?: QueueJobMetadata) => Promise<void>;


// Metadata about the job
export interface QueueJobMetadata {
  id: string;
  timestamp: number;
  attemptsMade: number;
  delay: number;
  [key: string]: any;
}
