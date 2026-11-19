const groups = [
['国家試験','IPA','https://www.ipa.go.jp/shiken/kubun/list.html',[
['ITパスポート','IT企業の業務改善で、業務プロセスを見直して再設計する手法は？','BPR','BCP','SLA','業務の流れそのものを根本から再設計する手法がBPR。BCPは事業継続計画、SLAはサービス水準の合意。'],
['情報セキュリティマネジメント','システム管理者にも業務上必要な操作だけを許可する原則は？','最小権限','職務ローテーション','リスク移転','最小権限は利用者やプロセスに必要なアクセスだけを与える。'],
['基本情報技術者','先に入れたデータを先に取り出す構造は？','キュー','スタック','ヒープ','キューはFIFO。スタックは最後に入れたものを先に取り出す。'],
['応用情報技術者','トランザクション処理で、更新すべてが成功するかすべてが取り消される性質は？','原子性','独立性','永続性','原子性により処理の一部だけが確定することを防げる。'],
['ITストラテジスト','IT投資で得られた利益を投資額に対する比率で評価する指標は？','ROI','RTO','MTTR','ROIは投資収益率。投資案件の経済性を比較する際に使う。'],
['システムアーキテクト','既存システムの外側から見た振る舞いを維持して内部構造を改善する作業は？','リファクタリング','回帰テスト','負荷試験','リファクタリングは保守性を高めるために内部設計を改善する。'],
['プロジェクトマネージャ','プロジェクトの最短完了時点を決める、所要時間が最大の経路は？','クリティカルパス','スプリント','作業パッケージ','この経路上の作業が遅れると、別途調整がない限り全体の完了時点も遅れる。'],
['ネットワークスペシャリスト','OSPFがリンク情報から最短経路を求めるために使うアルゴリズムは？','ダイクストラ法','ベルマンフォード法','ラウンドロビン','OSPFはリンクステート型のプロトコルで、リンク状態データベースをもとにSPF計算を行う。'],
['データベーススペシャリスト','列の組合せを索引に含め、索引だけで必要な列を取得できる状態を何と呼ぶ？','カバリングインデックス','外部キー制約','水平分割','索引に必要な列がそろえば、DBMSによっては表への追加アクセスを省ける。'],
['エンベデッドシステムスペシャリスト','応答期限を超えること自体が重大な障害につながるシステムの性質は？','ハードリアルタイム','ベストエフォート','結果整合性','ハードリアルタイムでは、処理結果の正しさと期限内の完了が求められる。'],
['ITサービスマネージャ','障害で失われても許容できるデータの時間幅を表す指標は？','RPO','RTO','SLO','RPOはどの時点までデータを戻せればよいかを示す。RTOは復旧時間の目標。'],
['システム監査技術者','監査判断の客観性を守るため、監査対象業務の責任を負わない考え方は？','独立性','機密性','可用性','監査対象の設計・運用に責任を持つと、自己評価になるため独立性に影響する。'],
['情報処理安全確保支援士','署名付き文書が途中で変更されていないかを検証するときに使う鍵は？','署名者の公開鍵','署名者の秘密鍵','受信者の秘密鍵','署名者は秘密鍵で署名し、検証者は対応する公開鍵で文書の完全性と署名を検証する。']
]],
['クラウド','Microsoft Learn','https://learn.microsoft.com/ja-jp/credentials/browse/',[
['AZ-900 · Azure Fundamentals','仮想マシンを利用者が管理するクラウドのサービスモデルは？','IaaS','SaaS','FaaS','IaaSでは提供側が物理基盤を管理し、利用者がゲストOSなどを管理する。'],
['AZ-104 · Azure Administrator','Azureリソースに対して、ユーザーに閲覧操作だけを許可する仕組みは？','Azure RBAC','Azure DNS','Azure Monitor','RBACでロールと対象範囲を指定して、操作権限を付与する。'],
['AZ-305 · Azure Solutions Architect','大規模なリージョン障害への備えとして検討する設計は？','複数リージョンへの配置','単一VMのサイズ拡大','単一サブネット内のIP追加','独立したリージョンに復旧先を用意し、データ複製と切替方法を設計する。'],
['SC-900 · Security Fundamentals','パスワードと認証アプリによる本人確認を組み合わせる方式は？','多要素認証','シングルサインオン','マネージドID','知識と所持のような別の種類の要素を組み合わせる。'],
['DP-900 · Azure Data Fundamentals','日々の受注処理など、小さな更新を高頻度で扱うワークロードは？','OLTP','OLAP','バッチ集計','OLTPは業務トランザクション向け。OLAPは集計や多次元分析向け。']
]],
['クラウド','Google Cloud','https://cloud.google.com/learn/certification',[
['Cloud Digital Leader','需要に応じてリソースの量を増減できるクラウドの性質は？','弾力性','永続性','非否認性','負荷に合わせて容量を調整できる性質が弾力性。'],
['Associate Cloud Engineer','Google CloudのIAMポリシーで、プリンシパルに権限の集合を与える単位は？','ロール','ゾーン','スナップショット','ロールは権限の集合。IAMポリシーのバインディングで誰にロールを付与するかを定義する。'],
['Professional Cloud Architect','リージョン障害時もサービスを継続するための設計は？','別リージョンの復旧先を用意する','単一ゾーンでVMを2台にする','単一リージョンのVMを大型化する','障害の影響範囲を分離し、データ複製と切替手順を設計する。'],
['Professional Data Engineer','ストレージと計算リソースを意識せずSQLで大規模分析を行えるGoogle Cloudサービスは？','BigQuery','Cloud DNS','Cloud NAT','BigQueryはマネージドな分析用データウェアハウス。']
]],
['Linux・基盤','LPI','https://www.lpi.org/our-certifications/',[
['Linux Essentials','Linuxで現在の作業ディレクトリを表示するコマンドは？','pwd','mkdir','rm','pwdは現在位置を表示する。mkdirはディレクトリ作成、rmはファイルなどの削除。'],
['LPIC-1','chmod 640で設定される所有者の権限は？','読み取りと書き込み','読み取りのみ','読み取りと実行','6は4（読み取り）と2（書き込み）の合計。グループは4、その他は0。'],
['LPIC-2','systemdで特定のサービスのログを表示するには？','journalctl -u サービス名','systemctl enable サービス名','lsblk','journalctl -uは指定ユニットのジャーナルを絞り込む。'],
['LPIC-3','異なるサーバー間でユーザーの識別情報を集中管理する代表的なプロトコルは？','LDAP','NTP','SNMP','LDAPはディレクトリサービスへのアクセスを提供する。']
]],
['Linux・基盤','LPI-Japan','https://linuc.org/',[
['LinuC レベル1','Linuxでファイルシステムの空き容量を確認するコマンドは？','df -h','du -h .','free -h','dfはファイルシステムの空き容量、duは指定ファイルやディレクトリの使用量を表示する。'],
['LinuC レベル2','Linuxでルーティングテーブルを表示する一般的なコマンドは？','ip route','ip link','hostname','ip routeはカーネルが利用する経路を表示する。'],
['LinuC レベル3'],['LinuCシステムアーキテクト']
]],
['Linux・基盤','Red Hat','https://www.redhat.com/en/services/certifications',[
['RHCSA','systemdでサービスを今すぐ起動し、次回起動以降も自動起動させる指定は？','systemctl enable --now','systemctl status','systemctl daemon-reload','enableは自動起動を設定し、--nowを併用するとその場でも起動する。'],
['RHCE','Ansibleで何度実行しても目的の状態に収束する性質は？','冪等性','先入れ先出し','結果整合性','冪等なタスクは、すでにあるべき状態なら無用な変更を行わない。']
]],
['ネットワーク','CompTIA','https://www.comptia.org/en-us/certifications/',[
['CompTIA A+','電源を切ると内容を失う記憶装置は？','RAM','SSD','HDD','一般的なメインメモリのDRAMは揮発性。'],
['CompTIA Network+','ホストにIPアドレスやデフォルトゲートウェイなどを配布するプロトコルは？','DHCP','DNS','NTP','DHCPでIPアドレスやネットワーク設定を自動割り当てできる。'],
['CompTIA Security+','ハッシュ値を照合してファイル改変を検出するときに確認する性質は？','完全性','可用性','機密性','完全性とはデータが意図せず変更されていない性質。信頼できる元のハッシュ値との照合が必要。'],
['CompTIA Linux+'],['CompTIA Cloud+'],['CompTIA CySA+'],['CompTIA PenTest+'],['CompTIA SecurityX'],['CompTIA Data+'],['CompTIA Project+']
]],
['ネットワーク','Cisco','https://www.cisco.com/site/us/en/learn/training-certifications/certifications/index.html',[
['CCNP Enterprise','複数のルーターで仮想デフォルトゲートウェイを提供できるCiscoのプロトコルは？','HSRP','LACP','LLDP','HSRPは仮想IPを共有し、アクティブルーターの障害時に待機側へ切り替える。'],
['CCNP Security'],['CCNP Data Center'],['CCIE Enterprise Infrastructure'],['CCDE']
]],
['ネットワーク','Juniper','https://www.juniper.net/us/en/training/certification.html',[
['JNCIA-Junos','Junosで設定変更を確定するコマンドは？','commit','show configuration','configure','configureで設定モードに入り、変更内容はcommitで確定する。'],
['JNCIS-ENT'],['JNCIP-ENT'],['JNCIE-ENT']
]],
['データ・開発','Oracle','https://education.oracle.com/oracle-certification',[
['ORACLE MASTER','SQLで集計後のグループに条件を指定する句は？','HAVING','WHERE','ORDER BY','WHEREは集計前の行を絞り、HAVINGは集計後のグループを絞る。'],
['Oracle Java SE','Javaでサブクラスが親クラスのインスタンスメソッドを同じシグネチャで再定義することは？','オーバーライド','オーバーロード','ボクシング','オーバーライドされたインスタンスメソッドは実行時の型に応じて呼び出される。'],
['OCI Foundations','OCIでリソースを論理的に整理し、アクセス権の範囲に使える単位は？','コンパートメント','リージョン','可用性ドメイン','コンパートメントはリソースのグループ分けとポリシー適用範囲に使う。']
]],
['データ・開発','Pythonエンジニア育成推進協会','https://www.pythonic-exam.com/',[
['Python 3 エンジニア認定基礎','Pythonで要素を書き換えられる順序付きコレクションは？','list','tuple','str','listは可変。tupleとstrは不変。'],
['Python 3 エンジニア認定データ分析','pandasで行と列を持つ2次元のデータ構造は？','DataFrame','Series','range','DataFrameは2次元、Seriesは1次元のラベル付きデータ構造。'],
['Python 3 エンジニア認定実践']
]],
['データ・開発','JDLA','https://www.jdla.org/certificate/',[
['G検定','正解ラベル付きのデータから分類を学習する方式は？','教師あり学習','教師なし学習','強化学習','教師あり学習は入力と正解ラベルを使って予測器を学習する。'],
['E資格','深層学習で損失の勾配を各層へ伝える際に利用する数学の規則は？','連鎖律','ベイズの定理','大数の法則','誤差逆伝播では連鎖律を使い、合成関数の各段階の微分から勾配を計算する。']
]],
['クラウド','CNCF','https://www.cncf.io/training/certification/',[
['KCNA','Kubernetesでコンテナを実行する最小のデプロイ単位は？','Pod','Node','Namespace','Podには一緒に動作する一つ以上のコンテナをまとめられる。'],
['CKA','KubernetesでPodのレプリカ数を維持し、段階的な更新を管理するオブジェクトは？','Deployment','ConfigMap','Namespace','DeploymentがReplicaSetを管理して希望するレプリカ数と更新を扱う。'],
['CKAD','アプリの機密性がない設定値をコンテナから参照できるようにするオブジェクトは？','ConfigMap','Ingress','PersistentVolume','ConfigMapは環境変数やボリューム経由で非機密設定を渡せる。'],
['CKS'],['KCSA']
]],
['クラウド','HashiCorp','https://developer.hashicorp.com/certifications',[
['Terraform Associate','Terraformで適用前に差分を確認するコマンドは？','terraform plan','terraform fmt','terraform output','planで現在の状態と構成を比較し、予定される変更を確認する。'],
['Vault Associate'],['Consul Associate']
]],
['セキュリティ','ISC2','https://www.isc2.org/certifications',[
['CISSP','リスクに対して対策を実施した後も残るリスクは？','残存リスク','固有リスク','移転リスク','残存リスクは管理策を適用した後に残るリスクで、受容判断などの対象になる。'],
['CC · Certified in Cybersecurity'],['SSCP'],['CCSP'],['CSSLP'],['CGRC']
]],
['セキュリティ','ISACA','https://www.isaca.org/credentialing',[
['CISA','重要な業務プロセスから優先的に監査する考え方は？','リスクベース監査','総当たり監査','職務ローテーション','リスクの大きさをもとに監査範囲や手続きの優先度を決める。'],
['CISM'],['CRISC'],['CGEIT'],['CDPSE']
]],
['運用・管理','PMI','https://www.pmi.org/certifications',[
['PMP','出来高管理でEVがACを下回る場合のコスト状況は？','超過している','予算より低い','計画どおり','EVは完了作業の予算上の価値、ACは実際の費用。EVよりACが大きければコスト超過。'],
['CAPM'],['PMI-ACP'],['PgMP']
]],
['運用・管理','PeopleCert','https://www.peoplecert.org/',[
['ITIL Foundation','通常のサービス運用をできるだけ早く回復するプラクティスは？','インシデント管理','問題管理','サービスレベル管理','インシデント管理は迅速なサービス復旧を重視する。問題管理では原因や再発防止を扱う。'],
['ITIL上位資格'],['PRINCE2 Foundation'],['PRINCE2 Practitioner']
]],
['データ・開発','その他','',[
['OSS-DB Silver'],['OSS-DB Gold'],['データベース技術者認定（PostgreSQL）'],['統計検定'],['データサイエンティスト検定'],['ウェブデザイン技能検定'],['HTML5プロフェッショナル認定'],['Ruby技術者認定 Silver'],['Ruby技術者認定 Gold'],['JSTQB Foundation'],['JSTQB Advanced'],['GitHub Foundations'],['GitHub Actions'],['Salesforce 認定アドミニストレーター'],['Salesforce Platform Developer'],['Databricks Data Engineer Associate'],['SnowPro Core']
]],
['セキュリティ','その他','',[
['CEH'],['OSCP'],['GIAC GSEC'],['GIAC GCIH'],['GIAC GCIA'],['GIAC GREM'],['ISO/IEC 27001 審査員'],['個人情報保護士']
]],
['クラウド','その他','',[
['AZ-204 · Azure Developer'],['AZ-400 · DevOps Engineer'],['SC-200 · Security Operations Analyst'],['SC-300 · Identity and Access Administrator'],['SC-100 · Cybersecurity Architect'],['Professional Cloud DevOps Engineer'],['Professional Cloud Security Engineer'],['Professional Cloud Network Engineer'],['Professional Cloud Developer'],['Professional Cloud Database Engineer'],['OCI Architect Associate'],['VMware VCP'],['Nutanix Certified Professional']
]]
];

