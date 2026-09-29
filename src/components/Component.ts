// Minimal surface a Component needs from whatever holds it (Panel, Folder,
// Tab) so Components don't depend on the full GUI type.
export interface Container {
    append(el: HTMLElement): void;
    notifyUpdate(): void;
}

export type ComponentOptions = {
    label?: string;
    tooltip?: string | boolean;
};

export default abstract class Component {
    public element!: HTMLElement;
    protected container: Container;

    constructor(container: Container) {
        this.container = container;
    }

    protected notifyUpdate() {
        this.container.notifyUpdate();
    }

    protected resolveLabel(options: ComponentOptions, fallback: string): string {
        return typeof options.label === 'string' && options.label !== ''
            ? options.label
            : fallback;
    }

    protected resolveTooltip(options: ComponentOptions, label: string): string | null {
        return typeof options.tooltip === 'string'
            ? options.tooltip
            : options.tooltip === true
              ? label
              : null;
    }
}
