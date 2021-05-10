export const pluckOut = (options: { items:any[], value:any, key: string}) => {

    const index = options.items.map(x => x[options.key]).indexOf(options.value[options.key]);

    options.items.splice(index, 1);

    return options.items;
}