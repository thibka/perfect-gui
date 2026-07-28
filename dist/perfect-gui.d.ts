export declare class Angle {
    private parent;
    private propReferences;
    private obj;
    private prop;
    private unit;
    private minDeg;
    private maxDeg;
    private stepDeg;
    private decimals;
    private wraps;
    private callback;
    private dial;
    private needle;
    private valueInput;
    element: HTMLElement;
    constructor(parent: GUI, obj: any, prop: string, options?: AngleOptions);
    private _onPointerMove;
    private _onPointerUp;
    _updateFromPointer(evt: PointerEvent): void;
    /**
     * Brings an arbitrary angle into the [min, max] range, quantized on step.
     * Outside of a full turn, the closest bound wins.
     */
    _resolveDeg(deg: number): number;
    /** Current value in degrees, falling back to min when the prop isn't a number. */
    _readDeg(): number;
    _display(deg: number): void;
    _triggerCallbacks(): void;
    _toDeg(value: number): number;
    _fromDeg(deg: number): number;
    _mod(x: number, m: number): number;
    onChange(callback: (value: number) => void): this;
}

export declare type AngleOptions = {
    label?: string;
    tooltip?: string | boolean;
    unit?: AngleUnit;
    min?: number;
    max?: number;
    step?: number;
};

export declare type AngleUnit = 'deg' | 'rad';

declare type AxisOption = {
    min?: number;
    max?: number;
    step?: number;
};

export declare class Button {
    parent: GUI;
    callback: null | Callback;
    element: HTMLDivElement;
    constructor(parent: GUI, options?: ButtonOptions);
    onClick(callback: Callback): this;
}

export declare type ButtonOptions = {
    label?: string;
    tooltip?: string | boolean;
    color?: string;
    hoverColor?: string;
};

declare type Callback = () => void;

declare type Callback_2 = ({ path, text }: {
    path: string;
    text: string;
}) => void;

declare type Callback_3 = ((value: string | number | ValueObjectItem, index: number) => void) | null;

declare type Callback_4 = (value: string) => void;

declare type Callback_5 = ((x: number, y: number) => void);

export declare class Color {
    private parent;
    private callback;
    element: HTMLDivElement;
    constructor(parent: GUI, obj: any, prop: string, params?: ColorOptions);
    onChange(callback: Callback_4): this;
}

export declare type ColorOptions = {
    label?: string;
    tooltip?: string | boolean;
};

export declare class Folder extends GUI {
    parent: GUI;
    firstParent: GUI;
    constructor(folderOptions: FolderParams);
}

declare type FolderCreateOptions = {
    label?: string;
    color?: string;
    closed?: boolean;
    maxHeight?: number;
};

declare type FolderOptions = {
    container: HTMLElement;
    wrapper: HTMLElement;
    parent: GUI;
    firstParent: GUI;
    closed: boolean;
    label: string;
    color: string;
    maxHeight: number;
};

declare type FolderParams = {
    container: HTMLElement;
    wrapper: HTMLElement;
    parent: GUI;
    firstParent: GUI;
};

