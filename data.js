// 資格カタログ: [分野, 認定団体, 公式URL, [資格名...]]
// 資格IDは「c<グループ番号>-<資格の並び順>」で決まるため、資格は各グループの末尾にだけ追加すること。
// 問題データは data/bank/<資格ID>.json(件数は data/bank-index.js)。
const groups = [
["国家試験","IPA","https://www.ipa.go.jp/shiken/kubun/list.html",["ITパスポート","情報セキュリティマネジメント","基本情報技術者","応用情報技術者","ITストラテジスト","システムアーキテクト","プロジェクトマネージャ","ネットワークスペシャリスト","データベーススペシャリスト","エンベデッドシステムスペシャリスト","ITサービスマネージャ","システム監査技術者","情報処理安全確保支援士"]],
["クラウド","Microsoft Learn","https://learn.microsoft.com/ja-jp/credentials/browse/",["AZ-900 · Azure Fundamentals","AZ-104 · Azure Administrator","AZ-305 · Azure Solutions Architect","SC-900 · Security Fundamentals","DP-900 · Azure Data Fundamentals","AZ-500 · Azure Security Engineer","AZ-700 · Azure Network Engineer"]],
["クラウド","Google Cloud","https://cloud.google.com/learn/certification",["Cloud Digital Leader","Associate Cloud Engineer","Professional Cloud Architect","Professional Data Engineer"]],
["Linux・基盤","LPI","https://www.lpi.org/our-certifications/",["Linux Essentials","LPIC-1","LPIC-2","LPIC-3"]],
["Linux・基盤","LPI-Japan","https://linuc.org/",["LinuC レベル1","LinuC レベル2","LinuC レベル3","LinuCシステムアーキテクト"]],
["Linux・基盤","Red Hat","https://www.redhat.com/en/services/certifications",["RHCSA","RHCE"]],
["ネットワーク","CompTIA","https://www.comptia.org/en-us/certifications/",["CompTIA A+","CompTIA Network+","CompTIA Security+","CompTIA Linux+","CompTIA Cloud+","CompTIA CySA+","CompTIA PenTest+","CompTIA SecurityX","CompTIA Data+","CompTIA Project+"]],
["ネットワーク","Cisco","https://www.cisco.com/site/us/en/learn/training-certifications/certifications/index.html",["CCNP Enterprise","CCNP Security","CCNP Data Center","CCIE Enterprise Infrastructure","CCDE"]],
["ネットワーク","Juniper","https://www.juniper.net/us/en/training/certification.html",["JNCIA-Junos","JNCIS-ENT","JNCIP-ENT","JNCIE-ENT"]],
["データ・開発","Oracle","https://education.oracle.com/oracle-certification",["ORACLE MASTER Bronze DBA","Oracle Java SE","OCI Foundations","ORACLE MASTER Silver DBA"]],
["データ・開発","Pythonエンジニア育成推進協会","https://www.pythonic-exam.com/",["Python 3 エンジニア認定基礎","Python 3 エンジニア認定データ分析","Python 3 エンジニア認定実践"]],
["データ・開発","JDLA","https://www.jdla.org/certificate/",["G検定","E資格"]],
["クラウド","CNCF","https://www.cncf.io/training/certification/",["KCNA","CKA","CKAD","CKS","KCSA"]],
["クラウド","HashiCorp","https://developer.hashicorp.com/certifications",["Terraform Associate","Vault Associate","Consul Associate"]],
["セキュリティ","ISC2","https://www.isc2.org/certifications",["CISSP","CC · Certified in Cybersecurity","SSCP","CCSP","CSSLP","CGRC"]],
["セキュリティ","ISACA","https://www.isaca.org/credentialing",["CISA","CISM","CRISC","CGEIT","CDPSE"]],
["運用・管理","PMI","https://www.pmi.org/certifications",["PMP","CAPM","PMI-ACP","PgMP"]],
["運用・管理","PeopleCert","https://www.peoplecert.org/",["ITIL Foundation","ITIL上位資格","PRINCE2 Foundation","PRINCE2 Practitioner"]],
["データ・開発","その他","",["OSS-DB Silver","OSS-DB Gold","データベース技術者認定（PostgreSQL）","統計検定","データサイエンティスト検定","ウェブデザイン技能検定","HTML5プロフェッショナル認定","Ruby技術者認定 Silver","Ruby技術者認定 Gold","JSTQB Foundation","JSTQB Advanced","GitHub Foundations","GitHub Actions","Salesforce 認定アドミニストレーター","Salesforce Platform Developer","Databricks Data Engineer Associate","SnowPro Core"]],
["セキュリティ","その他","",["CEH","OSCP","GIAC GSEC","GIAC GCIH","GIAC GCIA","GIAC GREM","ISO/IEC 27001 審査員","個人情報保護士"]],
["クラウド","その他","",["AZ-204 · Azure Developer","AZ-400 · DevOps Engineer","SC-200 · Security Operations Analyst","SC-300 · Identity and Access Administrator","SC-100 · Cybersecurity Architect","Professional Cloud DevOps Engineer","Professional Cloud Security Engineer","Professional Cloud Network Engineer","Professional Cloud Developer","Professional Cloud Database Engineer","OCI Architect Associate","VMware VCP","Nutanix Certified Professional"]]
];

