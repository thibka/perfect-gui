import Button from './components/Button';
import Slider from './components/Slider';
import Image from './components/Image';
import Toggle from './components/Toggle';
import List from './components/List';
import Color from './components/Color.js';
import Vector2 from './components/Vector2';
import styles from './styles/styles';

import type { Options as SliderOptions } from './components/Slider';
import type { Options as ButtonOptions } from './components/Button';
import type { Options as ImageOptions } from './components/Image';
import type { Options as ToggleOptions } from './components/Toggle';
import type { Options as ListOptions, Values as ListValues } from './components/List';
import type { Options as ColorOptions } from './components/Color';
import type { Options as Vector2Options } from './components/Vector2';

declare global {
    interface Window {
        perfectGUI?: {
            instanceCounter?: number;
        };
    }
}

type FolderOptions = {
    container: HTMLElement;
    wrapper: HTMLElement;
    parent: GUI;
    firstParent: GUI;
    closed: boolean;
    label: string;
    color: string;
    maxHeight: number;
}

type FolderCreateOptions = { 
    label?: string; 
    color?: string; 
    closed?: boolean; 
    maxHeight?: number 
}

type Options = {
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
}

type ScreenCorner = {
    x: 'left' | 'right';
    y: 'top' | 'bottom';
};

export default class GUI {
    public firstParent: GUI;
    private container: HTMLElement = document.body;
    public wrapper!: HTMLElement;
    public folders: GUI[];
    private tabsArray: any[];
    private label: string = '';
    private backgroundColor: string | null = null;
    private opacity: number = 1;
    private maxHeight: number = window.innerHeight;
    private initMaxHeight: number | null = null;
    private screenCorner!: ScreenCorner;
    private instanceId: number = 0;
    private wrapperWidth: number = 290;
    private stylesheet: HTMLStyleElement | null = null;
    private closed: boolean = false;
    public domElement: HTMLElement | null = null;
    private hasBeenDragged: boolean = false;
    private xOffset: number = 0;
    private yOffset: number = 0;
    private position = {
        initX: 0,
        initY: 0,
        prevX: 0,
        prevY: 0,
        x: 0,
        y: 0,
    };
    // folder properties
    public isFolder: boolean = false;
    public parent: GUI | null = null;
    public imageContainer: HTMLElement | null = null;
    public header!: HTMLElement;
    public previousInnerScroll: number = 0;
    
    // tab-related properties added dynamically
    public getTab?: (index: number) => GUI | null;
    public getTabElement?: (index: number) => HTMLElement | null;
    public setActiveTab?: (index: number) => void;
    public getActiveTab?: () => number;
    public element?: HTMLElement;
    
    public propReferences: any[];
    public onUpdate: (() => void) | null = null;

    constructor(options: Options = {}, isFolder = false) {
        this.firstParent = this;
        this.folders = [];
        this.tabsArray = [];
        this.propReferences = [];

        if (options.isFolder) {
            this._folderConstructor(options.folderOptions);
            return;
        }

        if (isFolder) {
            return;
        }

        let positionType: 'absolute' | 'fixed' = 'fixed';

        if (options.container) {
            const container =
                typeof options.container == 'string'
                    ? document.querySelector(options.container)
                    : options.container;
            if (container instanceof HTMLElement) {
                this.container = container;
                positionType = 'absolute';
            }
        }
        
        this.screenCorner = this._parseScreenCorner(options.position);

        if (options.width) {
            this.wrapperWidth = options.width;
        }
        
        if (typeof options.onUpdate === 'function') {
            this.onUpdate = options.onUpdate;
        }
        
        this.label = typeof options.label == 'string' ? options.label : '';
        this.backgroundColor = options.color || null;
        this.opacity = options.opacity || 1;
        
        if (this.container && this.container !== document.body) {
            this.maxHeight = Math.min(
                this.container.clientHeight,
                window.innerHeight,
            );
        }

        if (options.maxHeight) {
            this.initMaxHeight = options.maxHeight;
            this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight);
        }

