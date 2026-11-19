// 資格ごとの無料学習サイト(学習ホームに表示)。資格IDは data.js の並び順。
const resources = {
"c0-2": [
{
"title": "基本情報技術者試験ドットコム（過去問道場）",
"url": "https://www.fe-siken.com/"
},
{
"title": "過去問.com（基本情報技術者）",
"url": "https://kakomonn.com/kihonjoho/"
},
{
"title": "基本情報技術者試験 過去問研究所（1st Studyz）",
"url": "https://1studyz.com/fe/"
},
{
"title": "資格王（基本情報技術者試験）",
"url": "https://feexam.shikaku-king.jp/"
},
{
"title": "基本情報技術者試験 完全対策",
"url": "https://standard-information.vercel.app/"
},
{
"title": "基本情報技術者 一問一答",
"url": "https://fe-ichimon.pages.dev/"
}
],
"c0-3": [
{
"title": "応用情報技術者試験ドットコム（過去問道場）",
"url": "https://www.ap-siken.com/"
},
{
"title": "過去問.com（応用情報技術者）",
"url": "https://kakomonn.com/oyojoho/"
},
{
"title": "応用情報技術者試験ナビ",
"url": "https://ap-shiken-navi.jp/"
},
{
"title": "シカクテック（応用情報技術者）",
"url": "https://shikakutech.com/itee/ap"
},
{
"title": "過去問AI（応用情報技術者）",
"url": "https://www.kakomon-ai.jp/ap"
}
],
"c0-1": [
{
"title": "情報セキュリティマネジメント試験ドットコム（過去問道場）",
"url": "https://www.sg-siken.com/"
}
],
"c0-12": [
{
"title": "情報処理安全確保支援士ドットコム（過去問道場）",
"url": "https://www.sc-siken.com/"
}
],
"c0-7": [
{
"title": "ネットワークスペシャリストドットコム（過去問道場）",
"url": "https://www.nw-siken.com/"
}
],
"c0-8": [
{
"title": "データベーススペシャリストドットコム（過去問道場）",
"url": "https://www.db-siken.com/"
}
],
"c0-6": [
{
"title": "プロジェクトマネージャドットコム（過去問道場）",
"url": "https://www.pm-siken.com/"
}
],
"c0-4": [
{
"title": "ITストラテジストドットコム（過去問道場）",
"url": "https://www.st-siken.com/"
}
],
"c0-5": [
{
"title": "システムアーキテクトドットコム（過去問道場）",
"url": "https://www.sa-siken.com/"
}
],
"c0-10": [
{
"title": "ITサービスマネージャドットコム（過去問道場）",
"url": "https://www.sm-siken.com/"
}
],
"c0-9": [
{
"title": "エンベデッドシステムスペシャリストドットコム（過去問道場）",
"url": "https://www.es-siken.com/"
}
],
"c0-11": [
{
"title": "システム監査技術者ドットコム（過去問道場）",
"url": "https://www.au-siken.com/"
}
],
"c1-0": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c1-1": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c1-2": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c1-3": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c1-4": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c1-5": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c1-6": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c20-0": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c20-1": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c20-2": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c20-3": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c20-4": [
{
"title": "Microsoft Learn",
"url": "https://learn.microsoft.com/ja-jp/training/azure/"
}
],
"c2-0": [
{
"title": "Google Cloud Skills Boost（一部無料）",
"url": "https://www.cloudskillsboost.google/"
}
],
"c2-1": [
{
"title": "Google Cloud Skills Boost（一部無料）",
"url": "https://www.cloudskillsboost.google/"
}
],
"c2-2": [
{
"title": "Google Cloud Skills Boost（一部無料）",
"url": "https://www.cloudskillsboost.google/"
}
],
"c2-3": [
{
"title": "Google Cloud Skills Boost（一部無料）",
"url": "https://www.cloudskillsboost.google/"
}
],
"c20-5": [
{
"title": "Google Cloud Skills Boost（一部無料）",
"url": "https://www.cloudskillsboost.google/"
}
],
"c20-6": [
{
"title": "Google Cloud Skills Boost（一部無料）",
"url": "https://www.cloudskillsboost.google/"
}
],
"c20-7": [
{
"title": "Google Cloud Skills Boost（一部無料）",
"url": "https://www.cloudskillsboost.google/"
}
],
"c20-8": [
{
"title": "Google Cloud Skills Boost（一部無料）",
"url": "https://www.cloudskillsboost.google/"
}
],
"c20-9": [
{
"title": "Google Cloud Skills Boost（一部無料）",
"url": "https://www.cloudskillsboost.google/"
}
],
"c3-1": [
{
"title": "Ping-t（レベル1は無料）",
"url": "https://ping-t.com/"
},
{
"title": "LPI-Japan 公式学習教材（例題と解説）",
"url": "https://linuc.org/study/samples/"
},
{
"title": "LPI-Japan Linux標準教科書",
"url": "https://linuc.org/textbooks/linux/"
}
],
"c3-2": [
{
"title": "Ping-t（レベル1は無料）",
"url": "https://ping-t.com/"
},
{
"title": "LPI-Japan 公式学習教材（例題と解説）",
"url": "https://linuc.org/study/samples/"
},
{
"title": "LPI-Japan Linux標準教科書",
"url": "https://linuc.org/textbooks/linux/"
}
],
"c3-3": [
{
"title": "Ping-t（レベル1は無料）",
"url": "https://ping-t.com/"
},
{
"title": "LPI-Japan 公式学習教材（例題と解説）",
"url": "https://linuc.org/study/samples/"
},
{
"title": "LPI-Japan Linux標準教科書",
"url": "https://linuc.org/textbooks/linux/"
}
],
"c4-0": [
{
"title": "Ping-t（レベル1は無料）",
"url": "https://ping-t.com/"
},
{
"title": "LPI-Japan 公式学習教材（例題と解説）",
"url": "https://linuc.org/study/samples/"
},
{
"title": "LPI-Japan Linux標準教科書",
"url": "https://linuc.org/textbooks/linux/"
}
],
"c4-1": [
{
"title": "Ping-t（レベル1は無料）",
"url": "https://ping-t.com/"
},
{
"title": "LPI-Japan 公式学習教材（例題と解説）",
"url": "https://linuc.org/study/samples/"
},
{
"title": "LPI-Japan Linux標準教科書",
"url": "https://linuc.org/textbooks/linux/"
}
],
"c4-2": [
{
"title": "Ping-t（レベル1は無料）",
"url": "https://ping-t.com/"
},
{
"title": "LPI-Japan 公式学習教材（例題と解説）",
"url": "https://linuc.org/study/samples/"
},
{
"title": "LPI-Japan Linux標準教科書",
"url": "https://linuc.org/textbooks/linux/"
}
],
"c4-3": [
{
"title": "Ping-t（レベル1は無料）",
"url": "https://ping-t.com/"
},
{
"title": "LPI-Japan 公式学習教材（例題と解説）",
"url": "https://linuc.org/study/samples/"
},
{
"title": "LPI-Japan Linux標準教科書",
"url": "https://linuc.org/textbooks/linux/"
}
],
"c9-0": [
{
"title": "Ping-t（Bronzeは一部無料）",
"url": "https://ping-t.com/"
}
],
"c9-3": [
{
"title": "Ping-t（Bronzeは一部無料）",
"url": "https://ping-t.com/"
}
]
};
