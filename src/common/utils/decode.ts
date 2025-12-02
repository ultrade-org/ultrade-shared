import algosdk, { encodeAddress } from "algosdk";
import { AlgoOrder } from "../../types/algo-order.type";

const orderByteSize = 28;

export const getAccounInfoFormLocalStorage = (localState) => {
  const uintArray = Buffer.from(localState, 'base64');
  const unpackedData = unpackData( uintArray as Uint8Array, {
    "priceCoin_locked": {
      type: "uint",
    },
    "priceCoin_available": {
      type: "uint",
    },
    "baseCoin_locked": {
      type: "uint",
    },
    "baseCoin_available": {
      type: "uint",
    },
    "companyId": {
      type: "uint",
    },
    "WLFeeShare": {
      type: "uint",
    },
    "WLCustomFee": {
      type: "uint",
    },
    "slotMap": {
      type: "uint",
    },
  })
  return unpackedData;
  }
  
export function unpackData(data, format) {
  const result = new Map();
  let index = 0;
  for (const [name, type] of Object.entries<any>(format)) {
    if (index >= data.length) {
      throw new Error('Array index out of bounds')
    }

    let value;
    switch (type.type) {
      case 'address':
        value = encodeAddress(data.slice(index, index + 32))
        index += 32
      break
      case 'bytes':
        value = data.slice(index, index + type.size)
        value = algosdk.decodeUint64(value, "mixed");
        index += type.size
      break
      case 'uint':
        value = algosdk.decodeUint64(data.slice(index, index + 8), "mixed");
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

export function decodeString(value: Uint8Array): string {
  return Buffer.from(value).toString('utf-8')
}

export const printUnpackedLocalData = (localState): Array<AlgoOrder> => {
  const uintArray = Buffer.from(localState, 'base64');
  const unpackedData = [];
    for(let i = 0; i<4; i++){
      let data = unpackData( uintArray.subarray(orderByteSize * i, orderByteSize * (i + 1)), {
        "orderID": {
          type: "uint",
        },
        "side": {
          type: "string",
          size:1
        },
        "price": {
          type: "uint",
        },
        "amount": {
          type: "uint",
        },
        "type": {
          type: "string",
          size: 1
        },
        "directSettle": {
          type: "string",
          size: 1
        },
        "storageSlot": {
          type: "bytes",
          size: 1
        }
      })
      unpackedData.push(data);
    }
  return unpackedData;
}
