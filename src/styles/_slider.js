export default /* css */ `
.p-gui__slider {
    position: relative;
    min-height: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--color-text-dark);
    transition: color var(--transition);
}

.p-gui__slider:hover {
    color: var(--color-text-light);
}

.p-gui__slider-name {
    width: 50%;
    text-overflow: ellipsis;
    overflow: hidden;
}

.p-gui__slider-ctrl {
    -webkit-appearance: none;
    padding: 0;
    font: inherit;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    right: 0;
    height: 14px;
    margin: 0 0 0 auto;
    width: 37%;
}

.p-gui__slider-bar {
    position: absolute;
    top: 50%;
    left: 0;
    height: 2px;
    background: rgba(255, 255, 255, .2);
    width: 100%;
    transform: translateY(-50%);
}

.p-gui__slider-filling {
    position: absolute;
    top: -25%;
    left: 0;
    height: 150%;
    background: var(--color-accent);
    width: 0;
}

.p-gui__slider:hover .p-gui__slider-filling {
    background: var(--color-accent-hover);
}

.p-gui__slider-handle {
    width: 15px;
    height: 8px;
    position: absolute;
    top: 50%;
    left: 0;
    border-radius: 2px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    background: var(--color-text-dark);
    box-shadow: 0 0 2px rgba(0, 0, 0, .5);
}

.p-gui__slider:hover .p-gui__slider-handle {
    background: var(--color-text-light);
}

.p-gui__slider-value {
    display: inline-block;
    right: 7px;
    width: 13%;
    border: none;
    color: white;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 4px;
    color: inherit;
}

.p-gui__slider-value:focus {
    outline: none;
}
`;