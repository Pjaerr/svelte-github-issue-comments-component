export const parseLinkHeaders = (link) => {
    const links = link.split(',').map((l) => {
        let page;
        const pageAsString = l.match(/\?\page=./g)?.[0].replace('?page=', '');
        if (pageAsString) {
            page = parseInt(pageAsString, 10);
        }
        const rel = /rel=".*"/g.exec(l)?.[0].replace('rel="', '').replace('"', '');
        return {
            rel,
            page
        };
    });
    const next = links.find(({ rel }) => rel === 'next')?.page;
    const previous = links.find(({ rel }) => rel === 'previous')?.page;
    const first = links.find(({ rel }) => rel === 'first')?.page;
    const last = links.find(({ rel }) => rel === 'last')?.page;
    return {
        next,
        previous,
        first,
        last
    };
};
