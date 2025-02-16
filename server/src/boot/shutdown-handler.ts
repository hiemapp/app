import { DeviceController, logger } from 'hiem';

process.once('SIGUSR2', async function () {
    const devices = DeviceController.index();
    
    try {
        // Flush records of all devices
        await Promise.allSettled(devices.map(d => d.records && d.records.archiveMemory()))
    } catch(err) {
        console.error(err);
    }

    // Kill process
    logger.info('Killing process...');
    process.kill(process.pid, 'SIGUSR2');
});