

const full_featured_gui = new perfectGUI({
    name: "This is a basic panel",
    draggable: true,
    container: '#container-1'
});

full_featured_gui.image(
    'Background 1',
    'https://images.unsplash.com/photo-1485254767195-60704c46702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80',
    () => {
        full_featured_gui.container.style.backgroundImage = `url(https://images.unsplash.com/photo-1485254767195-60704c46702e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80)`;
        full_featured_gui.container.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by Joel Filipe on Unsplash";
    }
);
full_featured_gui.image(
    'Background 2',
    'https://images.unsplash.com/photo-1535370976884-f4376736ab06?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80',
    () => {
        full_featured_gui.container.style.backgroundImage = `url(https://images.unsplash.com/photo-1535370976884-f4376736ab06?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80)`;
        full_featured_gui.container.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by Richard M. on Unsplash";
    }
);
full_featured_gui.image(
    'Background 3',
    'https://images.unsplash.com/photo-1524721696987-b9527df9e512?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80',
    () => {
        full_featured_gui.container.style.backgroundImage = `url(https://images.unsplash.com/photo-1524721696987-b9527df9e512?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1490&q=80)`;
        full_featured_gui.container.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by Cassi Josh on Unsplash";
    }
);
full_featured_gui.image(
    'Background 4',
    'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80',
    () => {
        full_featured_gui.container.style.backgroundImage = `url(https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80)`;
        full_featured_gui.container.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by United States Geological Survey on Unsplash";
    }
);

let folder = full_featured_gui.folder('Some folder');

folder.button("Random element color", () => {
    element.style.backgroundColor = get_random_color();
});

folder.image(
    'Background 5',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
    () => {
        full_featured_gui.container.style.backgroundImage = `url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80)`;
        full_featured_gui.container.style.backgroundColor = `none`;
        document.getElementById('note').textContent = "Photo by Milad Fakurian on Unsplash";
    }
);

full_featured_gui.button("Random element color", () => {
    element.style.backgroundColor = get_random_color();
});
full_featured_gui.slider("Scale", {min: .1, max: 2, value: 1, step: .01 }, (value) => {
    element.style.transform = `scale(${value})`;
});
full_featured_gui.slider("3-step border-radius", {min: 0, max: 50, value: 0, step: 25 }, (value) => {
    element.style.borderRadius = `${value}%`;
});

let folder2 = full_featured_gui.folder('ok', false);
folder2.button("Random element color", () => {
    element.style.backgroundColor = get_random_color();
});

full_featured_gui.toggle("Opacity switch", true, (state) => {
    if (!state) element.style.opacity = .5;
    else element.style.opacity = 1;
});

full_featured_gui.list('Select a color', ['red', 'pink', 'yellow', 'blue'], function(item) {
    element.style.backgroundColor = item;
});