const moreQuestions = {
'ネットワークスペシャリスト':[
['経路集約で 192.168.8.0/24 から 192.168.11.0/24 を過不足なくまとめるプレフィックスは？','192.168.8.0/22','192.168.8.0/23','192.168.0.0/20','第3オクテットの下位2ビットが変動する4ネットワークなので、/24から2ビット短くする。'],
['IPv4のTTLが転送時にゼロになる場合、ルーターは通常何を返す？','ICMP Time Exceeded','ICMP Echo Reply','TCP RST','TTL切れのパケットを破棄し、通常は送信元にICMP Time Exceededを返す。'],
['TCPで接続を確立する際のフラグの順序は？','SYN → SYN/ACK → ACK','ACK → SYN → FIN','SYN → RST → ACK','双方が初期シーケンス番号を提示し、相手の番号を確認する。']
],
'情報処理安全確保支援士':[
['Webサービスがパスワードの事前計算による照合を難しくするため、各利用者で変える値は？','ソルト','共通の初期パスワード','ハッシュ方式の名称','利用者ごとに異なるランダムなソルトを使い、パスワードに適したハッシュ関数で処理すると、事前計算結果を使い回しにくくなる。'],
['短時間で多数の認証失敗が発生した。初動で発生範囲と時系列の把握に役立つ情報は？','認証ログ','画面の配色設定','ソースコードの行数','認証ログの時刻、対象アカウント、処理結果などを突き合わせる。'],
['複数のシステム間で監査ログの時系列を比較する前提として合わせておくものは？','時刻','ホスト名','ポート番号','共通の時刻同期とタイムゾーンの把握により、システム間のイベントの順序を比較できる。']
],
'基本情報技術者':[
['整列済みの配列から二分探索で要素を探すとき、データ数 n に対する比較回数のオーダーは？','O(log n)','O(n²)','O(n)','1回の比較で残りの探索範囲がおおむね半分になる。'],
['A と B が両方とも真のときだけ真になる論理演算は？','AND','OR','XOR','ANDは論理積。XORはどちらか一方だけが真の場合に真になる。'],
['1バイトで表せる符号なし整数の最大値は？','255','256','127','8ビットは256通り。0から数えるため最大値は255。']
],
'AZ-104 · Azure Administrator':[
['AzureのNSGで同じ通信に複数の規則が一致する場合、最初に評価されるのは？','優先度の数値が最も小さい規則','最後に追加された規則','名前の長さが最も短い規則','NSGでは優先度の数値が小さい順に評価し、最初に一致した規則が適用される。'],
['Azure VM上のアプリに、資格情報をアプリ側に保管せずに対応サービスへ認証させる機能は？','マネージドID','プライベートDNSゾーン','可用性セット','マネージドIDを用いると、AzureがIDの資格情報を管理する。アクセス先の権限は別途付与する。']
],
'ITパスポート':[
['障害や災害の発生後も、重要業務を継続・復旧するために準備する計画は？','BCP','BPR','SLA','BCPは事業継続計画。代替手段や復旧時の優先業務などを定める。'],
['業務委託先とサービスの稼働率や問い合わせ応答時間について合意する文書は？','SLA','NDA','WBS','SLAはサービス水準合意。稼働率や応答時間、測定方法などを定める。']
]
};

