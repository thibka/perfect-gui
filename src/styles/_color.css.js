export default /* css */ `
.p-gui__color {
    cursor: default;
    color: var(--color-text-dark);
    transition: var(--transition) color;
}

.p-gui__color:hover {
    color: var(--color-text-light);
}

.p-gui__color-picker {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: calc(100% - 4px);
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid var(--color-border-2);
    outline: none;
    -webkit-appearance: none;
    padding: 0;
    background-color: transparent;
    border: 1px solid #222222;
    overflow: hidden;
}

.p-gui__color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
}
.p-gui__color-picker::-webkit-color-swatch {
    border: none;
}
`;