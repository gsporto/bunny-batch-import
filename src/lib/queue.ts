import fastq, { queueAsPromised } from "fastq"
import { worker } from './worker'

export type QueueTask = {
  originalId: string;
  url: string;
}

/**
 * How many videos will be processed in parallel.
 */
const CONCURRENCY = 1;

export const queue: queueAsPromised<QueueTask> = fastq.promise(worker, CONCURRENCY)