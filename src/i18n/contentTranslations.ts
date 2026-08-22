import { LanguageCode } from './config';

export interface LocalizedTourContent {
  title: string;
  description: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary?: Array<{
    title: string;
    description: string;
    meals?: string;
    activity?: string;
  }>;
}

export interface LocalizedHotelContent {
  name: string;
  description: string;
  amenities: string[];
}

export interface LocalizedCarContent {
  name: string;
  description: string;
  features: string[];
  chauffeur_included_services: string[];
}

export interface LocalizedFlightContent {
  title: string;
  type: string;
  departure_location: string;
  arrival_location: string;
  description: string;
  amenities: string[];
}

export interface LocalizedBlogContent {
  title: string;
  excerpt: string;
  content: string;
}

export interface LocalizedReviewContent {
  title: string;
  content: string;
}

// ============================================================================
// CATEGORY & LOCATION TRANSLATIONS
// ============================================================================

export const CATEGORY_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  EN: {
    'Luxury': 'Luxury',
    'Safari': 'Safari',
    'Cultural': 'Cultural',
    'Adventure': 'Adventure',
    'Eco': 'Eco',
    'All': 'All',
  },
  JP: {
    'Luxury': 'ラグジュアリー',
    'Safari': 'サファリ',
    'Cultural': '歴史・文化体験',
    'Adventure': 'アクティビティ・冒険',
    'Eco': 'エコ・自然',
    'All': 'すべて',
  },
  DE: {
    'Luxury': 'Luxus',
    'Safari': 'Safari',
    'Cultural': 'Kultur',
    'Adventure': 'Abenteuer',
    'Eco': 'Öko',
    'All': 'Alle',
  },
  FR: {
    'Luxury': 'Luxe',
    'Safari': 'Safari',
    'Cultural': 'Culturel',
    'Adventure': 'Aventure',
    'Eco': 'Éco',
    'All': 'Tous',
  },
  NL: {
    'Luxury': 'Luxe',
    'Safari': 'Safari',
    'Cultural': 'Cultureel',
    'Adventure': 'Avontuur',
    'Eco': 'Ecologisch',
    'All': 'Alles',
  },
  CN: {
    'Luxury': '奢华探险',
    'Safari': '野生动物丛林',
    'Cultural': '历史文化',
    'Adventure': '户外冒险',
    'Eco': '生态自然',
    'All': '全部',
  },
  RU: {
    'Luxury': 'Люкс',
    'Safari': 'Сафари',
    'Cultural': 'Культура',
    'Adventure': 'Приключения',
    'Eco': 'Эко',
    'All': 'Все',
  },
  IN: {
    'Luxury': 'लक्जरी',
    'Safari': 'जंगल सफारी',
    'Cultural': 'सांस्कृतिक',
    'Adventure': 'साहसिक',
    'Eco': 'इको',
    'All': 'सभी',
  },
  AE: {
    'Luxury': 'فاخرة',
    'Safari': 'سفاري',
    'Cultural': 'ثقافية',
    'Adventure': 'مغامرة',
    'Eco': 'بيئية',
    'All': 'الكل',
  },
  SI: {
    'Luxury': 'සුඛෝපභෝගී',
    'Safari': 'වනජීවී සෆාරි',
    'Cultural': 'සංස්කෘතික',
    'Adventure': 'සාහසික සංචාර',
    'Eco': 'ස්වාභාවික සංචාර',
    'All': 'සියල්ල',
  },
};

export const LOCATION_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  EN: {
    'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka': 'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka',
    'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka': 'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka',
    'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka': 'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka',
    'Trincomalee, Nilaveli & Sigiriya, Sri Lanka': 'Trincomalee, Nilaveli & Sigiriya, Sri Lanka',
    'Galle Fort': 'Galle Fort',
    'Yala National Park': 'Yala National Park',
    'Hatton & Castlereagh': 'Hatton & Castlereagh',
    'Sigiriya': 'Sigiriya',
    'Weligama & Mirissa': 'Weligama & Mirissa',
    'Colombo': 'Colombo',
  },
  JP: {
    'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka': 'スリランカ（シギリヤ、キャンディ、エラ、ヤラ、ゴール）',
    'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka': 'スリランカ（ヌワラエリヤ、ハットン、ホートンプレインズ、エラ）',
    'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka': 'スリランカ（ヤラ、ウダワラウェ、ミリッサ、ベントタ）',
    'Trincomalee, Nilaveli & Sigiriya, Sri Lanka': 'スリランカ（トリンコマリー、ニラヴェリ、シギリヤ）',
    'Galle Fort': 'ゴール要塞',
    'Yala National Park': 'ヤラ国立公園',
    'Hatton & Castlereagh': 'ハットン＆キャッスルレイ',
    'Sigiriya': 'シギリヤ',
    'Weligama & Mirissa': 'ウェリガマ＆ミリッサ',
    'Colombo': 'コロンボ',
  },
  DE: {
    'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka': 'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka',
    'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka': 'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka',
    'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka': 'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka',
    'Trincomalee, Nilaveli & Sigiriya, Sri Lanka': 'Trincomalee, Nilaveli & Sigiriya, Sri Lanka',
    'Galle Fort': 'Festung Galle',
    'Yala National Park': 'Yala-Nationalpark',
    'Hatton & Castlereagh': 'Hatton & Castlereagh',
    'Sigiriya': 'Sigiriya',
    'Weligama & Mirissa': 'Weligama & Mirissa',
    'Colombo': 'Colombo',
  },
  FR: {
    'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka': 'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka',
    'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka': 'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka',
    'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka': 'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka',
    'Trincomalee, Nilaveli & Sigiriya, Sri Lanka': 'Trincomalee, Nilaveli & Sigiriya, Sri Lanka',
    'Galle Fort': 'Fort de Galle',
    'Yala National Park': 'Parc National de Yala',
    'Hatton & Castlereagh': 'Hatton & Castlereagh',
    'Sigiriya': 'Sigiriya',
    'Weligama & Mirissa': 'Weligama & Mirissa',
    'Colombo': 'Colombo',
  },
  NL: {
    'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka': 'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka',
    'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka': 'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka',
    'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka': 'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka',
    'Trincomalee, Nilaveli & Sigiriya, Sri Lanka': 'Trincomalee, Nilaveli & Sigiriya, Sri Lanka',
    'Galle Fort': 'Galle Fort',
    'Yala National Park': 'Yala Nationaal Park',
    'Hatton & Castlereagh': 'Hatton & Castlereagh',
    'Sigiriya': 'Sigiriya',
    'Weligama & Mirissa': 'Weligama & Mirissa',
    'Colombo': 'Colombo',
  },
  CN: {
    'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka': '斯里兰卡（锡吉里耶、康提、埃拉、雅拉、加勒）',
    'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka': '斯里兰卡（努瓦勒埃利耶、哈顿、霍顿平原、埃拉）',
    'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka': '斯里兰卡（雅拉、乌达瓦拉维、米瑞莎、本托塔）',
    'Trincomalee, Nilaveli & Sigiriya, Sri Lanka': '斯里兰卡（亭可马里、尼拉韦利、锡吉里耶）',
    'Galle Fort': '加勒古堡',
    'Yala National Park': '雅拉国家公园',
    'Hatton & Castlereagh': '哈顿与卡斯尔雷',
    'Sigiriya': '锡吉里耶',
    'Weligama & Mirissa': '韦利格玛与米瑞莎',
    'Colombo': '科伦坡',
  },
  RU: {
    'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka': 'Шри-Ланка (Сигирия, Канди, Элла, Яла, Галле)',
    'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka': 'Шри-Ланка (Нувара-Элия, Хаттон, плато Хортон, Элла)',
    'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka': 'Шри-Ланка (Яла, Удавалаве, Мирисса, Бентота)',
    'Trincomalee, Nilaveli & Sigiriya, Sri Lanka': 'Шри-Ланка (Тринкомали, Нилавели, Сигирия)',
    'Galle Fort': 'Форт Галле',
    'Yala National Park': 'Национальный парк Яла',
    'Hatton & Castlereagh': 'Хаттон и Кастлри',
    'Sigiriya': 'Сигирия',
    'Weligama & Mirissa': 'Велигама и Мирисса',
    'Colombo': 'Коломбо',
  },
  IN: {
    'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka': 'श्रीलंका (सिगिरिया, केंडी, एला, याला, गाले)',
    'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka': 'श्रीलंका (नुवारा एलिया, हैटन, हॉर्टन प्लेन्स, एला)',
    'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka': 'श्रीलंका (याला, उदावालावे, मिरिसा, बेंटोटा)',
    'Trincomalee, Nilaveli & Sigiriya, Sri Lanka': 'श्रीलंका (त्रिंकोमाली, निलावेली, सिगिरिया)',
    'Galle Fort': 'गाले किला',
    'Yala National Park': 'याला राष्ट्रीय उद्यान',
    'Hatton & Castlereagh': 'हैटन और कास्टलरी',
    'Sigiriya': 'सिगिरिया',
    'Weligama & Mirissa': 'वेलिगामा और मिरिसा',
    'Colombo': 'कोलंबो',
  },
  AE: {
    'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka': 'سريلانكا (سيجيريا، كاندي، إيلا، يالا، جالي)',
    'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka': 'سريلانكا (نووارا إيليا، هاتون، هورتون بلينز، إيلا)',
    'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka': 'سريلانكا (يالا، أوداوالاوي، ميريسا، بينتوتا)',
    'Trincomalee, Nilaveli & Sigiriya, Sri Lanka': 'سريلانكا (ترينكومالي، نيلافيللي، سيجيريا)',
    'Galle Fort': 'قلعة جالي التاريخية',
    'Yala National Park': 'محمية يالا الوطنية',
    'Hatton & Castlereagh': 'هاتون وكاستلري',
    'Sigiriya': 'سيجيريا',
    'Weligama & Mirissa': 'فيليجاما وميريسا',
    'Colombo': 'كولومبو',
  },
  SI: {
    'Sigiriya, Kandy, Ella, Yala & Galle, Sri Lanka': 'සීගිරිය, මහනුවර, ඇල්ල, යාල සහ ගාල්ල, ශ්‍රී ලංකාව',
    'Nuwara Eliya, Hatton, Horton Plains & Ella, Sri Lanka': 'නුවරඑළිය, හැටන්, හෝටන් තැන්න සහ ඇල්ල, ශ්‍රී ලංකාව',
    'Yala, Udawalawe, Mirissa & Bentota, Sri Lanka': 'යාල, උඩවලව, මිරිස්ස සහ බෙන්තොට, ශ්‍රී ලංකාව',
    'Trincomalee, Nilaveli & Sigiriya, Sri Lanka': 'ත්‍රිකුණාමලය, නිලාවේලි සහ සීගිරිය, ශ්‍රී ලංකාව',
    'Galle Fort': 'ගාලු කොටුව',
    'Yala National Park': 'යාල ජාතික වනෝද්‍යානය',
    'Hatton & Castlereagh': 'හැටන් සහ කැස්ලරී',
    'Sigiriya': 'සීගිරිය',
    'Weligama & Mirissa': 'වැලිගම සහ මිරිස්ස',
    'Colombo': 'කොළඹ',
  },
};

