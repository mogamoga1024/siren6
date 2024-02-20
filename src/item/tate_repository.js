import { ItemRepository } from "./item_repository";
import { calcNedan } from "./buki_tate_kantei";

class TateRepository extends ItemRepository {
    nameList = [];
    inList = [
        {name: 'サビ', fullName: 'サビよけ', kaine: 500, urine: 175},
        {name: '反', fullName: 'カウンター', kaine: 1000, urine: 350},
        {name: '影', fullName: '影縫い返し', kaine: 1000, urine: 350},
        {name: 'ゾ', fullName: 'ゾワゾワ返し', kaine: 1000, urine: 350},
        {name: '暴', fullName: '暴走返し', kaine: 1000, urine: 350},
        {name: '惑', fullName: 'まどわし返し', kaine: 1000, urine: 350},
        {name: '米', fullName: 'おにぎり返し', kaine: 1000, urine: 350},
        {name: '飛', fullName: '高飛び返し', kaine: 8000, urine: 2800},
        {name: '見', fullName: '見切り', kaine: 2000, urine: 700},
        {name: '竜', fullName: 'ドラゴン特防', kaine: 8000, urine: 2800},
        {name: '爆', fullName: '耐爆', kaine: 1000, urine: 350},
        {name: '痛', fullName: '痛恨耐性', kaine: 8000, urine: 2800},
        {name: '鱗', fullName: '防水', kaine: 1000, urine: 350},
        {name: 'ト', fullName: 'トドよけ', kaine: 1000, urine: 350},
        {name: 'ガ', fullName: 'ガマラよけ', kaine: 1000, urine: 350},
        {name: '戯', fullName: 'いたずらよけ', kaine: 1000, urine: 350},
        {name: '握', fullName: 'にぎりよけ', kaine: 8000, urine: 2800},
        {name: '投', fullName: '投げものよけ', kaine: 1000, urine: 350},
        {name: '催', fullName: '催眠よけ', kaine: 1000, urine: 350},
        {name: '魔よ', fullName: '魔法弾よけ', kaine: 1000, urine: 350},
        // {name: '魔反', fullName: '魔法弾反射', kaine: , urine: },
        {name: '不', fullName: '不動', kaine: 2000, urine: 700},
        {name: '受', fullName: '受け身', kaine: 1000, urine: 350},
        {name: '金', fullName: '金食い防御', kaine: 8000, urine: 2800},
        {name: '腹力', fullName: '腹ぢから防御', kaine: 1000, urine: 350},
        {name: '飢', fullName: 'ハングリー', kaine: 1000, urine: 350},
        {name: '根', fullName: '根性', kaine: 1000, urine: 350},
        {name: '満', fullName: '満タン防御', kaine: 1000, urine: 350},
        {name: 'ハラ', fullName: 'ハラモチ', kaine: 500, urine: 175},
        {name: 'サ', fullName: 'サトリ', kaine: 5000, urine: 1750},
        {name: '罠', fullName: '罠よけ', kaine: 1000, urine: 350},
        {name: '0', fullName: '0の守り', kaine: 1000, urine: 350},
        {name: '1', fullName: '1の守り', kaine: 1000, urine: 350},
        {name: '2', fullName: '2の守り', kaine: 1000, urine: 350},
        {name: '3', fullName: '3の守り', kaine: 1000, urine: 350},
        {name: '4', fullName: '4の守り', kaine: 1000, urine: 350},
        {name: '5', fullName: '5の守り', kaine: 1000, urine: 350},
        {name: '6', fullName: '6の守り', kaine: 1000, urine: 350},
        {name: '7', fullName: '7の守り', kaine: 1000, urine: 350},
        {name: '8', fullName: '8の守り', kaine: 1000, urine: 350},
        {name: '9', fullName: '9の守り', kaine: 1000, urine: 350},
        {name: '告', fullName: 'お告げ', kaine: 1000, urine: 350},
        {name: '呪', fullName: '呪いのちから', kaine: 1000, urine: 350},
        {name: '劣', fullName: '劣化', kaine: 1000, urine: 350},
        {name: '薬', fullName: 'HP+5', kaine: 2000, urine: 700},
        {name: '弟', fullName: 'HP+10', kaine: 1000, urine: 350},
        {name: '癒', fullName: 'HP+15', kaine: 3000, urine: 1050},
        {name: '命', fullName: 'HP+20', kaine: 3000, urine: 1050},
    ];

