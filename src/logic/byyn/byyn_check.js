import { Position, TL, TR, BL, BR } from "./position";
import { NONE, BYYN, TUTI, MIZU, OUT_OF_RANGE } from './cell';

/*
今はさっさと実装することと拡張性を重視し、全マスから全方向に投げて調べるという方針をとる。
もちろん枝刈りすることはできるが、それを保守することや拡張性などを考慮するとわりに合わないと判断した。
*/

let room = [];

export function byynCheck(_room, useUdewa, isTubo) {
    room = _room;

    let pathList = [];
    for (let row = 0; row < room.length; row++) {
        for (let col = 0; col < room.length; col++) {
            for (const dir of [TL, TR, BL, BR]) {
                const startPos = new Position(row, col);
                const path = findByynPath(startPos, dir, useUdewa, isTubo);
                if (path.length > 0) {
                    pathList.push(path);
                }
            }
        }
    }

    let catchablePathList1 = [];
    let catchablePathList2 = [];
    let uncatchablePathList = [];

    for (const path of pathList) {
        const start = path[0];
        const end = path.at(-1);
        if (start.pos.equal(end.pos)) {
            // 巡回してキャッチ
            if (start.dir.equal(end.dir)) {
                catchablePathList1.push(path);
            }
            // 角に当たった後、戻ってきてキャッチ
            else {
                catchablePathList2.push(path);
            }
        }
        else {
            uncatchablePathList.push(path);
        }
    }

    pathList = [];

    // catchablePathList1削減

    while (catchablePathList1.length > 0) {
        const path = catchablePathList1.shift();
        pathList.push(path);

        const {pos: pos1, dir: dir1} = path[0];

        catchablePathList1 = catchablePathList1.filter(path => {
            for (const {pos: pos2, dir: dir2} of path) {
                if (pos1.equal(pos2) && (dir1.equal(dir2) || dir1.equal(dir2.reverse()))) {
                    return false;
                }
            }
            return true;
        });
    }

    // catchablePathList2削減

    catchablePathList2.sort((path1, path2) => {
        return path1.length - path2.length;
    });

    while (catchablePathList2.length > 0) {
        const path = catchablePathList2.shift();
        pathList.push(path);

        const {pos: pos1, dir: dir1} = path[(path.length - 1) / 2];

        catchablePathList2 = catchablePathList2.filter(path => {
            const {pos: pos2, dir: dir2} = path[(path.length - 1) / 2];
            return !(pos1.equal(pos2) && dir1.equal(dir2));
        });
    }

    // uncatchablePathList削減

    uncatchablePathList.sort((path1, path2) => {
        const lastPos1 = path1.at(-1).pos;
        const lastPos2 = path2.at(-1).pos;
        if (lastPos1 === null && lastPos2 === null) {
            return path1.length - path2.length;
        }
        else if (lastPos1 === null) {
            return 1;
        }
        else if (lastPos2 === null) {
            return -1;
        }
        return path1.length - path2.length;
    });

    while (uncatchablePathList.length > 0) {
        const path = uncatchablePathList.shift();
        pathList.push(path);

        let pos1 = null, dir1 = null;
        if (path.at(-1).pos === null) {
            ({pos: pos1, dir: dir1} = path.at(-2));
        }
        else {
            ({pos: pos1, dir: dir1} = path.at(-1));
        }
        
        uncatchablePathList = uncatchablePathList.filter(path => {
            let pos2 = null, dir2 = null;
            if (path.at(-1).pos === null) {
                ({pos: pos2, dir: dir2} = path.at(-2));
            }
            else {
                ({pos: pos2, dir: dir2} = path.at(-1));
            }
            return !(pos1.equal(pos2) && dir1.equal(dir2));
        });
    }

    return pathList;
}

