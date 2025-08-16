export default /* css */ `
.p-gui__button {
    background: var(--color-accent);
    text-align: center;
    color: var(--color-bg);
    border: none;
    border: 1px solid transparent;
    box-sizing: border-box;
    transition: var(--transition) background, var(--transition) border-color;
}

.p-gui__button:hover {
    background: var(--color-accent-hover);
    border-color: rgba(255, 255, 255, 0.2);
}

.p-gui__folder .p-gui__button {
    margin-inline: 0;
}
`;