export declare class Angle {
    private parent;
    private obj;
    private prop;
    private unit;
    private minDeg;
    private maxDeg;
    private stepDeg;
    private decimals;
    private wraps;
    private isReadonly;
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
    readonly?: boolean;
};

export declare type AngleUnit = 'deg' | 'rad';

declare type AxisOption = {
    min?: number;
    max?: number;
    step?: number;
};

declare abstract class BoundComponent<T = any> extends Component {
    protected obj: any;
    protected prop: string;
    protected propEntry: SharedPropEntry<T>;
    protected readonly: boolean;
    private callback;
    constructor(container: Container, obj: any, prop: string, readonly: boolean);
    onChange(callback: (value: T) => void): this;
    protected emitChange(value: T): void;
    protected applyReadonlyAttributes(el: HTMLElement, interactiveTabIndex?: string): void;
}

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

declare type Callback_6 = (value: string) => void;

declare type Callback_7 = (value: number) => void;

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
    readonly?: boolean;
};

declare abstract class Component {
    element: HTMLElement;
    protected container: Container;
    constructor(container: Container);
    protected notifyUpdate(): void;
    protected resolveLabel(options: ComponentOptions, fallback: string): string;
    protected resolveTooltip(options: ComponentOptions, label: string): string | null;
}

declare type ComponentOptions = {
    label?: string;
    tooltip?: string | boolean;
};

declare interface Container {
    append(el: HTMLElement): void;
    notifyUpdate(): void;
}

export declare class DisplayText extends BoundComponent<string> {
    constructor(container: Container, obj: any, prop: string, options?: DisplayTextOptions);
}

export declare type DisplayTextOptions = {
    tooltip?: string | boolean;
    style?: 'normal' | 'heading' | 'code';
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

declare class GUI implements Container {
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
    private collapsible;
    domElement: HTMLElement | null;
    private hasBeenDragged;
    private xOffset;
    private yOffset;
    private position;
    isFolder: boolean;
    parent: GUI | null;
    imageContainer: HTMLElement | null;
    header: HTMLElement;
    private closeBtn;
    previousInnerScroll: number;
    getTab?: (index: number) => GUI | null;
    getTabElement?: (index: number) => HTMLElement | null;
    setActiveTab?: (index: number) => void;
    getActiveTab?: () => number;
    element?: HTMLElement;
    onUpdate: (() => void) | null;
    private autoRepositioning;
    private _boundHandleResize;
    constructor(options?: Options, isFolder?: boolean);
    _styleInstance(): void;
    _folderConstructor(folderOptions: FolderOptions | undefined): void;
    _parseScreenCorner(position: string | undefined): ScreenCorner;
    _getScrollbarWidth(element: HTMLElement): number;
    _handleResize(): void;
    _addStyles(styles: string): void;
    _addWrapper(): [HTMLDivElement, HTMLDivElement];
    append(el: HTMLElement): void;
    notifyUpdate(): void;
    button(options?: ButtonOptions): Button;
    image(path: string, options?: ImageOptions): Image_2;
    slider(obj: any, prop: string, options?: SliderOptions): Slider;
    toggle(obj: any, prop: string, options?: ToggleOptions): Toggle;
    list(obj: any, prop: string, values: ListValues, options?: ListOptions): List;
    color(obj: any, prop: string, options?: ColorOptions): Color;
    vector2(obj: any, propX: string, propY: string, options?: Vector2Options): Vector2;
    angle(obj: any, prop: string, options?: AngleOptions): Angle;
    text(obj: any, prop: string, options?: TextOptions): Text_2;
    number(obj: any, prop: string, options?: NumberOptions): NumberInput;
    displayText(obj: any, prop: string, options?: DisplayTextOptions): DisplayText;
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
    /** @deprecated Use `_mapLinear` from `./utils.js` instead. Will be removed in v7. */
    _mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;
    /** @deprecated Use `_countDecimals` from `./utils.js` instead. Will be removed in v7. */
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

export declare class NumberInput {
    private parent;
    private min?;
    private max?;
    private callback;
    element: HTMLDivElement;
    constructor(parent: GUI, obj: any, prop: string, options?: NumberOptions);
    onChange(callback: Callback_7): this;
}

export declare type NumberOptions = {
    label?: string;
    tooltip?: string | boolean;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    readonly?: boolean;
};

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
    collapsible?: boolean;
    draggable?: boolean;
    autoRepositioning?: boolean;
};

declare type ScreenCorner = {
    x: 'left' | 'right';
    y: 'top' | 'bottom';
};

declare type SharedPropEntry<T = any> = {
    value: T;
    listeners: Set<(val: T) => void>;
};

export declare class Slider {
    private parent;
    private min;
    private max;
    private step;
    private decimals;
    private obj;
    private prop;
    private isReadonly;
    private callback;
    private ctrlDiv;
    private handle;
    private filling;
    private valueInput;
    element: HTMLElement;
    constructor(parent: GUI, obj: any, prop: string, options?: SliderOptions);
    _updateHandlePositionFromPointer(evt: PointerEvent, firstDown?: boolean): void;
    _setValue(newValue: number): void;
    _updateAriaValue(): void;
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
    readonly?: boolean;
};

declare class Text_2 {
    private parent;
    private callback;
    element: HTMLDivElement;
    constructor(parent: GUI, obj: any, prop: string, options?: TextOptions);
    onChange(callback: Callback_6): this;
}
export { Text_2 as Text }

export declare type TextOptions = {
    label?: string;
    tooltip?: string | boolean;
    placeholder?: string;
    maxLength?: number;
    readonly?: boolean;
};

export declare class Toggle extends BoundComponent<boolean> {
    constructor(container: Container, obj: any, prop: string, options?: ToggleOptions);
}

export declare type ToggleOptions = {
    label?: string;
    tooltip?: string;
    readonly?: boolean;
};

declare type ValueObjectItem = {
    label: string;
    value: string | number;
};

export declare class Vector2 {
    private parent;
    private callback;
    element: HTMLDivElement;
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
    readonly?: boolean;
};

export { }


declare global {
    interface Window {
        perfectGUI?: {
            instanceCounter?: number;
        };
    }
}