        if (!window.perfectGUI) {
            window.perfectGUI = {};
        }
        if (window.perfectGUI.instanceCounter == undefined) {
            window.perfectGUI.instanceCounter = 0;
        } else {
            window.perfectGUI.instanceCounter++;
        }
        this.instanceId = window.perfectGUI.instanceCounter;

        this.stylesheet = document.createElement('style');
        this.stylesheet.setAttribute('type', 'text/css');
        this.stylesheet.setAttribute('id', 'lm-gui-stylesheet');
        document.head.append(this.stylesheet);

        // Common styles
        if (this.instanceId == 0) {
            this._addStyles(`${styles(positionType)}`);
        }

        // Instance specific styles
        this._styleInstance();

        this.closed = !!options.closed;

        const [domElement, wrapper] = this._addWrapper();
        this.domElement = domElement;
        this.wrapper = wrapper;
        this.domElement.setAttribute('data-corner-x', this.screenCorner.x);
        this.domElement.setAttribute('data-corner-y', this.screenCorner.y);

        if (options.autoRepositioning != false) {
            window.addEventListener('resize', this._handleResize.bind(this));
        }
        this._handleResize();

        if (options.draggable == true) {
            this._makeDraggable();
        }
    }

    _styleInstance() {
        let scrollbar_width = this._getScrollbarWidth(this.container);
        if (this.screenCorner.x == 'left') {
            this.xOffset = 0;
        } else {
            this.xOffset =
                this.container.clientWidth -
                this.wrapperWidth -
                scrollbar_width;
        }

        if (this.instanceId > 0) {
            let existingDomInstances =
                this.container.querySelectorAll<HTMLElement>('.p-gui');
            
            for (let i = 0; i < existingDomInstances.length; i++) {
                if (
                    this.screenCorner.y ==
                    existingDomInstances[i].dataset.cornerY
                ) {
                    if (
                        this.screenCorner.x == 'left' &&
                        existingDomInstances[i].dataset.cornerX == 'left'
                    ) {
                        this.xOffset += existingDomInstances[i].offsetWidth;
                    } else if (
                        this.screenCorner.x == 'right' &&
                        existingDomInstances[i].dataset.cornerX == 'right'
                    ) {
                        this.xOffset -= existingDomInstances[i].offsetWidth;
                    }
                }
            }
        }
        this.yOffset = 0;
        this.position = {
            initX: this.xOffset,
            initY: this.yOffset,
            prevX: this.xOffset,
            prevY: this.yOffset,
            x: this.xOffset,
            y: this.yOffset,
        };

        this._addStyles(`#p-gui-${this.instanceId} {
            width: ${this.wrapperWidth}px;
            max-height: ${this.maxHeight}px;
            transform: translate3d(${this.xOffset}px,${this.yOffset}px,0);
            ${this.screenCorner.y == 'top' ? '' : 'top: auto; bottom: 0;'}
            ${this.backgroundColor ? 'background: ' + this.backgroundColor + ';' : ''}
            opacity: ${this.opacity};
        }`);
    }

    _folderConstructor(folderOptions: FolderOptions | undefined) {
        if (!folderOptions) {
            throw Error('[perfect-gui] folderOptions is undefined');
        }
        
        this.domElement = folderOptions.container;
        this.isFolder = true;
        this.parent = folderOptions.parent;
        this.firstParent = folderOptions.firstParent;
        this.wrapper = folderOptions.wrapper;
    }

    _parseScreenCorner(position: string | undefined): ScreenCorner {
        let parsedPosition: ScreenCorner = { x: 'right', y: 'top' };

        if (position == undefined) {
            return parsedPosition;
        }
        else if (typeof position != 'string')
            console.error('[perfect-gui] Position must be a string.');

        if (position.includes('left')) parsedPosition.x = 'left';
        if (position.includes('bottom')) parsedPosition.y = 'bottom';

        return parsedPosition;
    }

    _getScrollbarWidth(element: HTMLElement) {
        if (element === document.body) {
            return window.innerWidth - document.documentElement.clientWidth;
        } else {
            return element.offsetWidth - element.clientWidth;
        }
    }

    _handleResize() {
        if (!this.domElement) {
            return;
        }
        if (this.container == document.body) {
            this.maxHeight = window.innerHeight;
        } else {
            this.maxHeight = Math.min(
                this.container.clientHeight,
                window.innerHeight,
            );
        }
        if (this.initMaxHeight) {
            this.maxHeight = Math.min(this.initMaxHeight, this.maxHeight);
        }
        this.wrapper.style.maxHeight = this.maxHeight + 'px';

        if (this.hasBeenDragged) {
            return;
        }

        let scrollbar_width = this._getScrollbarWidth(this.container);
        this.xOffset =
            this.screenCorner.x == 'left'
                ? 0
                : this.container.clientWidth -
                  this.wrapperWidth -
                  scrollbar_width;
        if (this.instanceId > 0) {
            let existingDomInstances = this.container.querySelectorAll<HTMLElement>(
                `.p-gui:not(#${this.domElement.id}):not([data-dragged])`,
            );
            for (let i = 0; i < existingDomInstances.length; i++) {
                let instanceId = parseInt(
                    existingDomInstances[i].id.replace('p-gui-', ''),
                );
                if (instanceId > this.instanceId) break;
                if (
                    this.screenCorner.y ==
                    existingDomInstances[i].dataset.cornerY
                ) {
                    if (
                        this.screenCorner.x == 'left' &&
                        existingDomInstances[i].dataset.cornerX == 'left'
                    ) {
                        this.xOffset += existingDomInstances[i].offsetWidth;
                    } else if (
                        this.screenCorner.x == 'right' &&
                        existingDomInstances[i].dataset.cornerX == 'right'
                    ) {
                        this.xOffset -= existingDomInstances[i].offsetWidth;
                    }
                }
            }
        }
        this.position = {
            initX: this.xOffset,
            initY: this.yOffset,
            prevX: this.xOffset,
            prevY: this.yOffset,
            x: this.xOffset,
            y: this.yOffset,
        };
        this.domElement.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
    }

    _addStyles(styles: string) {
        if (this.stylesheet) {
            this.stylesheet.innerHTML += styles;
        }
    }

    _addWrapper(): [HTMLDivElement, HTMLDivElement] {
        const domElement = document.createElement('div');
        domElement.id = 'p-gui-' + this.instanceId;
        domElement.className =
            'p-gui' + (this.closed ? ' p-gui--collapsed' : '');
        domElement.setAttribute('data-lenis-prevent', '');
        this.container.append(domElement);

        this.header = document.createElement('div');
        this.header.className = 'p-gui__header';
        this.header.textContent = this.label;
        this.header.style = `${this.backgroundColor ? 'border-color: ' + this.backgroundColor + ';' : ''}`;
        domElement.append(this.header);

        const close_btn = document.createElement('div');
        close_btn.className = 'p-gui__header-close';
        close_btn.addEventListener('click', this.toggleClose.bind(this));
        this.header.append(close_btn);

        const content = document.createElement('div');
        content.className = 'p-gui__content';
        domElement.append(content);

        const wrapper = document.createElement('div');
        wrapper.className = 'p-gui__inner';
        content.append(wrapper);

        return [domElement, wrapper];
    }

    button(options: ButtonOptions = {}) {
        this.imageContainer = null;
        const instance = new Button(this, options);
        return instance;
    }

    image(path: string, options: ImageOptions = {}) {
        if (!this.imageContainer) {
            this.imageContainer = document.createElement('div');
            this.imageContainer.className = 'p-gui__image-container';
            this.wrapper.append(this.imageContainer);
        }
        return new Image(this, path, options);
    }

    slider(obj: any, prop: string, options: SliderOptions) {
        this.imageContainer = null;
        const instance = new Slider(this, obj, prop, options);
        return instance;
    }

    toggle(obj: any, prop: string, options: ToggleOptions) {
        this.imageContainer = null;
        const instance = new Toggle(this, obj, prop, options);
        return instance;
    }

    list(obj: any, prop: string, values: ListValues, options: ListOptions) {
        this.imageContainer = null;
        const instance = new List(this, obj, prop, values, options);
        return instance;
    }

    color(obj: any, prop: string, options: ColorOptions) {
        this.imageContainer = null;
        const instance = new Color(this, obj, prop, options);
        return instance;
    }

    vector2(obj: any, propX: string, propY: string, options: Vector2Options) {
        this.imageContainer = null;
        const instance = new Vector2(this, obj, propX, propY, options);
        return instance;
    }

    folder(options: FolderCreateOptions) {
        let closed =
            typeof options.closed == 'boolean' ? options.closed : false;
        let label = options.label || '';
        let color = options.color || null;
        let maxHeight = options.maxHeight || null;

        this.imageContainer = null;

        let className = 'p-gui__folder';

        if (this.folders.length == 0) {
            className += ' p-gui__folder--first';
        }

        if (closed) {
            className += ' p-gui__folder--closed';
        }

        let container_style = color ? `background-color: ${color};` : '';
        container_style += maxHeight
            ? `max-height: ${maxHeight}px; overflow-y: auto;`
            : '';

        const container = document.createElement('div');
        container.className = className;
        container.style = container_style;
        this.wrapper.append(container);

        const folderHeader = document.createElement('div');
        folderHeader.innerHTML = `<span class="p-gui__folder-arrow"></span>${label}`;
        folderHeader.className = 'p-gui__folder-header';
        container.append(folderHeader);

        const folderContent = document.createElement('div');
        folderContent.className = 'p-gui__folder-content';
        container.append(folderContent);

        const folderInner = document.createElement('div');
        folderInner.className = 'p-gui__folder-inner';
        folderContent.append(folderInner);

        folderHeader.addEventListener('click', () => {
            container.classList.toggle('p-gui__folder--closed');
        });

        let folder = new Folder({
            container,
            wrapper: folderInner,
            parent: this,
            firstParent: this.firstParent,
        });
        this.folders.push(folder);
        return folder;
    }

    tabs(options: { tabs?: string[]; active?: number; color?: string; maxHeight?: number} = {}) {
        const tabs = Array.isArray(options.tabs) ? options.tabs : [];
        const activeTab = options.active || 0;
        const color = options.color || null;
        const maxHeight = options.maxHeight || null;

        this.imageContainer = null;

        let className = 'p-gui__tabs';
        if (this.tabsArray.length == 0) {
            className += ' p-gui__tabs--first';
        }

        let container_style = color ? `background-color: ${color};` : '';
        container_style += maxHeight
            ? `max-height: ${maxHeight}px; overflow-y: auto;`
            : '';

        const container = document.createElement('div');
        container.className = className;
        container.style = container_style;
        this.wrapper.append(container);

        // Create tabs header
        const tabsHeader = document.createElement('div');
        tabsHeader.className = 'p-gui__tabs-header';
        container.append(tabsHeader);

        // Create tabs content
        const tabsContent = document.createElement('div');
        tabsContent.className = 'p-gui__tabs-content';
        container.append(tabsContent);

        // Store tab instances for later access
        const tabInstances: { gui: GUI; button: HTMLButtonElement; pane: HTMLElement }[] = [];

        tabs.forEach((tabLabel, index) => {
            // Create tab button
            const tabButton = document.createElement('button');
            tabButton.className = 'p-gui__tab-button';
            if (index === activeTab) {
                tabButton.className += ' p-gui__tab-button--active';
            }
            tabButton.textContent = tabLabel;
            tabsHeader.append(tabButton);

            // Create tab pane
            const tabPane = document.createElement('div');
            tabPane.className = 'p-gui__tab-pane';
            if (index === activeTab) {
                tabPane.className += ' p-gui__tab-pane--active';
            }
            tabsContent.append(tabPane);

            // Create GUI instance for this tab
            const tabGUI = new Folder({
                container,
                wrapper: tabPane,
                parent: this,
                firstParent: this.firstParent,
            });

            tabInstances.push({
                gui: tabGUI,
                button: tabButton,
                pane: tabPane,
            });

            // Add click handler
            tabButton.addEventListener('click', () => {
                // Remove active class from all tabs
                tabInstances.forEach((tab) => {
                    tab.button.classList.remove('p-gui__tab-button--active');
                    tab.pane.classList.remove('p-gui__tab-pane--active');
                });

                // Add active class to clicked tab
                tabButton.classList.add('p-gui__tab-button--active');
                tabPane.classList.add('p-gui__tab-pane--active');
            });
        });

        // Create main tabs instance to return
        const tabsInstance = new Folder({
            container,
            wrapper:
                tabInstances[activeTab]?.pane ||
                document.createElement('div'),
            parent: this,
            firstParent: this.firstParent,
        });

        // Add methods to access individual tabs
        tabsInstance.getTab = (index) => tabInstances[index]?.gui || null;
        tabsInstance.getTabElement = (index) =>
            tabInstances[index]?.button || null;
        tabsInstance.setActiveTab = (index) => {
            if (index >= 0 && index < tabInstances.length) {
                tabInstances[index].button.click();
            }
        };
        tabsInstance.getActiveTab = () => {
            return tabInstances.findIndex((tab) =>
                tab.button.classList.contains('p-gui__tab-button--active'),
            );
        };

        // Expose the main container element
        tabsInstance.element = container;

        this.tabsArray.push(tabsInstance);
        return tabsInstance;
    }

    private _onPointerDown = (evt: PointerEvent) => {
        evt.preventDefault();

        this.position.initX = this.position.x;
        this.position.initY = this.position.y;

        this.position.prevX = evt.clientX;
        this.position.prevY = evt.clientY;

        this.container.addEventListener('pointermove', this._onPointerMove);
        document.addEventListener('pointerup', this._onPointerUp);
    };

    private _onPointerMove = (evt: PointerEvent) => {
        evt.preventDefault();

        if (!this.hasBeenDragged) {
            this.hasBeenDragged = true;
            this.domElement?.setAttribute('data-dragged', 'true');
        }

        this.position.x = this.position.initX + evt.clientX - this.position.prevX;
        this.position.y = this.position.initY + evt.clientY - this.position.prevY;

        if (this.domElement) {
            this.domElement.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
        }
    };

    private _onPointerUp = () => {
        this.container.removeEventListener('pointermove', this._onPointerMove);
        document.removeEventListener('pointerup', this._onPointerUp);
    };

    _makeDraggable() {
        if (!this.domElement || !this.header) {
            return;
        }

        this.header.addEventListener('pointerdown', this._onPointerDown);
    }

    toggleClose() {
        if (!this.domElement) {
            return;
        }
        this.closed = !this.closed;

        if (this.closed) {
            this.previousInnerScroll = this.wrapper.scrollTop;
            this.wrapper.scrollTo(0, 0);
        } else {
            this.wrapper.scrollTo(0, this.previousInnerScroll);
        }

        this.domElement.classList.toggle('p-gui--collapsed');
    }

    kill() {
        if (this.domElement) {
            this.domElement.remove();
        }
    }

    _mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number {
        return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
    }

    _countDecimals(num: number) {
        // Convert the number to a string
        const numStr = num.toString();

        // Find the position of the decimal point
        const decimalIndex = numStr.indexOf('.');

        // If there is no decimal point, return 0
        if (decimalIndex === -1) {
            return 0;
        }

        // Calculate the number of digits after the decimal point
        const decimalPlaces = numStr.length - decimalIndex - 1;

        return decimalPlaces;
    }
}

type FolderParams = {
    container: HTMLElement,
    wrapper: HTMLElement,
    parent: GUI,
    firstParent: GUI,
}

export class Folder extends GUI {
    public parent: GUI;
    public firstParent: GUI;

    constructor(folderOptions: FolderParams) {
        super({}, true);
        this.isFolder = true;
        this.domElement = folderOptions.container;
        this.wrapper = folderOptions.wrapper;
        this.parent = folderOptions.parent;
        this.firstParent = folderOptions.firstParent;
    }
}
