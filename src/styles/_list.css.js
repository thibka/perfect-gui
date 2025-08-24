export default /* css */ `
.p-gui__list {
    cursor: default;
    color: var(--color-text-dark);
    transition: var(--transition) color;
}

.p-gui__list:hover {
    color: var(--color-text-light);
}

.p-gui__list-dropdown {
    background: rgba(255, 255, 255,.05);
    color: white;
    padding: 0 12px 0 5px;
    top: 0px;
}

.p-gui__list-dropdown {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 21px;
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid var(--color-border-2);
    outline: none;

    option {
        background: white;
        color: black;
    }
}

.p-gui__list-dropdown:hover {
    background: rgba(255, 255, 255, .1);
}
`;