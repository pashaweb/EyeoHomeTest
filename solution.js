
const adRemover = function (node) {
    const animationTime = 100;
    node.style.opacity = 0;
    setTimeout(() => {
        node.style.transition = `all ${animationTime}ms ease`;
        node.style.height = 0;
    }, 0);
    setTimeout(() => { node.remove(); }, animationTime);
}

const controlOverlay = (w, h) => {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    ctx.font = '25px sans-serif';
    ctx.fillStyle = '#f00';
    ctx.fillText('Advertisement', 5, 25);
    return canvas.toDataURL();
};

removeImageAds = () => {
    const images = document.querySelectorAll('img[src^="data:"]');
    for (let i = 0; i < images.length; i++) {

        const control = controlOverlay(images[i].width, images[i].height);
        if (images[i].src === control) {
            const _adRemover = new adRemover(images[i].parentNode);
        }
    }

}

const extractText = (nodes, textObj) => {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children.length > 0) {
            extractText(nodes[i].children, textObj);
        }
        if (nodes[i].children.length === 0 && nodes[i].innerText !== '') {
            textObj[nodes[i].innerText] = 1
        }
    }
    return textObj;
};

const isTextAd = (obj) => {
    const keys = Object.keys(obj);
    const keysText = keys.join('').toLowerCase();
    return keysText.includes('advertisement');

}

const handelTextAds = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
        //console.log();
        const textObj = extractText([nodes[i]], {});
        if (isTextAd(textObj)) {
            console.log('text ad', nodes[i]);
            const _adRemover = new adRemover(nodes[i]);
        }

    }
}




window.addEventListener('load', () => {
    const config = { attributes: false, childList: true, subtree: true };
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                handelTextAds(mutation.addedNodes);
                removeImageAds();
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.getElementsByTagName('body')[0], config);
    let bodyChildren = document.querySelector('body').children;
    handelTextAds(bodyChildren);
    removeImageAds();
})




