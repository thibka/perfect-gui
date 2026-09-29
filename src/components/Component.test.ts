import { describe, expect, it, vi } from 'vitest';
import Component, { type Container } from './Component.js';

class FakeContainer implements Container {
    public appended: HTMLElement[] = [];
    public notifyUpdate = vi.fn();

    append(el: HTMLElement) {
        this.appended.push(el);
    }
}

class TestComponent extends Component {
    constructor(container: Container) {
        super(container);
        this.element = document.createElement('div');
    }

    triggerUpdate() {
        this.notifyUpdate();
    }

    label(options: { label?: string }, fallback: string) {
        return this.resolveLabel(options, fallback);
    }

    tooltip(options: { tooltip?: string | boolean }, label: string) {
        return this.resolveTooltip(options, label);
    }
}

describe('Component', () => {
    it('delegates notifyUpdate() to the container', () => {
        const container = new FakeContainer();
        const component = new TestComponent(container);

        component.triggerUpdate();

        expect(container.notifyUpdate).toHaveBeenCalledTimes(1);
    });

    it('resolves the label from options, falling back when absent or empty', () => {
        const component = new TestComponent(new FakeContainer());

        expect(component.label({ label: 'Speed' }, 'speed')).toBe('Speed');
        expect(component.label({}, 'speed')).toBe('speed');
        expect(component.label({ label: '' }, 'speed')).toBe('speed');
    });

    it('resolves the tooltip from options: string, true (falls back to label), or absent', () => {
        const component = new TestComponent(new FakeContainer());

        expect(component.tooltip({ tooltip: 'Custom tooltip' }, 'Speed')).toBe('Custom tooltip');
        expect(component.tooltip({ tooltip: true }, 'Speed')).toBe('Speed');
        expect(component.tooltip({}, 'Speed')).toBe(null);
    });
});