// ============================================================================
// DYNAMIC TOUR CONTENT TRANSLATIONS
// ============================================================================

export const TOUR_TRANSLATIONS: Record<LanguageCode, Record<string, LocalizedTourContent>> = {
  EN: {
    'tour-lk-001': {
      title: 'Grand Ceylon Heritage: Sigiriya, Kandy, Ella & Yala Luxury Expedition',
      description: 'Immerse in the timeless wonder of Sri Lanka. Ascend the ancient rock citadel of Sigiriya at sunrise, honor the Sacred Tooth Relic in Kandy, travel the legendary Ella mountain railway, embark on private leopard safaris in Yala, and unwind in the colonial ramparts of Galle Fort.',
      highlights: [
        'Private VIP dawn ascent of UNESCO Sigiriya Rock Fortress with an archaeologist',
        'First-Class Observation car on the iconic Kandy to Ella Scenic Tea Highlands train',
        'Dawn & dusk game drives in custom open-top 4x4 Land Cruisers inside Yala National Park Block 1',
        'Stay at iconic Relais & Châteaux tea planter bungalows and seaside luxury sanctuaries',
        'Private cinnamon masterclass and sunset cocktail stroll along the ramparts of Galle Fort',
      ],
      included: [
        '7 nights in 5-star heritage hotels & luxury safari glamping suites',
        'All gourmet meals, Ceylon high teas, and private dining pavilions',
        'Chauffeur-driven luxury Mercedes/Land Cruiser with English-speaking National Tourist Guide',
        'All VIP national park permits, tracker fees, and monument admissions',
      ],
      excluded: [
        'International flights to Colombo (CMB)',
        'Sri Lanka electronic travel authorization (ETA visa)',
        'Gratuities and personal bar expenses',
      ],
    },
    'tour-lk-002': {
      title: 'Ceylon Tea Trails, Horton Plains & Adam Peak Odyssey',
      description: 'Immerse in the misty grandeur of Sri Lanka high country. Stay in restored Victorian planter bungalows, trek Horton Plains to Worlds End precipice, witness sunrise over Adams Peak, and savor rare single-origin Ceylon white teas.',
      highlights: [
        'Luxury stay at Ceylon Tea Trails Relais & Châteaux bungalows',
        'Guided trek across Horton Plains National Park to Worlds End & Bakers Falls',
        'Private Master Tea Blender experience & artisanal tasting',
        'Scenic helicopter transfer option over Castlereagh Reservoir',
      ],
      included: [
        '5 nights in five-star tea estate suites with private butler',
        'All meals, high teas, and sommelier-selected wines',
        'Dedicated Mercedes chauffeur-guide and national park permits',
      ],
      excluded: ['International airfare', 'Personal insurance'],
    },
    'tour-lk-003': {
      title: 'Southern Wild Safari & Whale Watching Marine Expedition',
      description: 'Encounter Sri Lanka majestic Big Four: the elusive Sri Lankan leopard, the Asian elephant, the sloth bear, and the colossal Blue Whale. Luxury ocean-view villas and exclusive private yacht charters off Mirissa.',
      highlights: [
        'Private 45-foot luxury catamaran whale watching charter in Mirissa',
        'Exclusive full-day leopard tracking in Yala Block 1 with senior wildlife naturalist',
        'Elephant transit home visit in Udawalawe National Park',
        'Beachside ocean sanctuary pool villa in Cape Weligama',
      ],
      included: [
        '6 nights in five-star coastal retreats & luxury safari camps',
        'Private catamaran charter with marine biologist',
        'All 4x4 open-top game drives with binoculars and refreshments',
      ],
      excluded: ['International airfare', 'Discretionary tips'],
    },
    'tour-lk-004': {
      title: 'Pristine East Coast & Cultural Heritage of Trincomalee',
      description: 'Discover the untouched gold-sand beaches of Sri Lanka eastern coast. Snorkel crystal-clear coral reefs at Pigeon Island National Park, explore Koneswaram Temple perched atop Swami Rock, and unwind at beachfront luxury sanctuaries.',
      highlights: [
        'Private marine reserve snorkeling at Pigeon Island Marine National Park',
        'Koneswaram Hindu Temple atop the dramatic cliffs of Swami Rock',
        'Uncrowded tranquil white sand beaches of Nilaveli',
      ],
      included: [
        '5 nights in five-star beachfront luxury resorts in Nilaveli & Trincomalee',
        'Private boat transfers to Pigeon Island with marine guide',
        'All gourmet meals and private vehicle transfers',
      ],
      excluded: ['International flights', 'Scuba diving certification fees'],
    },
  },
  JP: {
    'tour-lk-001': {
      title: '14日間 究極のスリランカ最高峰グランドツアー (シギリヤ・キャンディ・エラ・ヤラ)',
      description: 'スリランカの時を超える魅力を極上のプライベート空間で巡る。朝靄に包まれる古代要塞シギリヤの登頂、キャンディ聖歯寺での特別参拝、エラへ向かう名物高原列車、ヤラ国立公園でのヒョウ追跡プライベートサファリ、そしてゴール要塞のコロニアルな散策をお楽しみいただけます。',
      highlights: [
        '専属考古学者と巡るシギリヤロック要塞 朝の特別VIP登頂ツアー',
        'キャンディ〜エラ間を走る絶景山岳列車の1等車特別展望シート',
        'ヤラ国立公園でのカスタム仕様4WDジープによるオープンサファリ',
        'ルレ・エ・シャトー認定の歴史的ティーインや5つ星ビーチリゾートでの滞在',
        'ゴール要塞でのプライベート・シナモン調合体験と夕日カクテル'
      ],
      included: [
        '5つ星ヘリテージホテル＆ラグジュアリーサファリロッジでの7泊宿泊',
        '全お食事、ハイティー、プライベートパビリオンでのスペシャルディナー',
        '専属英語ガイドドライバー（専用メルセデス/ランドクルーザー手配）',
        '全国立公園入場許可証、VIPトラッカー手配費用'
      ],
      excluded: [
        'コロンボ（CMB）までの国際線航空券',
        'スリランカETA電子渡航認証（ビザ費用）',
        'チップおよび個人でご注文のドリンク類'
      ],
    },
    'tour-lk-002': {
      title: 'セイロンティー・トレイルとホートン・プレインズ＆アダムスピーク探検 6日間',
      description: 'スリランカ紅茶文化と霧深き高原地帯を味わい尽くす旅。ヴィクトリア時代の邸宅ホテルに滞在し、ホートンプレインズの「世界の終わり」断崖絶壁をハイキング。伝統あるセイロンティーの最高峰を堪能します。',
      highlights: [
        'ルレ・エ・シャトー認定 セイロンティートレイルズのヴィラ滞在',
        'ホートン・プレインズ国立公園からワールド・エンドへの専属ガイドハイキング',
        'マスター・ティー・ブレンダーによる手摘み体験＆プライベートテイスティング',
        'キャッスルレイ貯水池上空を飛ぶ絶景ヘリコプター移送オプション'
      ],
      included: [
        '専属バトラー付き5つ星紅茶園スイートに5泊',
        '全お食事、ハイティー、ソムリエ厳選ワイン',
        '専用メルセデス車手配および国立公園許可証'
      ],
      excluded: ['国際線航空券', '海外旅行保険'],
    },
    'tour-lk-003': {
      title: '南海岸野生動物サファリ＆ミリッサ鯨類ホエールウォッチング海洋探検 7日間',
      description: 'スリランカのビッグ4（ヒョウ、象、ナマケグマ、シロナガスクジラ）に出会う冒険。オーシャンビューのプライベートヴィラとミリッサ沖の専用ラグジュアリーヨットクルーズをお約束します。',
      highlights: [
        'ミリッサ沖でのプライベート型ラグジュアリーカタマランヨットチャーター',
        'シニア野生動物ナチュラリストと行くヤラ国立公園でのヒョウ追跡サファリ',
        'ウダワラウェ国立公園での象の保護施設訪問',
        'ケープ・ウェリガマでのオーシャンビュープールヴィラ滞在'
      ],
      included: [
        '5つ星ビーチリゾート＆サファリキャンプでの6泊宿泊',
        '海洋生物学者が同行する専用カタマランヨットチャーター',
        'すべての4x4サファリジープ手配（双眼鏡・軽食付き）'
      ],
      excluded: ['国際線航空券', 'ドライバーやガイドへのチップ'],
    },
    'tour-lk-004': {
      title: '未開の東海岸とトリンコマリーの文化遺産 6日間',
      description: 'スリランカ東海岸の静寂な黄金色のビーチと珊瑚礁探検。ピジョン・アイランド国立公園でのシュノーケリングや崖の上に立つコネスワラム寺院を訪ねます。',
      highlights: [
        'ピジョン・アイランド海洋国立公園でのプライベートシュノーケリング',
        'スワミ・ロックの断崖に位置するコネスワラムヒンドゥー寺院の参拝',
        'ニラヴェリの透明度抜群なプライベートビーチ'
      ],
      included: [
        '5つ星ビーチフロントリゾートに5泊',
        'ピジョンアイランドへの専用ボート手配およびマリンガイド',
        '全お食事および専用車での送迎'
      ],
      excluded: ['国際線航空券', 'スキューバダイビングライセンス費用'],
    },
  },
  DE: {
    'tour-lk-001': {
      title: 'Grand Ceylon Heritage: Sigiriya, Kandy, Ella & Yala Luxus-Expedition (14 Tage)',
      description: 'Erleben Sie die zeitlose Magie Sri Lankas. Besteigen Sie die antike Felsenfestung Sigiriya bei Sonnenaufgang, besuchen Sie den heiligen Zahntempel in Kandy, reisen Sie mit der legendären Hochlandbahn und erleben Sie Leopardensafaris in Yala.',
      highlights: [
        'VIP-Morgenaufstieg zur UNESCO-Felsenfestung Sigiriya mit einem Archäologen',
        'Erste-Klasse-Aussichtswagen im Panoramazug von Kandy nach Ella',
        'Private Safari-Fahrten im offenen 4x4 Land Cruiser im Yala-Nationalpark',
        'Aufenthalt in Relais & Châteaux Tee-Bungalows und Luxus-Resorts am Meer',
        'Privater Zimt-Workshop und Cocktail-Spaziergang in Galle Fort',
      ],
      included: [
        '7 Nächte in 5-Sterne-Heritage-Hotels & Safari-Suiten',
        'Alle Gourmet-Mahlzeiten, High Teas und private Dinner-Pavillons',
        'Chauffeur-getriebenes Luxusfahrzeug mit englischsprachigem Guide',
        'Alle Nationalpark-Permits und Eintrittsgelder',
      ],
      excluded: ['Internationale Flüge nach Colombo', 'Visumgebühren (ETA)', 'Trinkgelder'],
    },
    'tour-lk-002': {
      title: 'Ceylon Tea Trails, Horton Plains & Adam Peak Odyssee',
      description: 'Tauchen Sie ein in die neblige Pracht des sri-lankischen Hochlandes. Übernachten Sie in restaurierten Teeplantagen-Bungalows und wandern Sie im Horton-Plains-Nationalpark bis zum Abgrund World’s End.',
      highlights: [
        'Luxusaufenthalt in Ceylon Tea Trails Relais & Châteaux Bungalows',
        'Geführte Wanderung über die Horton Plains zum World’s End',
        'Exklusive Teemeister-Erfahrung mit Verkostung',
        'Helikopter-Transfer-Option über den Castlereagh-Stausee',
      ],
      included: ['5 Nächte in 5-Sterne-Suiten mit privatem Butler', 'Gourmet-Verpflegung & Weine'],
      excluded: ['Flüge', 'Versicherungen'],
    },
    'tour-lk-003': {
      title: 'Süd-Wildnis Safari & Blauwal-Beobachtungs-Expedition',
      description: 'Begegnen Sie den Big Four Sri Lankas: Leopard, Elefant, Lippenbär und Blauwal. Luxuriöse Villen mit Meerblick und private Katamaran-Charter in Mirissa.',
      highlights: [
        'Privater Luxus-Katamaran zur Walbeobachtung in Mirissa',
        'Ganztägige Leoparden-Safari im Yala-Block 1',
        'Besuch des Elefanten-Waisenhauses Udawalawe',
      ],
      included: ['6 Nächte in 5-Sterne-Resorts & Safari-Camps', 'Katamaran-Charter'],
      excluded: ['Internationale Flüge'],
    },
    'tour-lk-004': {
      title: 'Ostküste & Kultur erbe von Trincomalee',
      description: 'Entdecken Sie die unberührten Goldstrände der Ostküste Sri Lankas. Schnorcheln Sie im Pigeon Island Marine Nationalpark.',
      highlights: ['Schnorcheln im Meeresschutzgebiet Pigeon Island', 'Koneswaram-Tempel auf Swami Rock'],
      included: ['5 Nächte im 5-Sterne-Strandresort', 'Bootstransfers'],
      excluded: ['Flüge'],
    },
  },
  FR: {
    'tour-lk-001': {
      title: 'Grand Héritage de Ceylan: Sigiriya, Kandy, Ella & Yala Expedition de Luxe',
      description: 'Plongez dans les merveilles intemporelles du Sri Lanka. Gravissez la citadelle antique de Sigiriya au lever du soleil, visitez le Temple de la Dent à Kandy, et partez en safari privé à Yala.',
      highlights: [
        'Ascension VIP de la forteresse de Sigiriya avec un archéologue',
        'Voiture panoramique première classe du train Kandy-Ella',
        'Safaris privés en Land Cruiser 4x4 dans le parc national de Yala',
      ],
      included: ['7 nuits dans des hôtels de patrimoine 5 étoiles', 'Repas gastronomiques et guides francophones/anglophones'],
      excluded: ['Vols internationaux', 'Frais de visa ETA'],
    },
    'tour-lk-002': {
      title: 'Ceylon Tea Trails & Randonnée aux Horton Plains',
      description: 'Découvrez la beauté brumeuse des hautes montagnes du thé de Ceylan dans des bungalows coloniaux restaurés.',
      highlights: ['Séjour Relais & Châteaux Ceylon Tea Trails', 'Randonnée guidée à World’s End'],
      included: ['5 nuits en suite avec majordome privé', 'Tous les repas'],
      excluded: ['Vols'],
    },
    'tour-lk-003': {
      title: 'Safari Sauvage du Sud & Expédition Baleines Bleues',
      description: 'Rencontrez les quatre grands animaux du Sri Lanka: léopards, éléphants, ours et baleines bleues.',
      highlights: ['Charter privé en catamaran à Mirissa pour l’observation des baleines', 'Safari léopard à Yala'],
      included: ['6 nuits en hébergement 5 étoiles', 'Expéditions marines'],
      excluded: ['Vols'],
    },
    'tour-lk-004': {
      title: 'Côte Est & Patrimoine Culturel de Trincomalee',
      description: 'Plages dorées préservées, récifs coralliens de Pigeon Island et temple historique de Koneswaram.',
      highlights: ['Plongée en apnée à Pigeon Island', 'Visite du temple Koneswaram'],
      included: ['5 nuits en resort de luxe en bord de mer'],
      excluded: ['Vols'],
    },
  },
  NL: {
    'tour-lk-001': {
      title: 'Groot Ceylons Erfgoed: Sigiriya, Kandy, Ella & Yala Luxe Expeditie',
      description: 'Ontdek de tijdloze pracht van Sri Lanka. Beklim de eeuwenoude rotsvesting Sigiriya bij zonsopgang en geniet van privéluipaardsafari’s in Yala.',
      highlights: ['VIP-zonsopgangbeklimming van Sigiriya met een archeoloog', 'Eerste klas panoramatrein naar Ella'],
      included: ['7 nachten in 5-sterren erfgoedhotels', 'Alle maaltijden en chauffeur'],
      excluded: ['Vliegtickets', 'Visa'],
    },
    'tour-lk-002': {
      title: 'Ceylon Tea Trails & Horton Plains Odyssee',
      description: 'Verblijf in gerestaureerde koloniale bungalows en wandel over het adembenemende Horton Plains plateau.',
      highlights: ['Luxe verblijf bij Ceylon Tea Trails Relais & Châteaux', 'Wandeling naar World’s End'],
      included: ['5 nachten in thee-landgoed suites met privébutler'],
      excluded: ['Vliegtickets'],
    },
    'tour-lk-003': {
      title: 'Zuidelijke Wildsafari & Blauwe Walvis Marine Expeditie',
      description: 'Ervaar de Sri Lankaanse Big Four: luipaarden, olifanten, lippenberen en blauwe vinvissen op een privé-jacht.',
      highlights: ['Privé catamarancharter voor walvisspotten in Mirissa', 'Luipaardsafari in Yala'],
      included: ['6 nachten in 5-sterren accommodaties'],
      excluded: ['Vliegtickets'],
    },
    'tour-lk-004': {
      title: 'Oostkust & Cultureel Erfgoed van Trincomalee',
      description: 'Onbedorven goudgele stranden, snorkelen bij Pigeon Island en het Koneswaram-tempelcomplex.',
      highlights: ['Snorkelen bij Pigeon Island', 'Koneswaram-tempel op Swami Rock'],
      included: ['5 nachten in een luxe strandresort'],
      excluded: ['Vliegtickets'],
    },
  },
  CN: {
    'tour-lk-001': {
      title: '14天 锡兰传奇顶级遗迹与野生动物环岛探索之旅',
      description: '沉浸于斯里兰卡的古老奇迹。清晨在考古学家陪同下攀登锡吉里耶巨岩宫殿，参拜康提佛牙寺，乘坐高山古董观光火车，体验雅拉私家花豹游猎。',
      highlights: [
        'VIP清晨尊享探秘联合国教科文组织锡吉里耶狮子岩',
        '康提至埃拉高山茶园火车头等舱观光席位',
        '雅拉国家公园专享敞篷4x4越野车双次猎游体验',
        '入住罗莱夏朵顶级茶园大宅与海岸私人奢华度假村',
      ],
      included: ['7晚五星级文化遗产酒店与奢华野奢营地', '全程精美餐食与英/中文专职司机导游'],
      excluded: ['国际机票', '签证费用'],
    },
    'tour-lk-002': {
      title: '锡兰高山茶园与霍顿平原世界尽头奇幻之旅',
      description: '入住英伦殖民风情茶园别墅，徒步霍顿平原崖顶悬崖，品鉴顶级手采高山白茶。',
      highlights: ['入住Ceylon Tea Trails罗莱夏朵大宅', '霍顿平原与世界尽头专业私人徒步'],
      included: ['5晚管家式五星茶园大宅住宿', '全包式私人用餐体验'],
      excluded: ['国际机票'],
    },
    'tour-lk-003': {
      title: '南部野生动物游猎与米瑞莎蓝鲸私人双体游艇探险',
      description: '探索斯里兰卡四大野生巨兽：花豹、亚洲象、懒熊与蓝鲸。入住海景私人别墅并包租双体游艇出海。',
      highlights: ['包租45英尺豪华双体船米瑞莎出海观鲸', '雅拉国家公园首席自然学家陪同追逐花豹'],
      included: ['6晚五星级海滨度假村与野奢营地', '游艇包船费用'],
      excluded: ['国际机票'],
    },
    'tour-lk-004': {
      title: '东海岸亭可马里纯净海滩与文化遗产之旅',
      description: '探索未被破坏的金黄沙滩，在鸽子岛海洋国家公园潜水探秘珊瑚礁。',
      highlights: ['鸽子岛浮潜探秘', '悬崖之上的Koneswaram印度教神庙'],
      included: ['5晚五星海滨度假村', '快艇接送费用'],
      excluded: ['国际机票'],
    },
  },
  RU: {
    'tour-lk-001': {
      title: 'Гранд-тур "Наследие Цейлона": Сигирия, Канди, Элла и Яла (14 дней)',
      description: 'Роскошная экспедиция по истокам Шри-Ланки. Восхождение на Сигирию на рассвете, посещение Храма Зуба Будды, путешествие на знаменитом высокогорном поезде и сафари на леопардов.',
      highlights: [
        'VIP-восхождение на скалу Сигирия с археологом',
        'Первый класс высокогорного поезда Канди — Элла',
        'Приватное сафари на джипах 4x4 в парке Яла',
      ],
      included: ['7 ночей в 5-звездочных отелях наследия', 'Все обеды, ужины и персональный гид-водитель'],
      excluded: ['Международные авиабилеты', 'Виза ETA'],
    },
    'tour-lk-002': {
      title: 'Чайные плантации Цейлона и плато Хортон',
      description: 'Отдых в усадьбах чайных магнатов, поход к обрыву "Конец Света" и дегустация редких сортов цейлонского чая.',
      highlights: ['Проживание в Ceylon Tea Trails Relais & Châteaux', 'Трекинг по национальному парку Хортон'],
      included: ['5 ночей в чайно-усадебных сюитах с батлером'],
      excluded: ['Перелет'],
    },
    'tour-lk-003': {
      title: 'Сафари на юге и морская экспедиция к синим китам',
      description: 'Встреча с Большой Четверкой Шри-Ланки: леопард, слон, медведь-губач и гигантский синий кит.',
      highlights: ['Аренда частной яхты-катамарана в Мириссе', 'Сафари на леопардов в парке Яла'],
      included: ['6 ночей в 5-звездочных отелях и сафари-лагерях'],
      excluded: ['Перелет'],
    },
    'tour-lk-004': {
      title: 'Восточное побережье и культурное наследие Тринкомали',
      description: 'Девственные золотые пляжи, снорклинг у коралловых рифов острова Пиджин и старинный храм Конесварам.',
      highlights: ['Снорклинг у острова Пиджин', 'Храм Конесварам на скале Свами'],
      included: ['5 ночей в пляжном курорте 5 звезд'],
      excluded: ['Перелет'],
    },
  },
  IN: {
    'tour-lk-001': {
      title: 'ग्रैंड सीलोन हेरिटेज: सिगिरिया, केंडी, एला और याला लक्जरी यात्रा (14 दिन)',
      description: 'श्रीलंका के कालजयी चमत्कारों में डूब जाएं। सूर्योदय के समय सिगिरिया के प्राचीन किले पर चढ़ें, केंडी में पवित्र दंत मंदिर के दर्शन करें और याला में तेंदुओं की निजी सफारी का आनंद लें।',
      highlights: [
        'पुरातत्वविद् के साथ सिगिरिया किले की वीआईपी सुबह की चढ़ाई',
        'केंडी से एला तक दर्शनीय ट्रेन में प्रथम श्रेणी सीट',
        'याला नेशनल पार्क में निजी 4x4 जीप सफारी',
      ],
      included: ['5-सितारा हेरिटेज होटलों में 7 रातें', 'सभी स्वादिष्ट भोजन और निजी ड्राइवर-गाइड'],
      excluded: ['अंतरराष्ट्रीय उड़ानें', 'वीजा शुल्क'],
    },
    'tour-lk-002': {
      title: 'सीलोन टी ट्रेल्स और हॉर्टन प्लेन्स एडवेंचर',
      description: 'श्रीलंका के चाय बागानों में समय बिताएं। औपनिवेशिक बंगलों में ठहरें और हॉर्टन प्लेन्स पर ट्रेकिंग का आनंद लें।',
      highlights: ['Ceylon Tea Trails में लक्जरी ठहराव', 'वर्ल्ड्स एंड के लिए गाइड ट्रेक'],
      included: ['निजी बटलर के साथ 5 रातें'],
      excluded: ['हवाई टिकट'],
    },
    'tour-lk-003': {
      title: 'दक्षिणी वन्यजीव सफारी और व्हेल देखने का समुद्री अभियान',
      description: 'श्रीलंका के बिग फोर: तेंदुए, हाथी, भालू और ब्लू व्हेल से मिलें। मिरिसा में निजी नौका क्रूज।',
      highlights: ['मिरिसा में निजी लग्जरी कटमरैन व्हेल सफारी', 'याला में तेंदुआ सफारी'],
      included: ['6 रातें 5-सितारा रिसॉर्ट्स में'],
      excluded: ['उड़ानें'],
    },
    'tour-lk-004': {
      title: 'पूर्वी तट और त्रिंकोमाली की सांस्कृतिक विरासत',
      description: 'श्रीलंका के पूर्वी तट के शांत समुद्र तटों और पिजन द्वीप पर स्नॉर्कलिंग का आनंद लें।',
      highlights: ['पिजन द्वीप पर स्नॉर्कलिंग', 'कोनेश्वरम मंदिर दर्शन'],
      included: ['5-सितारा समुद्र तटीय रिसॉर्ट में 5 रातें'],
      excluded: ['उड़ानें'],
    },
  },
  AE: {
    'tour-lk-001': {
      title: 'رحلة تراث سيلان الفاخرة: سيجيريا، كاندي، إيلا ويالا (14 يوماً)',
      description: 'استمتع بسحر سريلانكا الخالد. اصعد قلعة سيجيريا الصخرية عند الشروق رفقة عالم آثار، وقم بزيارة معبد السن المقدس في كاندي، وانطلق في رحلات سفاري خاصة لرؤية النمور في يالا.',
      highlights: [
        'صعود حصري لقلعة سيجيريا مع عالم آثار متخصص',
        'مقاعد الدرجة الأولى في القطار البانورامي من كاندي إلى إيلا',
        'رحلات سفاري خاصة بسيارات لاند كروزر المكشوفة في محمية يالا',
      ],
      included: ['إقامة 7 ليالٍ في فنادق تراثية ومخيمات سفاري 5 نجوم', 'جميع الوجبات الفاخرة وسائق خاص يتحدث الإنجليزية'],
      excluded: ['الطيران الدولي', 'رسوم التأشيرة الإلكترونية'],
    },
    'tour-lk-002': {
      title: 'مزارع الشاي في سيلان ومحمية هورتون بلينز',
      description: 'استمتع بجمال المرتفعات الخضراء في سريلانكا والإقامة في قصور مزارع الشاي الاستعمارية وتجربة الشاي السيلاني الفاخر.',
      highlights: ['إقامة فاخرة في قصور Ceylon Tea Trails', 'جولة سير على الأقدام إلى نهاية العالم'],
      included: ['5 ليالٍ في أجنحة فاخرة مع خادم شخصي خاص'],
      excluded: ['تذاكر الطيران'],
    },
    'tour-lk-003': {
      title: 'سفاري البراري الجنوبية ورحلة مشاهدة الحيتان الزرقاء',
      description: 'اكتشف الحيوانات الأربعة الكبرى في سريلانكا: النمر، الفيل، الدب، والحوت الأزرق العملاق مع يخوت خاصة في ميريسا.',
      highlights: ['يخت خاص فاخر لمشاهدة الحيتان الزرقاء في ميريسا', 'رحلة سفاري شاملة للنمور في يالا'],
      included: ['6 ليالٍ في منتجعات شاطئية ومخيمات سفاري 5 نجوم'],
      excluded: ['الطيران الدولي'],
    },
    'tour-lk-004': {
      title: 'الساحل الشرقي المذهل والتراث الثقافي في ترينكومالي',
      description: 'اكتشف الشواطئ الرملية الذهبية البكر في الساحل الشرقي، والغوص في جزيرة بيجون واستكشاف معبد كونيشفارام.',
      highlights: ['الغوص والسباحة في محمية جزيرة بيجون البحرية', 'زيارة معبد كونيشفارام التاريخي'],
      included: ['إقامة 5 ليالٍ في منتجع فاخر على الشاطئ'],
      excluded: ['الطيران الدولي'],
    },
  },
  SI: {
    'tour-lk-001': {
      title: 'සීගිරිය, මහනුවර, ඇල්ල සහ යාල අසිරිමත් සුඛෝපභෝගී සංචාරය',
      description: 'ශ්‍රී ලංකාවේ අසිරිය විඳගන්න. සීගිරිය පර්වතය, මහනුවර දළදා මාළිගාව, ඇල්ල කඳුකර දුම්රිය ගමන සහ යාල වනජීවී සෆාරිය ඇතුළත් විස්මිත සංචාරය.',
      highlights: ['සීගිරිය නැරඹීම', 'ඇල්ල කඳුකර අලංකාර දුම්රිය ගමන', 'යාල ජාතික වනෝද්‍යානයේ සෆාරි ගමන', 'ගාලු කොටුව නැරඹීම'],
      included: ['තරු 5 හෝටල් නවාතැන්', 'සියලුම ආහාර සහ පෞද්ගලික ප්‍රවාහනය', 'ඇතුළුවීමේ ටිකට්පත්'],
      excluded: ['ජාත්‍යන්තර ගුවන් ටිකට්පත්'],
    },
    'tour-lk-002': {
      title: 'නුවරඑළිය සහ හැටන් තේ වතු ආශ්‍රිත සුඛෝපභෝගී සංචාරය',
      description: 'ශ්‍රී ලංකාවේ මධ්‍යම කඳුකරයේ අසිරිය, තේ වතු, ජල ඇලි සහ හෝටන් තැන්න ජාතික වනෝද්‍යානය ආවරණය වන සුඛෝපභෝගී සංචාරය.',
      highlights: ['තේ වතු සහ තේ කර්මාන්තශාලා නැරඹීම', 'හෝටන් තැන්න සහ ලෝකාන්තය', 'හැටන් සහ කැස්ලරී විල ආශ්‍රිත නවාතැන්'],
      included: ['පෞද්ගලික රියදුරු සහිත වාහනය', 'තරු 5 නවාතැන්'],
      excluded: ['පෞද්ගලික වියදම්'],
    },
  },
};

