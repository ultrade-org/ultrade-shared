import algosdk, { decodeAddress, encodeAddress } from 'algosdk'
// import sha512 from "js-sha512"
import { Buffer } from 'buffer'
// import { Address, AssetId, Amount } from './types'

export type AlgorandType = bigint | string | boolean | number | Uint8Array

export type IPackedInfoFixed = {
    type: "uint" | "number" | "address" | "double"
}
export type IPackedInfoVariable = {
    type: "string" | "bytes"
    size: number
}
export type IPackedInfoAny = IPackedInfoFixed | IPackedInfoVariable
export type IPackedInfo = { [name: string]: IPackedInfoAny }

export function concatArrays(arrays: Uint8Array[]): Uint8Array {
    return arrays.reduce((a, b) => Uint8Array.from([...a, ...b]))
}

export function packData(value: { [index: string]: any }, format: IPackedInfo): Uint8Array {
    const chunks: Uint8Array[] = []
    for (const [name, type] of Object.entries(format)) {
        const v = value[name]
        if (v === undefined) {
            throw new Error(`Key ${name} missing from value`)
        }

        switch (type.type) {
            case 'address':
                if (v instanceof Uint8Array && v.length == 32) {
                    chunks.push(v)
                    break
                } else if (typeof v === 'string') {
                    chunks.push(decodeAddress(v).publicKey)
                } else {
                    throw new Error(`${name}: Expected address, got ${v}`)
                }
                break;

            case 'bytes':
                if (v instanceof Uint8Array) {
                    if (v.length == type.size) {
                        chunks.push(v)
                        break
                    } else {
                        throw new Error(`${name}: Bytes length is wrong, expected ${type.size}, got ${v.length}`)
                    }
                } else {
                    throw new Error(`${name}: Expected bytes[${type.size}], got ${v}`)
                }

            case 'double':
                if (typeof v === 'number') {
                    const bytes = new ArrayBuffer(8)
                    Buffer.from(bytes).writeDoubleLE(v, 0)
                    chunks.push(new Uint8Array(bytes))
                    break
                } else {
                    throw new Error(`${name}: Expected double, got ${v}`)
                }

            case 'number':
            case 'uint':
                if (typeof v === 'bigint' || typeof v === 'number') {
                    chunks.push(encodeUint64(v))
                    break
                } else {
                    throw new Error(`${name}: Expected uint or number, got ${v}`)
                }

            case 'string':
                if (typeof v === 'string') {
                    const str = encodeString(v)
                    if (str.length == type.size) {
                        chunks.push(str)
                        break
                    } else {
                        throw new Error(`${name}: Expected string length ${type.size}, got string length ${str.length}`)
                    }
                } else {
                    throw new Error(`${name}: Expected string length ${type.size}, got ${v}`)
                }
        }
    }

    return concatArrays(chunks)
}

export function unpackData(data: Uint8Array, format: IPackedInfo): { [index: string]: any } {
    const result = new Map<string, any>();
    let index = 0;
    for (const [name, type] of Object.entries(format)) {
        if (index >= data.length) {
            throw new Error('Array index out of bounds')
        }

        let value: any
        switch (type.type) {
            case 'address':
                value = encodeAddress(data.slice(index, index + 32))
                index += 32
                break

            case 'bytes':
                value = data.slice(index, index + type.size)
                index += type.size
                break

            case 'double':
                value = Buffer.from(data.slice(index, index + 8)).readDoubleLE(0)
                index += 8
                break

            case 'number':
                value = Number(decodeUint64(data.slice(index, index + 8)))
                index += 8
                break

            case 'uint':
                value = decodeUint64(data.slice(index, index + 8))
                index += 8
                break

            case 'string':
                value = decodeString(data.slice(index, index + type.size))
                index += type.size
                break
        }

        result.set(name, value)
    }

    return Object.fromEntries(result)
}

export function encodeArgArray(params: AlgorandType[]): Uint8Array[] {
    return params.map(param => {
        if (param instanceof Uint8Array)
            return new Uint8Array(param)
        if (typeof param === "string")
            return encodeString(param)
        if (typeof param === "boolean")
            param = BigInt(param ? 1 : 0)
        if (typeof param === "number")
            param = BigInt(param)
        return encodeUint64(param)
    })
}

export function encodeString(value: string | Uint8Array): Uint8Array {
    return new Uint8Array(Buffer.from(value))
}

export function decodeString(value: Uint8Array): string {
    return Buffer.from(value).toString('utf-8')
}

export function encode32Bytes(value: number): Uint8Array {
  const valueButes = algosdk.encodeUint64(value);
  return concatArrays([new Uint8Array(32 - valueButes.length), valueButes]);
}

export function encodeUint64(value: number | bigint): Uint8Array {
    const bytes: Buffer = Buffer.alloc(8)
    for (let index = 0; index < 8; index++)
        bytes[7 - index] = Number((BigInt(value) >> BigInt(index * 8)) & BigInt(0xFF))
    return new Uint8Array(bytes)
}

export function decodeUint64(value: Uint8Array): bigint {
    let num = BigInt(0)
    for (let index = 0; index < 8 && value?.length; index++)
        num = (num << BigInt(8)) | BigInt(value[index])
    return num
}

export function encodeBase64(value: Uint8Array): string {
    return Buffer.from(value).toString('base64')
}

export function decodeBase64(value: string): Uint8Array {
    return Buffer.from(value, 'base64')
}

export const hexToUint8Array = (hexString: string): Uint8Array => {
  const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;

  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  const array = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    array[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return array;
};

// export const sha256HashLength = 32

// export function sha256Hash(arr: sha512.Message): Uint8Array {
//     return new Uint8Array(sha512.sha512_256.arrayBuffer(arr))
// }

// export function encodeApplicationAddress(id: number): Address {
//     const APP_ID_PREFIX = Buffer.from('appID');
//     const toBeSigned = concatArrays([APP_ID_PREFIX, encodeUint64(BigInt(id))]);
//     return encodeAddress(sha256Hash(toBeSigned));
// }

export function compareArrays(a: [], b: Uint8Array[]) {
    return a.length === b.length && a.reduce((equal, item, index) => equal && item===b[index], true)
}

function getDelta(response: any, key: string): any | undefined {
    const delta = response['global-state-delta'].find((v: any) => v.key === key)
    if (delta === undefined)
        return undefined
    return delta['value']
}

export function getDeltaUint(response: any, key: string): bigint | undefined {
    const delta = getDelta(response, key)
    if (delta === undefined)
        return undefined
    return BigInt(delta['uint'])
}

export function getDeltaBytes(response: any, key: string): Uint8Array | undefined {
    const delta = getDelta(response, key)
    if (delta === undefined)
        return undefined
    return decodeBase64(delta['bytes'])
}

export function toUnix(date: Date) {
    return Math.floor(date.getTime() / 1000)
}

export function fromUnix(timestamp: number) {
    return new Date(timestamp * 1000)
}

export { encodeAddress, decodeAddress } from 'algosdk'
