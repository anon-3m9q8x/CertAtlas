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