// ============================================================================
// DYNAMIC HOTEL CONTENT TRANSLATIONS
// ============================================================================

export const HOTEL_TRANSLATIONS: Record<LanguageCode, Record<string, LocalizedHotelContent>> = {
  EN: {
    'hotel-lk-001': {
      name: 'Amangalla - Galle Fort & Coastal Sanctuary',
      description: 'Set within the historic ramparts of the 17th-century UNESCO Galle Fort, Amangalla evokes the gentle grace of a bygone era with four-poster beds, polished teak floors, a 21-meter garden swimming pool, and rejuvenating hydrotherapy Ayurvedic baths.',
      amenities: ['The Baths Hydrotherapy Spa', 'Private Butler Service', 'Ayurvedic Wellness Sanctuary', 'Verandah Dining Pavilion', 'Colonial Swimming Pool', 'Historic Library & Tea Salon'],
    },
    'hotel-lk-002': {
      name: 'Wild Coast Tented Lodge - Yala Sanctuary',
      description: 'Adjacent to the leopard-dense Yala National Park, where the rugged jungle meets the crashing waves of the Indian Ocean. Stay in futuristic cocoon suites featuring freestanding copper tubs, four-poster beds, and private plunge pools.',
      amenities: ['Private Plunge Pool Cocoon Suites', 'Custom 4x4 Leopard Safari Rangers', 'Bamboo Pavilion Dining', 'Sanctuary Spa by the Ocean', 'Champagne Beach Bonfires', 'Inclusive Luxury All-Board Dining'],
    },
    'hotel-lk-003': {
      name: 'Ceylon Tea Trails - Relais & Châteaux',
      description: 'The world first tea bungalow resort, perched at an altitude of 1,250 meters in Sri Lanka panoramic tea country. Comprising five authentic restored colonial planter residences with dedicated butler service, infinity pools, and lakeside tennis courts.',
      amenities: ['Private Master Butler & Gourmet Chef', 'Infinity Pool Overlooking Castlereagh Lake', 'Private Sea Plane Landing Jetty', 'Artisanal Ceylon Tea Spa Rituals', 'Clay Tennis Court with Mountain Views', 'All-Inclusive Fine Dining & Cellar Wines'],
    },
    'hotel-lk-004': {
      name: 'Water Garden Sigiriya - Royal Lake Villas',
      description: 'Inspired by the 2,000-year-old water garden engineering of King Kashyapa fortress. Spacious stilted villas surrounded by winding waterways, lotus ponds, and sweeping direct views of the iconic Sigiriya Lion Rock.',
      amenities: ['Direct Sigiriya Rock Views', 'Private Water Villa Plunge Pools', 'Helipad for VIP Direct Landing', 'Ayurvedic Herbal Treatment Spa', 'Fine Dining Alfresco Pavilion'],
    },
    'hotel-lk-005': {
      name: 'Cape Weligama - Luxury Ocean Cliff Sanctuary',
      description: 'Perched high atop a dramatic headland rising 40 meters above the Indian Ocean near Mirissa. Features the iconic 60-meter crescent-shaped cliff-edge infinity pool and private villa compounds.',
      amenities: ['60-meter Moon Pool Cliff-Edge Infinity Pool', 'Private Butler & Valet Service', 'Oceanfront Teppanyaki & Sri Lankan Pavilion', 'Whale Watching Catamaran Docking Access', 'Sanctuary Spa with Ceylon Spices'],
    },
    'hotel-lk-006': {
      name: 'Galle Face Hotel - 1864 Heritage Suite',
      description: 'One of the most storied heritage hotels in Asia, established in 1864 facing the Indian Ocean in the heart of Colombo. Enjoy sunset cocktails at the Chequerboard and classic colonial luxury.',
      amenities: ['Heritage Saltwater Ocean Pool', 'The 1864 Fine Dining Restaurant', 'Historic Chequerboard Sunset Lawn', 'VIP Oceanfront Butler Suites', 'Spa Ceylon Ayurvedic Wellness'],
    },
  },
  JP: {
    'hotel-lk-001': {
      name: 'アマンガラ - ゴールフォート＆コーラルサンクチュアリ',
      description: '17世紀のユネスコ世界遺産ゴール要塞の中に位置するアマンガラ。1800年代のコロニアルな優雅さとアユルヴェーダ・スパ、庭園プールが特別な寛ぎをお届けします。',
      amenities: ['ザ・バス アユルヴェーダ水療法スパ', '専属バトラーサービス', 'ウェルネスサンクチュアリ', 'ヴェランダダイニングパビリオン', 'コロニアルスイミングプール', '歴史的ライブラリー＆ティーサロン'],
    },
    'hotel-lk-002': {
      name: 'ワイルドコースト テンテッドロッジ - ヤラ',
      description: 'ヤラ国立公園に隣接し、ジャングルとインド洋が交差する自然の聖域。未来的なコクーン型スイートとプライベートプールを備えた極上エコリゾートです。',
      amenities: ['プライベートプール付きコクーンスイート', '専用4x4サファリジープ', '竹造りパビリオンダイニング', 'オーシャンビュー天然スパ', 'ビーチフロント焚き火カクテル', 'オールインクルーシブ最高級ディナー'],
    },
    'hotel-lk-003': {
      name: 'セイロン ティー トレイルズ - ルレ・エ・シャトー',
      description: '標高1,250メートルの茶園に囲まれた世界初の紅茶バンガローリゾート。英国コロニアル様式の5つの邸宅で専属バトラーによる贅沢な滞在を提供します。',
      amenities: ['専属マスターバトラー＆シェフ', 'キャッスルレイ湖を見下ろすインフィニティプール', '水上飛行機専用プライベート桟橋', '最高級セイロンティースパ', '山並みを望むクレイテニスコート', 'オールインクルーシブ最高峰ワイン＆ディナー'],
    },
    'hotel-lk-004': {
      name: 'ウォーターガーデン シギリヤ - ロイヤルレイクヴィラ',
      description: 'シギリヤロック要塞を正面に望む水上ヴィラリゾート。古代の王宮庭園技術から着想を得た水路とハス池に囲まれた幻想的なロケーション。',
      amenities: ['シギリヤロックダイレクトビュー', '水上ヴィラプライベートプール', 'VIP直接着陸用ヘリポート', 'アーユルヴェーダ薬草スパ', 'オープンエアパビリオンダイニング'],
    },
    'hotel-lk-005': {
      name: 'ケープ ウェリガマ - ラグジュアリーオーシャンヴィラ',
      description: 'インド洋を見下ろす高さ40メートルの断崖上に広がる絶景リゾート。長さ60メートルの三日月型インフィニティプールと極上のプライベートヴィラ。',
      amenities: ['60m三日月型断崖インフィニティプール', '専属バトラー＆バレーサービス', 'オーシャンフロント鉄板焼き＆レストラン', 'ホエールウォッチングカタマラン出航アクセス', 'セイロンスパイス配合天然スパ'],
    },
    'hotel-lk-006': {
      name: 'ゴールフェイスホテル - 1864 ヘリテージスイート',
      description: '1864年創業、アジアで最も歴史ある伝説のクラシックホテル。コロンボ中心部の海岸線に面し、美しい夕日とコロニアルな気品を漂わせます。',
      amenities: ['歴史的海水オーシャンプール', '1864ファインダイニングレストラン', 'チェッカーボードサンセット芝生広場', 'VIPオーシャンフロントバトラースイート', 'スパ・セイロンアーユルヴェーダ'],
    },
  },
  DE: {
    'hotel-lk-001': {
      name: 'Amangalla - Galle Fort & Coastal Sanctuary',
      description: 'Innerhalb der historischen Festung von Galle (UNESCO-Weltkulturerbe). Kolonialer Luxus mit Himmelsbetten, 21m Gartenpool und Hydrotherapie-Spa.',
      amenities: ['Hydrotherapie-Spa The Baths', 'Privater Butler-Service', 'Ayurveda-Wellnesszentren', 'Verandah-Restaurant', 'Kolonialer Pool', 'Bibliothek & Tee-Salon'],
    },
    'hotel-lk-002': {
      name: 'Wild Coast Tented Lodge - Yala Sanctuary',
      description: 'Spektakuläres Zelt-Resort am Rande des Yala-Nationalparks, wo der Dschungel auf den Ozean trifft.',
      amenities: ['Private Pool-Suiten', 'Jeep-Safaris mit Campern', 'Bambus-Pavillon Restaurant', 'Spa am Ozean'],
    },
    'hotel-lk-003': {
      name: 'Ceylon Tea Trails - Relais & Châteaux',
      description: 'Fünf restaurierte kolonialzeitliche Teeplantagen-Residenzen mit Butler-Service und Infinity-Pools auf 1.250 m Höhe.',
      amenities: ['Privater Butler & Chefkoch', 'Infinity-Pool am Castlereagh-See', 'Wasserflugzeug-Steg', 'Gourmet All-Inclusive'],
    },
    'hotel-lk-004': {
      name: 'Water Garden Sigiriya - Royal Lake Villas',
      description: 'Elegante Stelzenvillen mit Blick auf die Felsenfestung Sigiriya, umgeben von Wasserstraßen und Lotus-Teichen.',
      amenities: ['Blick auf den Sigiriya-Felsen', 'Private Plunge-Pools', 'Hubschrauberlandeplatz'],
    },
    'hotel-lk-005': {
      name: 'Cape Weligama - Luxury Ocean Cliff Sanctuary',
      description: 'Auf einer 40 Meter hohen Klippe über dem Indischen Ozean. Mit dem berühmten 60-Meter-Halbmond-Infinity-Pool.',
      amenities: ['60m Halbmond-Infinity-Pool', 'Butler-Service', 'Teppanyaki-Pavillon am Meer'],
    },
    'hotel-lk-006': {
      name: 'Galle Face Hotel - 1864 Heritage Suite',
      description: 'Traditionsreiches Luxushotel aus dem Jahr 1864 direkt am Meer im Herzen von Colombo.',
      amenities: ['Meerwasser-Pool', 'Restaurant 1864', 'Historischer Chequerboard-Rasen'],
    },
  },
  FR: {
    'hotel-lk-001': {
      name: 'Amangalla - Fort de Galle',
      description: 'Situé au cœur du fort historique de Galle classé par l’UNESCO. Élégance coloniale, spa ayurvédique et piscine de jardin.',
      amenities: ['Spa The Baths', 'Service de majordome privé', 'Piscine coloniale', 'Salon de thé historique'],
    },
    'hotel-lk-002': {
      name: 'Wild Coast Tented Lodge - Yala',
      description: 'Lodge de luxe futuriste en bordure du parc national de Yala, entre jungle et océan.',
      amenities: ['Suites cocon avec piscine privée', 'Rangers privés 4x4', 'Restaurant sous pavillon de bambou'],
    },
    'hotel-lk-003': {
      name: 'Ceylon Tea Trails - Relais & Châteaux',
      description: 'Cinq résidences de planteurs coloniaux restaurées au cœur des montagnes du thé à 1250m d’altitude.',
      amenities: ['Majordome personnel', 'Piscine à débordement sur le lac', 'Gastronomie tout compris'],
    },
    'hotel-lk-004': {
      name: 'Water Garden Sigiriya',
      description: 'Villas sur pilotis offrant une vue imprenable sur le rocher de Sigiriya.',
      amenities: ['Vue directe sur Sigiriya', 'Piscine privée', 'Héliport VIP'],
    },
    'hotel-lk-005': {
      name: 'Cape Weligama',
      description: 'Sur une falaise spectaculaire s’élevant à 40 mètres au-dessus de l’océan Indien.',
      amenities: ['Piscine à débordement de 60 mètres', 'Majordome privé', 'Spa aux épices de Ceylan'],
    },
    'hotel-lk-006': {
      name: 'Galle Face Hotel - 1864',
      description: 'Hôtel historique légendaire fondé en 1864 en face de l’océan à Colombo.',
      amenities: ['Piscine d’eau de mer', 'Restaurant gastronomique 1864', 'Jardin Chequerboard'],
    },
  },
  NL: {
    'hotel-lk-001': {
      name: 'Amangalla - Galle Fort',
      description: 'Gelegen binnen de historische vestingmuren van het UNESCO-werelderfgoed Galle Fort.',
      amenities: ['Hydrotherapie-spa', 'Privébutlerservice', 'Zwembad in de tuin'],
    },
    'hotel-lk-002': {
      name: 'Wild Coast Tented Lodge - Yala',
      description: 'Luxe tenten-resort naast het Yala National Park met privé zwembaden.',
      amenities: ['Privé zwembad suites', 'Jeep-safari’s', 'Bamboe paviljoen restaurant'],
    },
    'hotel-lk-003': {
      name: 'Ceylon Tea Trails - Relais & Châteaux',
      description: 'Vijf koloniale thee-bungalows met butlerservice en panoramisch uitzicht.',
      amenities: ['Privébutler & chef', 'Infinity pool aan het meer', 'All-inclusive fijn proeven'],
    },
    'hotel-lk-004': {
      name: 'Water Garden Sigiriya',
      description: 'Ruime villa’s op palen met direct uitzicht op de beroemde Sigiriya Leeuwenrots.',
      amenities: ['Uitzicht op Sigiriya', 'Privé zwembaden', 'Helikopterplatform'],
    },
    'hotel-lk-005': {
      name: 'Cape Weligama',
      description: 'Gelegen op una klif van 40 meter boven de Indische Oceaan.',
      amenities: ['60-meter infinity pool', 'Privébutler', 'Spa bij de oceaan'],
    },
    'hotel-lk-006': {
      name: 'Galle Face Hotel',
      description: 'Historisch hotel uit 1864 aan de oceaan in Colombo.',
      amenities: ['Zoutwaterzwembad', 'Restaurant 1864', 'Zonsondergang terras'],
    },
  },
  CN: {
    'hotel-lk-001': {
      name: '安缦伽拉 - 加勒古堡奢华圣所 (Amangalla)',
      description: '坐落于17世纪联合国教科文组织加勒古堡古城墙内，重现昔日殖民时期的典雅风华，配有古董四柱床、打磨柚木地板与阿育吠陀疗愈水疗。',
      amenities: ['阿育吠陀水疗水疗中心', '私人管家贴心服务', '花园游泳池', '历史图书馆与下午茶沙龙'],
    },
    'hotel-lk-002': {
      name: '野性海岸露营洛奇 - 雅拉野奢圣所 (Wild Coast Tented Lodge)',
      description: '毗邻花豹密集的雅拉国家公园，原始丛林与印度洋巨浪在此交汇。未来感茧型奢华帐篷配备独立铜质浴缸与私人泳池。',
      amenities: ['私人泳池茧型套房', '专属4x4花豹游猎团队', '竹制露天餐厅', '海边水疗中心'],
    },
    'hotel-lk-003': {
      name: '锡兰茶园小径 - 罗莱夏朵大宅 (Ceylon Tea Trails)',
      description: '全球首家茶园大宅度假村，坐落于海拔1250米的高山茶园，由五栋精细修复的英式殖民大宅组成，配有专属管家。',
      amenities: ['私人首席管家与主厨', '俯瞰卡斯尔雷湖无边泳池', '水上飞机私人码头', '全包式顶级餐饮与酒窖'],
    },
    'hotel-lk-004': {
      name: '水花园锡吉里耶度假村 (Water Garden Sigiriya)',
      description: '灵感源自迦叶波国王2000年前的水花园工程，水上别墅环绕着蜿蜒水渠与荷花池，直接仰望狮子岩绝景。',
      amenities: ['狮子岩直视全景', '水上别墅私人泳池', 'VIP直升机停机坪', '草本阿育吠陀水疗'],
    },
    'hotel-lk-005': {
      name: '韦利格玛角奢华悬崖悬崖度假村 (Cape Weligama)',
      description: '耸立于米瑞莎附近高出印度洋40米的壮丽悬崖之上，拥有标志性的60米半月形悬崖无边泳池。',
      amenities: ['60米半月形悬崖无边泳池', '私人管家与贴身服务', '海景日式铁板烧与斯里兰卡餐厅'],
    },
    'hotel-lk-006': {
      name: '加勒菲斯酒店 - 1864传承套房 (Galle Face Hotel)',
      description: '亚洲最具传奇色彩的百年遗产酒店之一，始建于1864年，面向印度洋，是科伦坡最顶级的日落观赏地。',
      amenities: ['海水海水游泳池', '1864高级西餐厅', '棋盘格日落草坪', 'VIP海景管家套房'],
    },
  },
  RU: {
    'hotel-lk-001': {
      name: 'Amangalla - Форт Галле',
      description: 'Отель в стенах старинного голландского форта Галле (ЮНЕСКО). Колониальная элегантность, спа-процедуры и бассейн в саду.',
      amenities: ['Гидротерапевтический спа-центр', 'Услуги личного батлера', 'Колониальный бассейн'],
    },
    'hotel-lk-002': {
      name: 'Wild Coast Tented Lodge - Яла',
      description: 'Футуристический отель-глэмпинг на границе национального парка Яла и Индийского океана.',
      amenities: ['Кокон-сюиты с собственным бассейном', 'Приватные сафари-джипы 4x4', 'Спа у океана'],
    },
    'hotel-lk-003': {
      name: 'Ceylon Tea Trails - Relais & Châteaux',
      description: 'Первый в мире курорт в чайных усадьбах на высоте 1250 м. Пять колониальных резиденций с батлерами.',
      amenities: ['Персональный батлер и шеф-повар', 'Бассейн инфинити с видом на озеро', 'Всё включено'],
    },
    'hotel-lk-004': {
      name: 'Water Garden Sigiriya',
      description: 'Виллы на воде с прямым видом на знаменитую скалу Сигирия.',
      amenities: ['Вид на скалу Сигирия', 'Персональный бассейн', 'Вертолетная площадка'],
    },
    'hotel-lk-005': {
      name: 'Cape Weligama',
      description: 'Курорт на скале на высоте 40 метров над Индийским океаном с 60-метровым бассейном-полумесяцем.',
      amenities: ['60-метровый бассейн инфинити', 'Услуги батлера', 'Панорамный ресторан'],
    },
    'hotel-lk-006': {
      name: 'Galle Face Hotel',
      description: 'Легендарный отель 1864 года на набережной Коломбо.',
      amenities: ['Океанический бассейн', 'Ресторан 1864', 'Исторический газон Chequerboard'],
    },
  },
  IN: {
    'hotel-lk-001': {
      name: 'अमानगल्ला - गाले किला (Amangalla)',
      description: '17वीं शताब्दी के यूनेस्को गाले किले के भीतर स्थित ऐतिहासिक लक्जरी होटल।',
      amenities: ['आयुर्वेदिक स्पा', 'निजी बटलर सेवा', 'गार्डन स्विमिंग पूल'],
    },
    'hotel-lk-002': {
      name: 'वाइल्ड कोस्ट टेंटेड लॉज - याला',
      description: 'याला नेशनल पार्क के पास भविष्यवादी टेंटेड सूट और निजी पूल।',
      amenities: ['निजी पूल सूट', 'निजी 4x4 सफारी', 'बांस मंडप भोजन'],
    },
    'hotel-lk-003': {
      name: 'सीलोन टी ट्रेल्स - रिले एंड शैटॉ',
      description: 'चाय के बागानों में 5 ऐतिहासिक औपनिवेशिक बंगले और बटलर सेवा।',
      amenities: ['निजी बटलर और शेफ', 'झील के दृश्य के साथ इन्फिनिटी पूल'],
    },
    'hotel-lk-004': {
      name: 'वाटर गार्डन सिगिरिया',
      description: 'सिगिरिया लायन रॉक के दृश्यों के साथ जल विला।',
      amenities: ['सिगिरिया रॉक दृश्य', 'निजी पूल', 'हेलिपैड'],
    },
    'hotel-lk-005': {
      name: 'केप वेलिगामा',
      description: 'हिंद महासागर के ऊपर 40 मीटर ऊंची चट्टान पर स्थित शानदार रिसॉर्ट।',
      amenities: ['60-मीटर इन्फिनिटी पूल', 'निजी बटलर'],
    },
    'hotel-lk-006': {
      name: 'गाले फेस होटल - कोलंबो',
      description: 'कोलंबो में 1864 से समुद्र के सामने स्थित ऐतिहासिक विरासत होटल।',
      amenities: ['समुद्री जल पूल', '1864 फ़ाइन डाइनिंग'],
    },
  },
  AE: {
    'hotel-lk-001': {
      name: 'أمانجالا - قلعة جالي (Amangalla)',
      description: 'يقع داخل أسوار قلعة جالي التاريخية المدرجة ضمن التراث العالمي لليونسكو. فخامة استعمارية مع أسرة ذات أربعة أعمدة واسبا علاجية.',
      amenities: ['منتجع اسبا مائي آيورفيدي', 'خدمة الخادم الشخصي الخاص', 'حمام سباحة في الحديقة'],
    },
    'hotel-lk-002': {
      name: 'وايلد كوست تينتد لودج - يالا (Wild Coast Tented Lodge)',
      description: 'منتجع فاخر مجاور لمحمية يالا حيث تلتقي الغابة بأمواج المحيط الهندي مع أجنحة شرنقة خاصة ورائعة.',
      amenities: ['أجنحة شرنقة مع حمام سباحة خاص', 'سيارات سفاري خاصة 4x4', 'مطعم في جناح الخيزران'],
    },
    'hotel-lk-003': {
      name: 'سيلان تي تريلز - ريلاي & شاتو (Ceylon Tea Trails)',
      description: 'أول منتجع لمزارع الشاي في العالم على ارتفاع 1250 متراً مع 5 قصور استعمارية وخادم شخصي.',
      amenities: ['خادم شخصي وطاهٍ خاص', 'حمام سباحة إنفينيتي مطل على البحيرة', 'إقامة شاملة بالكامل'],
    },
    'hotel-lk-004': {
      name: 'واتر جاردن سيجيريا (Water Garden Sigiriya)',
      description: 'فيلات على الركائز تحيط بها الممرات المائية وتطل مباشرة على صخرة سيجيريا الشهيرة.',
      amenities: ['إطلالة مباشرة على صخرة سيجيريا', 'حمام سباحة خاص بالفيلة', 'مهبط مروحيات VIP'],
    },
    'hotel-lk-005': {
      name: 'كيب فيليجاما - منتجع المنحدرات الفاخر (Cape Weligama)',
      description: 'يقع على جرف صخري ساحر يرتفع 40 متراً فوق المحيط الهندي مع حمام سباحة هلالي بطول 60 متراً.',
      amenities: ['حمام سباحة إنفينيتي هلالي بطول 60 متراً', 'خدمة الخادم الشخصي', 'مطعم ياباني وسريلانكي بحري'],
    },
    'hotel-lk-006': {
      name: 'فندق جالي فيس - أجنحة 1864 التراثية (Galle Face Hotel)',
      description: 'أحد أعرق الفنادق التراثية في آسيا وتأسس عام 1864 المطل على المحيط الهندي في قلب كولومبو.',
      amenities: ['حمام سباحة بمياه المحيط', 'مطعم 1864 الفاخر', 'حديقة غروب الشمس التاريخية'],
    },
  },
  SI: {
    'hotel-lk-001': {
      name: 'අමන්ගල්ල - ගාලු කොටුව',
      description: 'ඓතිහාසික ගාලු කොටුව තුළ පිහිටි සුඛෝපභෝගී පෞරාණික හෝටලය.',
      amenities: ['ආයුර්වේද ස්පා', 'පෞද්ගලික සේවක සහාය', 'පිහිනුම් තටාකය'],
    },
    'hotel-lk-002': {
      name: 'වයිල්ඩ් කෝස්ට් ටෙන්ටඩ් ලොජ් - යාල',
      description: 'යාල ජාතික වනෝද්‍යානය ආසන්නයේ පිහිටි සුඛෝපභෝගී නිකේතනය.',
      amenities: ['පෞද්ගලික පිහිනුම් තටාකය', 'සෆාරි රථ සේවාව', 'ආහාර පාන සේවාව'],
    },
  },
};

