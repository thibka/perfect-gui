export default /* css */ `
    .p-gui__image-container {
        width: 100%;
        padding: 3px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        box-sizing: border-box;
    }
    
    .p-gui__image {
        background-size: cover;
        cursor: pointer;
        position: relative;
        margin: 1px 2.5px 19px 2.5px;
        border-radius: var(--main-border-radius);
        flex: 0 0 calc(33.333% - 5px);
        height: 90px;
        background-position: center;
        color: var(--color-text-dark);
        transition: var(--transition) color;
    }

    .p-gui__image:hover {
        color: var(--color-text-light);
    }

    .p-gui__image::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        border: 1px solid transparent;
        box-sizing: border-box;
        border-radius: var(--main-border-radius);
        transition: var(--transition) border-color;
    }
    .p-gui__image--selected::after {
        border-color: #06FF89;
    }
    
    .p-gui__image-text {
        position: absolute;
        bottom: -15px;
        text-shadow: 0 -1px 0 #111;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        
    }
`;