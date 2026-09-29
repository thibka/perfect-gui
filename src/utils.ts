export function _mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number {
    return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
}

export function _countDecimals(num: number) {
    // Convert the number to a string
    const numStr = num.toString();

    // Find the position of the decimal point
    const decimalIndex = numStr.indexOf('.');

    // If there is no decimal point, return 0
    if (decimalIndex === -1) {
        return 0;
    }

    // Calculate the number of digits after the decimal point
    const decimalPlaces = numStr.length - decimalIndex - 1;

    return decimalPlaces;
}
