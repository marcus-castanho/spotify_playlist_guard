import { ScheduleOptions } from 'node-cron';

export type SchedulerConfig = {
    cronExpression: string;
} & ScheduleOptions;
