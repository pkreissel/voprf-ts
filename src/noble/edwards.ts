// Copyright (c) 2021 Cloudflare, Inc. and contributors.
// Copyright (c) 2021 Cloudflare, Inc.
// Licensed under the BSD-3-Clause license found in the LICENSE file or
// at https://opensource.org/licenses/BSD-3-Clause

import { Field } from '@noble/curves/abstract/modular'
import type { CHash } from '@noble/hashes/utils'
import type { CurveFn } from '@noble/curves/abstract/edwards'
import type { ElementSpec, GroupParams, ScalarHash } from './types.js'
import type { HashID } from '../cryptoTypes.js'

export interface MakeEdParamsParams {
    curve: CurveFn
    scalarHash: ScalarHash
    element: ElementSpec
    hashID: HashID
    hash: CHash
}

export function makeEdParams({
    curve,
    hashID,
    scalarHash,
    element,
    hash
}: MakeEdParamsParams): GroupParams {
    // Leave bitLen undefined (and not curve.CURVE.nBitLength) as ed448 sets it to
    // 448+8 = 456 internally so scalars will be output in the "wrong" size
    const scalarField = Field(curve.CURVE.n, undefined, true)
    // Ditto
    const elementField = Field(curve.CURVE.p)
    return {
        isEdwards: true,

        scalar: {
            field: scalarField,
            size: scalarField.BYTES,
            hash: scalarHash
        },

        element: {
            ...element,
            size: {
                compressed: elementField.BYTES,
                standard: elementField.BYTES
            }
        },

        hash: {
            id: hashID,
            size: hash.outputLen,
            fn: hash
        }
    }
}
