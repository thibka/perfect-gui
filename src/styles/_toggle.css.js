export default /* css */ `
.p-gui__toggle {
    color: var(--color-text-dark);
    transition: var(--transition) background, var(--transition) color;
}

.p-gui__toggle:hover {
    background: rgba(255, 255, 255, .1);
    color: var(--color-text-light);
}

.p-gui__folder .p-gui__toggle {
    margin-inline: 0;
}

.p-gui__toggle-checkbox {
    width: 10px;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    margin: auto;
    border-radius: 2px;
    pointer-events: none;
    transition: .5s all ease;
}

.p-gui__toggle-checkbox--active {
    background-color: #ddd;
    box-shadow: 0 0 7px #ddd;
}
`;