    constructor() {
        super();
        this.canSyukufuku = false;
        const c = this.create;
        this.add(c('木甲の盾', 500, 200));
        this.add(c('青銅甲の盾', 800, 320));
        this.add(c('鉄甲の盾', 1200, 480));
        this.add(c('おにおおかみ', 1500, 600));
        this.add(c('風魔の盾', 6000, 2400));
        this.add(c('螺旋風魔の盾', 15000, 6000));
        this.add(c('金の盾', 2500, 1000));
        this.add(c('バトルカウンター', 2200, 880));
        this.add(c('見切りの盾', 4000, 1600));
        this.add(c('ドラゴンシールド', 3000, 1200));
        this.add(c('爆発隠の盾', 3300, 1320));
        this.add(c('ミノタウロスの盾', 2500, 1000));
        this.add(c('トドよけの盾', 2600, 1040));
        this.add(c('ガマラよけの盾', 2700, 1080));
        this.add(c('いたずらよけの盾', 2800, 1120));
        this.add(c('にぎりよけの盾', 3600, 1440));
        this.add(c('オトトの盾', 2000, 800));
        this.add(c('カッパのお皿', 5000, 2000));
        this.add(c('ゲイズの盾', 4000, 1600));
        this.add(c('魔法よけの盾', 7500, 3000));
        this.add(c('不動の盾', 2500, 1000));
        this.add(c('ざぶとん', 3000, 1200));
        this.add(c('金食い虫の盾', 6000, 2400));
        this.add(c('鉄塊の大盾', 4400, 1760));
        this.add(c('ステーキプレート', 4500, 1800));
        this.add(c('根性の盾', 4600, 1840));
        this.add(c('絶好調の盾', 5000, 2000));
        this.add(c('サトリの盾', 10000, 4000));
        this.add(c('ハラモチの盾', 2000, 800));
        this.add(c('めでたい御守', 5500, 2200));
        this.add(c('お告げの盾', 7000, 2800));
        this.add(c('山姥の鍋ぶた', 4100, 1640));
        this.add(c('使い捨ての盾', 3400, 1360));

        this.nameList = this.itemList.filter(item => item.status === 'normal').map(item => item.name);
    }

    findItemList(searchItemName, isJingi, searchNedan, searchNedanType, searchInList) {
        const result = [];
        let searchItem = null;
        for (const item of this.itemList) {
            if (item.name === searchItemName) {
                searchItem = item;
                break;
            }
        }

        let existsNoroi = false;
        let prevNormalNedan = 0;
        for (let syuseiti = -99; syuseiti <= 99; syuseiti++) {
            if (!existsNoroi) {
                const noroiNedan = calcNedan(searchNedanType, searchItem, isJingi, syuseiti, searchInList, true);
                if (noroiNedan === searchNedan) {
                    existsNoroi = true;
                    result.push({isNoroi: true, syuseiti});
                }
                else if (noroiNedan > searchNedan) {
                    break;
                }
            }
            
            if (prevNormalNedan < searchNedan) {
                const normalNedan = calcNedan(searchNedanType, searchItem, isJingi, syuseiti, searchInList, false);
                if (normalNedan === searchNedan) {
                    result.push({isNoroi: false, syuseiti});
                }
            }
            else if (existsNoroi) {
                break;
            }
        }

        return result;
    }
}

export const tateRepository = new TateRepository();
