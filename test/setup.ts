// jsdom does not implement ResizeObserver; components rely on it to
// recompute sizes, so a minimal no-op stub keeps them constructible in tests.
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