function findByynPath(startPos, dir, useUdewa, isTubo) {
    if (typeFrom(startPos, useUdewa) !== NONE) {
        return [];
    }
    
    const isHit = {
        top: false, bottom: false,
        left: false, right: false
    };

    let prevType = NONE;
    let pos = startPos;
    const path = [{pos, dir}];

    let reflectCount = 0;
    const maxReflectCount = 24;

    let unreflectCount = 0;
    const maxUnreflectCount = 10;

    while (true) {
        // 移動
        pos = pos.add(dir);

        const type = typeFrom(pos, useUdewa);
        if (type === OUT_OF_RANGE) {
            // どこ行くねーん
            path.push({pos: null, dir});
            return canBunretu(isHit) ? path : [];
        }
        else if (type === NONE || type === MIZU) {
            // 何もしない
            path.push({pos, dir});

            unreflectCount++;

            if (unreflectCount >= maxUnreflectCount) {
                if (type === MIZU) return [];
                return canBunretu(isHit) ? path : [];
            }
        }
        else if (type === BYYN) {
            const hAdjType = typeFrom(pos.add(0, -dir.col), useUdewa, true);
            const vAdjType = typeFrom(pos.add(-dir.row, 0), useUdewa, true);

            if (reflectCount >= maxReflectCount) {
                if (prevType === MIZU) return [];
                return canBunretu(isHit) ? path : [];
            }
            // 3つパターン
            else if (hAdjType === BYYN && vAdjType === BYYN) {
                if (prevType === MIZU) return [];
                return canBunretu(isHit) ? path : [];
            }
            else if (hAdjType === BYYN && vAdjType === TUTI) {
                if (prevType === MIZU) return [];
                return canBunretu(isHit) ? path : [];
            }
            else if (hAdjType === TUTI && vAdjType === BYYN) {
                if (prevType === MIZU) return [];
                return canBunretu(isHit) ? path : [];
            }
            else if (hAdjType === TUTI && vAdjType === TUTI) {
                // 正反対に戻る
                dir = dir.reverse();
                pos = pos.add(dir);
            }
            // 2つパターン
            else if (hAdjType === BYYN && vAdjType === NONE) {
                // 横向きの壁で反射

                if (typeFrom(pos, false) === BYYN) {
                    if (dir.row > 0) {
                        isHit.top = true;
                    }
                    else {
                        isHit.bottom = true;
                    }
                }

                dir = dir.hReflect();
                pos.row += dir.row;
                path.push({pos, dir});
            }
            else if (hAdjType === TUTI && vAdjType === NONE) {
                // 正反対に戻る
                dir = dir.reverse();
                pos = pos.add(dir);
            }
            else if (hAdjType === NONE && vAdjType === BYYN) {
                // 縦向きの壁で反射

                if (typeFrom(pos, false) === BYYN) {
                    if (dir.col > 0) {
                        isHit.right = true;
                    }
                    else {
                        isHit.left = true;
                    }
                }
                
                dir = dir.vReflect();
                pos.col += dir.col;
                path.push({pos, dir});
            }
            else if (hAdjType === NONE && vAdjType === TUTI) {
                // 正反対に戻る
                dir = dir.reverse();
                pos = pos.add(dir);
            }
            // 1つパターン
            else if (hAdjType === NONE && vAdjType === NONE) {
                // 正反対に戻る
                dir = dir.reverse();
                pos = pos.add(dir);
            }
            // アサート
            else {
                throw new Error(`想定外の経路 dir: ${dir.toString()}, hAdjType: ${hAdjType}, vAdjType: ${vAdjType}`);
            }

            reflectCount++;
            unreflectCount = 1;
        }
        else if (type === TUTI) {
            if (isTubo || prevType === MIZU) {
                return [];
            }
            path.at(-1).isTuboCrash = true;
            return canBunretu(isHit) ? path : [];
        }
        else {
            throw new Error(`想定外のtype: ${type}`);
        }

        // キャッチしたら終了
        if (pos.equal(startPos)) {
            return canBunretu(isHit) ? path : [];
        }

        prevType = type;
    }
}

function canBunretu(isHit) {
    return isHit.top && isHit.bottom && isHit.left && isHit.right;
}

function typeFrom(pos, useUdewa, ignoreMizu = false) {
    if (
        0 <= pos.row && pos.row < room.length &&
        0 <= pos.col && pos.col < room.length
    ) {
        const type = room[pos.row][pos.col];
        if (useUdewa && type === TUTI) {
            return BYYN;
        }
        if (ignoreMizu && type === MIZU) {
            return NONE;
        }
        return type;
    }
    return OUT_OF_RANGE;
}
