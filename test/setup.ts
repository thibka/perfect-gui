// jsdom does not implement ResizeObserver; components rely on it to
// recompute sizes, so a minimal no-op stub keeps them constructible in tests.
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

// jsdom does not implement Element.scrollTo; GUI.toggleClose() calls it to
// restore/save scroll position, so a no-op stub keeps that code path callable.
Element.prototype.scrollTo = function () {};
