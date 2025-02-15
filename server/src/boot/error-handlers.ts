import { logger } from 'hiem';

// Register promise handler
process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled promise rejection:', reason);
})