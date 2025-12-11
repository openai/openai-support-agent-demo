declare module "swr" {
  export interface SWRResponse<Data = any, Error = any> {
    data?: Data;
    error?: Error;
    isLoading: boolean;
    mutate: (
      data?: Data | Promise<Data>,
      shouldRevalidate?: boolean
    ) => Promise<Data | undefined>;
  }

  export default function useSWR<Data = any, Error = any>(
    key: any,
    fetcher?: any,
    config?: any
  ): SWRResponse<Data, Error>;
}

declare module "node-cron" {
  export interface ScheduledTask {
    stop(): void;
    start(): void;
  }

  export function schedule(
    cronExpression: string,
    task: () => void,
    options?: Record<string, unknown>
  ): ScheduledTask;
  const cron: { schedule: typeof schedule };
  export default cron;
}
