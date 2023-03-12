export const replace = (options: { items:any[], value:any, key: string}) => {
    
    const index = options.items.map(x => x[options.key]).indexOf(options.value[options.key]);
    
    options.items[index] = options.value;
    
    return options.items;
}