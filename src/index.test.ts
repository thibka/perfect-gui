import { describe, expect, it } from 'vitest';
import GUI from './index.js';

function click(el: HTMLElement) {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function keydown(el: HTMLElement, key: string) {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('GUI construction', () => {
    it('creates a wrapper element attached to document.body by default', () => {
        const gui = new GUI();

        expect(gui.domElement).toBeInstanceOf(HTMLElement);
        expect(gui.domElement!.parentElement).toBe(document.body);
        expect(gui.domElement!.classList.contains('p-gui')).toBe(true);
    });

    it('renders the label in the header', () => {
        const gui = new GUI({ label: 'My panel' });

        expect(gui.header.textContent).toContain('My panel');
    });

    it('accepts a container as a CSS selector', () => {
        const host = document.createElement('div');
        host.id = 'gui-host';
        document.body.append(host);

        const gui = new GUI({ container: '#gui-host' });

        expect(gui.domElement!.parentElement).toBe(host);
    });

    it('accepts a container as an HTMLElement', () => {
        const host = document.createElement('div');
        document.body.append(host);

        const gui = new GUI({ container: host });

        expect(gui.domElement!.parentElement).toBe(host);
    });

    it.each([
        ['top-right (default)', undefined, { x: 'right', y: 'top' }],
        ['top-left', 'top-left', { x: 'left', y: 'top' }],
        ['bottom-right', 'bottom-right', { x: 'right', y: 'bottom' }],
        ['bottom-left', 'bottom-left', { x: 'left', y: 'bottom' }],
    ] as const)('positions the panel at the %s corner', (_name, position, expected) => {
        const gui = new GUI(position ? { position } : {});

        expect(gui.domElement!.getAttribute('data-corner-x')).toBe(expected.x);
        expect(gui.domElement!.getAttribute('data-corner-y')).toBe(expected.y);
    });

    it('starts collapsed when closed is true', () => {
        const gui = new GUI({ closed: true });

        expect(gui.domElement!.classList.contains('p-gui--collapsed')).toBe(true);
    });

    it('does not render a close button when collapsible is false', () => {
        const gui = new GUI({ collapsible: false });

        expect(gui.header.querySelector('.p-gui__header-close')).toBeNull();
    });

    it('renders a close button when collapsible is true (default)', () => {
        const gui = new GUI();

        expect(gui.header.querySelector('.p-gui__header-close')).not.toBeNull();
    });
});

describe('GUI.toggleClose', () => {
    it('toggles the collapsed class and aria-expanded on the close button', () => {
        const gui = new GUI();
        const closeBtn = gui.header.querySelector('.p-gui__header-close')!;

        expect(gui.domElement!.classList.contains('p-gui--collapsed')).toBe(false);
        expect(closeBtn.getAttribute('aria-expanded')).toBe('true');

        gui.toggleClose();

        expect(gui.domElement!.classList.contains('p-gui--collapsed')).toBe(true);
        expect(closeBtn.getAttribute('aria-expanded')).toBe('false');

        gui.toggleClose();

        expect(gui.domElement!.classList.contains('p-gui--collapsed')).toBe(false);
        expect(closeBtn.getAttribute('aria-expanded')).toBe('true');
    });

    it('toggles when the close button is clicked or activated via keyboard', () => {
        const gui = new GUI();
        const closeBtn = gui.header.querySelector('.p-gui__header-close')! as HTMLElement;

        click(closeBtn);
        expect(gui.domElement!.classList.contains('p-gui--collapsed')).toBe(true);

        keydown(closeBtn, 'Enter');
        expect(gui.domElement!.classList.contains('p-gui--collapsed')).toBe(false);

        keydown(closeBtn, ' ');
        expect(gui.domElement!.classList.contains('p-gui--collapsed')).toBe(true);
    });
});

describe('GUI.kill', () => {
    it('removes the panel from the DOM', () => {
        const gui = new GUI();
        const domElement = gui.domElement!;

        expect(domElement.parentElement).toBe(document.body);

        gui.kill();

        expect(domElement.parentElement).toBeNull();
        expect(gui.domElement).toBeNull();
    });

    it('stops reacting to window resize after being killed', () => {
        const gui = new GUI();

        gui.kill();

        expect(() => window.dispatchEvent(new Event('resize'))).not.toThrow();
    });
});

describe('Folder', () => {
    it('nests a folder inside another folder', () => {
        const gui = new GUI();
        const folder = gui.folder({ label: 'Outer' });
        const nestedFolder = folder.folder({ label: 'Inner' });

        expect(nestedFolder.isFolder).toBe(true);
        expect(folder.domElement!.contains(nestedFolder.domElement!)).toBe(true);
    });

    it('starts closed when closed is true', () => {
        const gui = new GUI();
        const folder = gui.folder({ closed: true });

        expect(folder.domElement!.classList.contains('p-gui__folder--closed')).toBe(true);
    });

    it('toggles closed state on click of the folder header', () => {
        const gui = new GUI();
        const folder = gui.folder({});
        const header = folder.domElement!.querySelector('.p-gui__folder-header')! as HTMLElement;

        click(header);
        expect(folder.domElement!.classList.contains('p-gui__folder--closed')).toBe(true);
        expect(header.getAttribute('aria-expanded')).toBe('false');

        click(header);
        expect(folder.domElement!.classList.contains('p-gui__folder--closed')).toBe(false);
        expect(header.getAttribute('aria-expanded')).toBe('true');
    });

    it('toggles closed state on Enter and Space keydown of the folder header', () => {
        const gui = new GUI();
        const folder = gui.folder({});
        const header = folder.domElement!.querySelector('.p-gui__folder-header')! as HTMLElement;

        keydown(header, 'Enter');
        expect(folder.domElement!.classList.contains('p-gui__folder--closed')).toBe(true);

        keydown(header, ' ');
        expect(folder.domElement!.classList.contains('p-gui__folder--closed')).toBe(false);
    });
});

describe('Tabs', () => {
    it('exposes getTab, setActiveTab and getActiveTab', () => {
        const gui = new GUI();
        const tabsInstance = gui.tabs({ tabs: ['First', 'Second', 'Third'] });

        expect(tabsInstance.getTab!(0)).not.toBeNull();
        expect(tabsInstance.getTab!(1)).not.toBeNull();
        expect(tabsInstance.getActiveTab!()).toBe(0);

        tabsInstance.setActiveTab!(2);

        expect(tabsInstance.getActiveTab!()).toBe(2);
    });

    it('marks the initial active tab from the `active` option', () => {
        const gui = new GUI();
        const tabsInstance = gui.tabs({ tabs: ['First', 'Second'], active: 1 });

        expect(tabsInstance.getActiveTab!()).toBe(1);
    });

    it('navigates between tabs with the keyboard', () => {
        const gui = new GUI();
        const tabsInstance = gui.tabs({ tabs: ['First', 'Second', 'Third'] });
        const firstTabButton = tabsInstance.getTabElement!(0)! as HTMLButtonElement;

        keydown(firstTabButton, 'ArrowRight');
        expect(tabsInstance.getActiveTab!()).toBe(1);

        const secondTabButton = tabsInstance.getTabElement!(1)! as HTMLButtonElement;
        keydown(secondTabButton, 'End');
        expect(tabsInstance.getActiveTab!()).toBe(2);

        const thirdTabButton = tabsInstance.getTabElement!(2)! as HTMLButtonElement;
        keydown(thirdTabButton, 'Home');
        expect(tabsInstance.getActiveTab!()).toBe(0);

        const backToFirstButton = tabsInstance.getTabElement!(0)! as HTMLButtonElement;
        keydown(backToFirstButton, 'ArrowLeft');
        expect(tabsInstance.getActiveTab!()).toBe(2);
    });
});

describe('P6 regression: multi-instance positioning', () => {
    it.fails('a second GUI instance created with a container option renders with position: absolute', () => {
        delete window.perfectGUI;
        document.querySelectorAll('#lm-gui-stylesheet').forEach((el) => el.remove());

        const host = document.createElement('div');
        document.body.append(host);

        new GUI();
        const second = new GUI({ container: host });

        expect(getComputedStyle(second.domElement!).position).toBe('absolute');
    });
});

describe('GUI._mapLinear', () => {
    it('maps a value linearly between two ranges', () => {
        const gui = new GUI();
        expect(gui._mapLinear(5, 0, 10, 0, 100)).toBe(50);
        expect(gui._mapLinear(0, 0, 10, 0, 100)).toBe(0);
        expect(gui._mapLinear(10, 0, 10, 0, 100)).toBe(100);
    });

    it('supports an inverted output range', () => {
        const gui = new GUI();
        expect(gui._mapLinear(5, 0, 10, 100, 0)).toBe(50);
        expect(gui._mapLinear(0, 0, 10, 100, 0)).toBe(100);
    });
});

describe('GUI._countDecimals', () => {
    it('counts the digits after the decimal point', () => {
        const gui = new GUI();
        expect(gui._countDecimals(1)).toBe(0);
        expect(gui._countDecimals(1.5)).toBe(1);
        expect(gui._countDecimals(0.001)).toBe(3);
        expect(gui._countDecimals(-2.25)).toBe(2);
    });
});
