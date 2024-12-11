export const debouce = (func, delay) => {
    let timer;
    return function (args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(args)
        }, delay)
    }

}