export default /* css */ `
.p-gui__switch {
    background: rgba(255, 255, 255, .05);
    color: var(--color-text-dark);
    transition: var(--transition) background, var(--transition) color;
}

.p-gui__switch:hover {
    background: rgba(255, 255, 255, .1);
    color: var(--color-text-light);
}

.p-gui__folder .p-gui__switch {
    margin-inline: 0;
}

.p-gui__switch-checkbox {
    width: 5px;
    height: 5px;
    background-color: rgba(0, 0, 0, .5);
    border: 1px solid grey;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    pointer-events: none;
}

.p-gui__switch-checkbox--active {
    background-color: #00ff89;
    box-shadow: 0 0 7px #00ff89;
}
`;