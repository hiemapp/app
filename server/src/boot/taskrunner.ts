import { Taskrunner } from 'hiem';

export async function boot(rootDir: string) {
    await Taskrunner.start();
}