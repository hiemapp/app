import type { Color } from '../utils/colors';
export interface FlowBlockCategoryManifest {
    icon?: string;
    color?: Color | number;
    customColors?: {
        main?: string;
        shadow?: string;
        border?: string;
    };
    priority?: number;
}
