import { describe, expect, it, vi } from 'vitest';
import GUI from './index.js';
import Button from './components/Button.js';
import Toggle from './components/Toggle.js';

function click(el: HTMLElement) {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('onUpdate propagation', () => {
    it('fires onUpdate exactly once for a Component directly in the Panel', () => {
        const onUpdate = vi.fn();
        const gui = new GUI({ onUpdate });
        const button = new Button(gui, {});

        click(button.element);

        expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    it('fires onUpdate exactly once for a Component inside a Folder', () => {
        const onUpdate = vi.fn();
        const gui = new GUI({ onUpdate });
        const folder = gui.folder({});
        const button = new Button(folder, {});

        click(button.element);

        expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    it('fires onUpdate exactly once for a Component inside a nested Folder', () => {
        const onUpdate = vi.fn();
        const gui = new GUI({ onUpdate });
        const folder = gui.folder({});
        const nestedFolder = folder.folder({});
        const button = new Button(nestedFolder, {});

        click(button.element);

        expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    it('fires onUpdate exactly once for a Component inside a Tab', () => {
        const onUpdate = vi.fn();
        const gui = new GUI({ onUpdate });
        const tabsInstance = gui.tabs({ tabs: ['First', 'Second'] });
        const tab = tabsInstance.getTab!(0)!;
        const button = new Button(tab, {});

        click(button.element);

        expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    it('does not fire onUpdate for a readonly Component', () => {
        const onUpdate = vi.fn();
        const gui = new GUI({ onUpdate });
        const obj = { enabled: false };
        const toggle = new Toggle(gui, obj, 'enabled', { readonly: true });

        click(toggle.element);

        expect(obj.enabled).toBe(false);
        expect(onUpdate).not.toHaveBeenCalled();
    });

    it('does not fire onUpdate for a programmatic change to the bound property', () => {
        const onUpdate = vi.fn();
        const gui = new GUI({ onUpdate });
        const obj = { enabled: false };
        new Toggle(gui, obj, 'enabled');

        obj.enabled = true;

        expect(onUpdate).not.toHaveBeenCalled();
    });
});
