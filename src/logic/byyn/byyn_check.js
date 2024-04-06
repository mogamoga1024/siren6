import { Position, T, B, L, R, TL, TR, BL, BR } from "./position";
import { NONE, BYYN, TUTI, OUT_OF_RANGE } from './cell';

/*
今はさっさと実装することと拡張性を重視し、全マスから全方向に投げて調べるという方針をとる。
もちろん枝刈りすることはできるが、それを保守することや拡張性などを考慮するとわりに合わないと判断した。
*/

let room = [];
let useUdewa = false;

export function byynCheck(_room, _useUdewa, isTubo) {
    room = _room;
    useUdewa = _useUdewa;
}

function byynCheck1(startPos, dir, isTubo) {
    if (typeFrom(startPos) !== NONE) {
        return false;
    }
    
    let pos = pos = startPos.add(dir);

    const isHit = {
        top: false, bottom: false,
        left: false, right: false
    };

    while (true) {
        // todo キャッチしたら終了

        const type = typeFrom(pos);
        if (type === OUT_OF_RANGE) {
            // どこ行くねーん
            return settlePath(isHit); // todo 壺割れ
        }
        else if (type === NONE) {
            pos = pos.add(dir);
        }
        else if (type === BYYN) {
            if (dir === TL) {
                const rightType = typeFrom(pos.add(R));
                const bottomType = typeFrom(pos.add(B));

                // 3つパターン
                if (rightType === BYYN && bottomType === BYYN) {
                    return settlePath(isHit);
                }
                else if (rightType === BYYN && bottomType === TUTI) {
                    return settlePath(isHit);
                }
                else if (rightType === TUTI && bottomType === BYYN) {
                    return settlePath(isHit);
                }
                else if (rightType === TUTI && bottomType === TUTI) {
                    // todo 右下に反射
                }
                // 2つパターン
                else if (rightType === BYYN && bottomType === NONE) {
                    // todo 左下に反射
                }
                else if (rightType === TUTI && bottomType === NONE) {
                    // todo 右下に反射
                }
                else if (rightType === NONE && bottomType === BYYN) {
                    // todo 右上に反射
                }
                else if (rightType === NONE && bottomType === TUTI) {
                    // todo 右下に反射
                }
                // 1つパターン
                else if (rightType === NONE && bottomType === NONE) {
                    // todo 右下に反射
                }
                // アサート
                else {
                    throw new Error(`想定外の経路 dir: ${dir.name}, r: ${rightType}, b: ${bottomType}`);
                }
            }
            // todo
        }
        else if (type === TUTI) {
            // todo 壺クラッシュ
            return settlePath(isHit);
        }
        else {
            throw new Error(`想定外のtype: ${type}`);
        }
    }
}

// 分裂した   → アイテムが停止するまでの経路
// 分裂しない → false
function settlePath(isHit) {
    if (
        isHit.top && isHit.bottom &&
        isHit.left && isHit.right
    ) {
        return []; // todo 道筋 and 壺クラッシュ？
    }
    return false;
}

function typeFrom(pos) {
    if (
        0 <= pos.row && pos.row < room.length &&
        0 <= pos.col && pos.col < room.length
    ) {
        const type = room[pos.row][pos.col];
        if (useUdewa && type === TUTI) {
            return BYYN;
        }
        return type;
    }
    return OUT_OF_RANGE;
}