// Localized helper fallbacks
export const BLOG_TRANSLATIONS: Record<LanguageCode, Record<string, LocalizedBlogContent>> = {
  EN: {
    'post-001': {
      title: 'The Ultimate Luxury Guide to Sigiriya: Climbing the 5th-Century Sky Palace',
      excerpt: 'How to experience King Kashyapa ancient citadel without the crowds, from dawn archaeologist tours to sunset helicopter fly-bys and luxury water garden villas.',
      content: 'Rising 200 meters above the emerald central plains of Sri Lanka, Sigiriya (the Lion Rock) is widely hailed by scholars as the 8th Wonder of the World...',
    },
  },
  SI: {
    'post-001': {
      title: 'සීගිරිය පිළිබඳ සුඛෝපභෝගී සංචාරක මාර්ගෝපදේශය',
      excerpt: 'කාශ්‍යප රජුගේ අහස් මාලිගය නැරඹීමේ අසිරිමත් අත්දැකීම.',
      content: 'ශ්‍රී ලංකාවේ ප්‍රෞඩ සංස්කෘතික උරුමයක් වන සීගිරිය නැරඹීමේ විස්මිත අත්දැකීම...',
    },
  },
  JP: {
    'post-001': {
      title: 'シギリヤロック要塞 究極のラグジュアリーガイド：天空の王宮を巡る旅',
      excerpt: '混雑を避けて早朝に考古学者と巡るシギリヤ登頂や水上庭園ヴィラでの優雅な滞在スタイルをご紹介。',
      content: 'スリランカ中央部の緑豊かな平原から200メートル立ちそびえるシギリヤロック。5世紀にカッサパ王によって建てられた天空の宮殿を専門家と紐解きます...',
    },
  },
  DE: {
    'post-001': {
      title: 'Der ultimative Luxus-Guide für Sigiriya: Aufstieg zum Himmelspalast',
      excerpt: 'Wie Sie die antike Zitadelle ohne Menschenmassen erleben – mit Archäologen-Führungen bei Sonnenaufgang.',
      content: 'Die Felsenfestung Sigiriya ragt 200 Meter aus den smaragdgrünen Ebenen Sri Lankas heraus...',
    },
  },
  FR: {
    'post-001': {
      title: 'Le Guide de Luxe Ultime de Sigiriya: L’Ascension du Palais Céleste',
      excerpt: 'Comment visiter la citadelle du roi Kashyapa à l’aube avec un archéologue spécialisé.',
      content: 'S’élevant à 200 mètres au-dessus des plaines d’émeraude du Sri Lanka, Sigiriya est considérée comme la 8ème merveille du monde...',
    },
  },
  NL: {
    'post-001': {
      title: 'De Ultieme Luxe Gids voor Sigiriya: Beklim het Hemelpaleis',
      excerpt: 'Ervaar de eeuwenoude rotsvesting bij zonsopgang zonder de drukte met een archeoloog-gids.',
      content: 'Sigiriya verrijst 200 meter boven de groene vlaktes van Sri Lanka...',
    },
  },
  CN: {
    'post-001': {
      title: '锡吉里耶狮子岩终极奢华指南：探秘公元5世纪天空宫殿',
      excerpt: '如何避开人群，在考古学家陪同下于清晨登顶巨岩宫殿并享受专享直升机俯瞰。',
      content: '耸立于斯里兰卡翡翠般平原之上200米高空，锡吉里耶（狮子岩）被誉为世界第八大奇迹...',
    },
  },
  RU: {
    'post-001': {
      title: 'Путеводитель по Сигирии: Восхождение в Небесный дворец',
      excerpt: 'Как посетить древнюю цитадель царя Кашьяпы без толп туристов — утренние туры с археологом.',
      content: 'Возвышаясь на 200 метров над изумрудными равнинами Шри-Ланки, скала Сигирия поражает своим величием...',
    },
  },
  IN: {
    'post-001': {
      title: 'सिगिरिया के लिए अल्टीमेट लक्जरी गाइड: 5वीं सदी के आकाश महल की चढ़ाई',
      excerpt: 'पुरातत्वविद् के साथ सुबह की सैर के साथ सिगिरिया का आनंद लें।',
      content: 'श्रीलंका के हरे-भरे मैदानों से 200 मीटर ऊपर उठने वाला सिगिरिया लायन रॉक विश्व के अजूबों में से एक है...',
    },
  },
  AE: {
    'post-001': {
      title: 'الدليل الفاخر لزيارة سيجيريا: صعود قصر السحاب من القرن الخامس',
      excerpt: 'كيف تستمتع بزيارة قلعة الملك كاشيابا في الصباح الباكر مع عالم آثار دون ازدحام.',
      content: 'ترتفع صخرة سيجيريا 200 متر فوق السهول الخضراء في سريلانكا، وتعد من عجائب العالم...',
    },
  },
};

export const REVIEW_TRANSLATIONS: Record<LanguageCode, Record<string, LocalizedReviewContent>> = {
  EN: {},
  SI: {},
  JP: {},
  DE: {},
  FR: {},
  NL: {},
  CN: {},
  RU: {},
  IN: {},
  AE: {},
};