const levelExercises = {
'LinuC レベル3':['複数ノードが同じ共有ディスクに同時書き込みして破損する事態を防ぐため、障害ノードを強制隔離する仕組みは？','フェンシング','ラウンドロビン','キャッシュ','クラスタから障害ノードの電源やストレージアクセスを遮断し、共有資源への競合を防ぐ。'],
'LinuCシステムアーキテクト':['災害復旧設計で、許容できるデータ損失を時間幅で表す指標は？','RPO','RTO','MTTR','RPOから必要なバックアップ頻度や複製方式を検討する。'],
'OSS-DB Silver':['PostgreSQLでトランザクション内の変更を取り消すSQLは？','ROLLBACK','COMMIT','ANALYZE','ROLLBACKはトランザクションを中止し、未確定の変更を取り消す。'],
'OSS-DB Gold':['SELECTの実際の行数と見積行数の差を調べる方法は？','EXPLAIN ANALYZE','VACUUM FULL','REINDEX','EXPLAIN ANALYZEは問い合わせを実行し、実測値とプランの推定値を示す。'],
'Ruby技術者認定 Silver':['Rubyで配列の各要素を変換して新しい配列を返すメソッドは？','map','each','join','mapはブロックの戻り値を集めて配列を作る。'],
'Ruby技術者認定 Gold':['モジュールをクラスに組み込み、そのクラスより先にメソッド探索の対象にするものは？','prepend','include','extend','prependしたモジュールはクラスの前に配置され、superで後続の実装へ委譲できる。'],
'JSTQB Foundation':['有効な入力と無効な入力を同じ挙動が期待されるグループに分ける技法は？','同値分割法','状態遷移テスト','探索的テスト','同値パーティションから代表値を選び、少ないケースで入力範囲を検証する。'],
'JSTQB Advanced':['限られた期間でテストの順序を決める際、障害の発生可能性と影響度を用いる手法は？','リスクベースドテスト','ランダムテスト','総当たりテスト','重要なリスクからテスト資源を割り当てる。'],
'PRINCE2 Foundation':['プロジェクトを続ける事業上の妥当性を示すものは？','ビジネスケース','課題登録簿','品質登録簿','ビジネスケースで期待便益、費用、リスク等を検討する。'],
'PRINCE2 Practitioner':['ステージのコスト許容限度を超過すると予測した。PMの次の対応は？','例外をプロジェクトボードに報告する','独断で許容限度を変更する','ステージ終了まで報告を待つ','例外によるマネジメントでは、委任された限度を超える見込みを上位に報告する。'],
'ITIL上位資格':['継続的改善で施策の効果を測るため、開始前に記録しておくべきものは？','比較の基準となる現状値','次期の組織図','担当者の勤務予定だけ','現状値と目標、実施後の測定値を比較して改善の効果を判断する。'],
'JNCIS-ENT':['OSPFでエリア間の経路情報をやり取りするルーターの役割は？','ABR','DR','BDR','ABRは複数エリアに接続し、エリア間の経路情報を扱う。'],
'JNCIP-ENT':['iBGPのフルメッシュ要件を緩和するため、クライアント間で経路を中継する役割は？','ルートリフレクタ','OSPFのDR','VRRPマスター','ルートリフレクタを導入すると全ルーター間のピア接続を減らせる。'],
'JNCIE-ENT':['Junosでインポートポリシー適用後、受信したBGP経路が選択候補から外れた。非表示経路を調べる表示は？','show route hidden','show interfaces terse','show system uptime','hidden経路を調べ、次ホップの解決やポリシーを確認する。'],
'CCIE Enterprise Infrastructure':['同一ASのiBGPピアから学習した経路が別のiBGPピアへ伝わらない。フルメッシュを避ける解決策は？','ルートリフレクタを設計する','全リンクのMTUを下げる','OSPFのHello間隔を延ばす','iBGP経路の再広告制限に対し、ルートリフレクションで経路を配布する。']
};
