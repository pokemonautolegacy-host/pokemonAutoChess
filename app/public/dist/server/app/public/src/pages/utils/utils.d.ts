export declare const FIREBASE_CONFIG: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
};
export declare function transformCoordinate(x: number, y: number): number[];
export declare function transformAttackCoordinate(x: number, y: number, flip: boolean): number[];
export declare function transformMiniGameXCoordinate(x: number): number;
export declare function transformMiniGameYCoordinate(y: number): number;
