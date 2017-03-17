export function effects(store: any): any;

export namespace effects {
    function clear(): void;

    function run(effect: Function): any;
}
