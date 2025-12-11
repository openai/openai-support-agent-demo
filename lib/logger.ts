export interface ProviderRetryLog {
  provider: string;
  attempt: number;
  delayMs: number;
  status?: number;
  model?: string;
  errorCode?: string;
}

export interface ProviderRetryRecoveryLog {
  provider: string;
  attempts: number;
  model?: string;
}

export const logger = {
  retry(event: ProviderRetryLog) {
    console.warn("provider.retry", event);
  },
  retryRecovered(event: ProviderRetryRecoveryLog) {
    console.info("provider.retryRecovered", event);
  },
};