declare class GUI {
    firstParent: GUI;
    private container;
    wrapper: HTMLElement;
    folders: GUI[];
    private tabsArray;
    private label;
    private backgroundColor;
    private opacity;
    private maxHeight;
    private initMaxHeight;
    private screenCorner;
    private instanceId;
    private wrapperWidth;
    private stylesheet;
    private closed;
    domElement: HTMLElement | null;
    private hasBeenDragged;
    private xOffset;
    private yOffset;
    private position;
    isFolder: boolean;
    parent: GUI | null;
    imageContainer: HTMLElement | null;
    header: HTMLElement;
    previousInnerScroll: number;
    getTab?: (index: number) => GUI | null;
    getTabElement?: (index: number) => HTMLElement | null;
    setActiveTab?: (index: number) => void;
    getActiveTab?: () => number;
    element?: HTMLElement;
    propReferences: any[];
    onUpdate: (() => void) | null;
    constructor(options?: Options, isFolder?: boolean);
    _styleInstance(): void;
    _folderConstructor(folderOptions: FolderOptions | undefined): void;
    _parseScreenCorner(position: string | undefined): ScreenCorner;
    _getScrollbarWidth(element: HTMLElement): number;
    _handleResize(): void;
    _addStyles(styles: string): void;
    _addWrapper(): [HTMLDivElement, HTMLDivElement];
    button(options?: ButtonOptions): Button;
    image(path: string, options?: ImageOptions): Image_2;
    slider(obj: any, prop: string, options?: SliderOptions): Slider;
    toggle(obj: any, prop: string, options?: ToggleOptions): Toggle;
    list(obj: any, prop: string, values: ListValues, options?: ListOptions): List;
    color(obj: any, prop: string, options?: ColorOptions): Color;
    vector2(obj: any, propX: string, propY: string, options?: Vector2Options): Vector2;
    angle(obj: any, prop: string, options?: AngleOptions): Angle;
    folder(options: FolderCreateOptions): Folder;
    tabs(options?: {
        tabs?: string[];
        active?: number;
        color?: string;
        maxHeight?: number;
    }): Folder;
    private _onPointerDown;
    private _onPointerMove;
    private _onPointerUp;
    _makeDraggable(): void;
    toggleClose(): void;
    kill(): void;
    _mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;
    _countDecimals(num: number): number;
}
export default GUI;

declare class Image_2 {
    parent: GUI;
    private callback;
    element: HTMLElement;
    constructor(parent: GUI, path: string, params?: ImageOptions);
    onClick(callback: Callback_2): this;
}
export { Image_2 as Image }

export declare type ImageOptions = {
    label?: string;
    tooltip?: string | boolean;
    selected?: boolean;
    selectionBorder?: boolean;
    width?: number | string;
    height?: number | string;
};

export declare class List {
    private parent;
    private callback;
    element: HTMLElement;
    constructor(parent: GUI, obj: any, prop: string, valuesArg: ListValues, options?: ListOptions);
    onChange(callback: Callback_3): this;
}

export declare type ListOptions = {
    label?: string;
    tooltip?: string;
};

export declare type ListValues = (string | number)[] | ValueObjectItem[];

declare type Options = {
    label?: string;
    container?: HTMLElement | string;
    isFolder?: boolean;
    folderOptions?: FolderOptions;
    onUpdate?: () => void;
    color?: string;
    opacity?: number;
    position?: string;
    maxHeight?: number;
    width?: number;
    closed?: boolean;
    draggable?: boolean;
    autoRepositioning?: boolean;
};

declare type ScreenCorner = {
    x: 'left' | 'right';
    y: 'top' | 'bottom';
};

export declare class Slider {
    private parent;
    private propReferences;
    private min;
    private max;
    private step;
    private decimals;
    private obj;
    private prop;
    private callback;
    private ctrlDiv;
    private handle;
    private filling;
    private valueInput;
    element: HTMLElement;
    constructor(parent: GUI, obj: any, prop: string, options?: SliderOptions);
    _updateHandlePositionFromPointer(evt: PointerEvent, firstDown?: boolean): void;
    _updateHandlePositionFromValue(): void;
    _triggerCallbacks(): void;
    _quantize(x: number, step: number): number;
    _quantizeCeil(x: number, step: number): number;
    _quantizeFloor(x: number, step: number): number;
    onChange(callback: (value: number) => void): this;
}

export declare type SliderOptions = {
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    tooltip?: string;
};

export declare class Toggle {
    private parent;
    private callback;
    element: HTMLDivElement;
    constructor(parent: GUI, obj: any, prop: string, options?: ToggleOptions);
    onChange(callback: (value: boolean) => void): this;
}

export declare type ToggleOptions = {
    label?: string;
    tooltip?: string;
};

declare type ValueObjectItem = {
    label: string;
    value: string | number;
};

export declare class Vector2 {
    private parent;
    private callback;
    constructor(parent: GUI, obj: any, propX: string, propY: string, options?: Vector2Options);
    onChange(callback: Callback_5): this;
}

export declare type Vector2Options = {
    label?: string;
    tooltip?: string;
    min?: number;
    max?: number;
    step?: number;
    x?: AxisOption;
    y?: AxisOption;
};

export { }


declare global {
    interface Window {
        perfectGUI?: {
            instanceCounter?: number;
        };
    }
}
