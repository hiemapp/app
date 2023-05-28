function replaceById(arr: any[], searchId: string | number, replace: any): void {
    let i;
    for (i = 0; i < arr.length && arr[i].id != searchId; i++) {}
    i < arr.length ? (arr[i] = replace) : arr.push(replace);
}

export { replaceById };