// 試験予約サイト: 資格名 → [URL, 表示名]。学習室のワークスペースから新しいタブで開く。
// URLは 2026-11-19 に公式サイトで確認したもの。資格名で引くため、資格名を変える場合はここも合わせること。
const bookingSites = (() => {
  const map = {};
  const put = (names, url, label) => names.forEach(name => { map[name] = [url, label]; });
  const lf = slug => 'https://training.linuxfoundation.org/certification/' + slug + '/';
  put(groups[0][3], 'https://www.ipa.go.jp/shiken/mousikomi/index.html', 'IPA 受験申込み');
  put([...groups[1][3], 'AZ-204 · Azure Developer','AZ-400 · DevOps Engineer','SC-200 · Security Operations Analyst','SC-300 · Identity and Access Administrator','SC-100 · Cybersecurity Architect'],
    'https://www.pearsonvue.com/jp/ja/microsoft.html', 'ピアソンVUE（Microsoft 認定試験）');
  put([...groups[2][3], 'Professional Cloud DevOps Engineer','Professional Cloud Security Engineer','Professional Cloud Network Engineer','Professional Cloud Developer','Professional Cloud Database Engineer'],
    'https://www.webassessor.com/googlecloud', 'Webassessor（Google Cloud 認定試験）');
  put(groups[3][3], 'https://www.pearsonvue.com/jp/ja/lpi.html', 'ピアソンVUE（LPI 認定試験）');
  put(groups[4][3], 'https://linuc.org/exam/', 'LinuC 受験のお申込み（LPI-Japan）');
  put(groups[5][3], 'https://rhtapps.redhat.com/individualexamscheduler/', 'Red Hat Exam Scheduler');
  put(groups[6][3], 'https://www.pearsonvue.com/jp/ja/comptia.html', 'ピアソンVUE（CompTIA 認定試験）');
  put(groups[7][3], 'https://www.pearsonvue.com/jp/ja/cisco.html', 'ピアソンVUE（Cisco 認定試験）');
  put(groups[8][3], 'https://www.pearsonvue.com/us/en/junipernetworks.html', 'ピアソンVUE（Juniper / HPE Networking 認定試験）');
  put([...groups[9][3], 'OCI Architect Associate'], 'https://www.pearsonvue.com/jp/ja/oracle.html', 'ピアソンVUE（Oracle 認定試験）');
  put(groups[10][3], 'https://cbt.odyssey-com.co.jp/pythonic-exam/index.html', 'Odyssey CBT（Pythonエンジニア認定試験）');
  put(['G検定'], 'https://www.jdla.org/certificate/general/start/', 'JDLA G検定 受験案内');
  put(['E資格'], 'https://www.jdla.org/certificate/engineer/', 'JDLA E資格 受験案内');
  put(['KCNA'], lf('kubernetes-cloud-native-associate'), 'Linux Foundation（KCNA 申込み）');
  put(['CKA'], lf('certified-kubernetes-administrator-cka'), 'Linux Foundation（CKA 申込み）');
  put(['CKAD'], lf('certified-kubernetes-application-developer-ckad'), 'Linux Foundation（CKAD 申込み）');
  put(['CKS'], lf('certified-kubernetes-security-specialist'), 'Linux Foundation（CKS 申込み）');
  put(['KCSA'], lf('kubernetes-and-cloud-native-security-associate-kcsa'), 'Linux Foundation（KCSA 申込み）');
  put(groups[13][3], 'https://developer.hashicorp.com/certifications', 'HashiCorp Certifications');
  put(groups[14][3], 'https://www.isc2.org/Register-for-Exam', 'ISC2 試験予約（ピアソンVUE）');
  put(['CISA'], 'https://www.isaca.org/credentialing/cisa/cisa-exam', 'ISACA（CISA 試験登録）');
  put(['CISM'], 'https://www.isaca.org/credentialing/cism/cism-exam', 'ISACA（CISM 試験登録）');
  put(['CRISC'], 'https://www.isaca.org/credentialing/crisc', 'ISACA（CRISC 試験登録）');
  put(['CGEIT'], 'https://www.isaca.org/credentialing/cgeit/cgeit-exam', 'ISACA（CGEIT 試験登録）');
  put(['CDPSE'], 'https://www.isaca.org/credentialing/cdpse', 'ISACA（CDPSE 試験登録）');
  put(groups[16][3], 'https://www.pearsonvue.com/jp/ja/pmi.html', 'ピアソンVUE（PMI 認定試験）');
  put(['ITIL Foundation','ITIL上位資格'], 'https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1', 'PeopleCert（ITIL 試験）');
  put(['PRINCE2 Foundation','PRINCE2 Practitioner'], 'https://www.peoplecert.org/', 'PeopleCert（PRINCE2 試験）');
  put(['OSS-DB Silver','OSS-DB Gold','データベース技術者認定（PostgreSQL）'], 'https://www.pearsonvue.com/jp/ja/oss-db.html', 'ピアソンVUE（OSS-DB 技術者認定試験）');
  put(['統計検定'], 'https://www.toukei-kentei.jp/', '統計検定 公式サイト');
  put(['データサイエンティスト検定'], 'https://www.datascientist.or.jp/dscertification/', 'データサイエンティスト協会（DS検定）');
  put(['ウェブデザイン技能検定'], 'https://www.webdesign.gr.jp/', 'ウェブデザイン技能検定 公式サイト');
  put(['HTML5プロフェッショナル認定'], 'https://www.pearsonvue.com/jp/ja/html5.html', 'ピアソンVUE（HTML5 認定試験）');
  put(['Ruby技術者認定 Silver','Ruby技術者認定 Gold'], 'https://www.ruby.or.jp/ja/certification/examination/', 'Rubyアソシエーション（受験案内）');
  put(['JSTQB Foundation','JSTQB Advanced'], 'https://www.pearsonvue.com/jp/ja/jstqb.html', 'ピアソンVUE（JSTQB 認定試験）');
  put(['GitHub Foundations','GitHub Actions'], 'https://examregistration.github.com/', 'GitHub 認定試験の登録');
  put(['Salesforce 認定アドミニストレーター','Salesforce Platform Developer'], 'https://www.webassessor.com/salesforce', 'Webassessor（Salesforce 認定試験）');
  put(['Databricks Data Engineer Associate'], 'https://www.databricks.com/learn/training/certification', 'Databricks Certification');
  put(['SnowPro Core'], 'https://learn.snowflake.com/en/certifications/', 'Snowflake Certifications');
  put(['CEH'], 'https://www.eccouncil.org/', 'EC-Council 公式サイト');
  put(['OSCP'], 'https://www.offsec.com/courses/pen-200/', 'OffSec（PEN-200 / OSCP）');
  put(['GIAC GSEC','GIAC GCIH','GIAC GCIA','GIAC GREM'], 'https://www.pearsonvue.com/us/en/giac.html', 'ピアソンVUE（GIAC 認定試験）');
  put(['ISO/IEC 27001 審査員'], 'https://www.jrca-jsa.or.jp/jrca/', 'JRCA 審査員評価登録センター');
  put(['個人情報保護士'], 'https://www.joho-gakushu.or.jp/piip/', '個人情報保護士認定試験 公式サイト');
  put(['VMware VCP'], 'https://www.pearsonvue.com/us/en/broadcom.html', 'ピアソンVUE（Broadcom / VMware 認定試験）');
  put(['Nutanix Certified Professional'], 'https://www.nutanix.com/support-services/training-certification', 'Nutanix University');
  return map;
})();
