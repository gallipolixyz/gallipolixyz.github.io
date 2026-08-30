import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

interface Blog {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  tags: string[];
  image: string;
}

const blogs: Blog[] = [
  {
    slug: 'bulut-bilisim-yapilandirma-hatalari',
    title: 'Bulut Bilişim Güvenliği: Yapılandırma Hataları',
    excerpt: 'Buluttaki en büyük güvenlik ihlalleri, karmaşık saldırılardan değil, gözden kaçan basit yapılandırma hatalarından kaynaklanır.',
    author: 'Hiranur Gemalmaz',
  },
  {
    slug: 'letter-thm-osint-writeup',
    title: 'Letter - TryHackMe Writeup',
    excerpt: 'Bir zarftaki posta barkodundan başlayıp gazete küpürü ve tarihi arşiv kayıtlarına uzanan, beginner-friendly bir OSINT meydan okumasının adım adım çözümü.',
    author: 'Meryem şahin',
    tags: ['osint', 'tryhackme'],
    image: '/blogs/img/letter-thm-osint-writeup/image7.jpeg',
  },
  {
    slug: 'off-path-saldirilarda-sequence-numberin-onemi',
    title: 'Off-Path Saldırılarda Sequence Number Neden Kritik?',
    excerpt: 'TCP sequence number’larının off-path saldırılardaki rolünü, kör paket sahteciliğini ve savunma yöntemlerini giriş seviyesinde açıklayan bir rehber.',
    author: 'Toprak Yavuz',
    tags: ['tcp', 'network-security', 'sequence-number', 'off-path'],
    image: '/blogs/img/off-path-saldirilarda-sequence-numberin-onemi/off-path-tcp-sequence-diagram.png',
  },
  {
    slug: 'understanding-vulnerable-python-code',
    title: 'Understanding Vulnerable Python Code',
    excerpt: 'A walkthrough of five common vulnerable code patterns — IDOR, SQL injection, SSRF, insecure deserialization, and path traversal — plus a deep dive into TOCTOU race conditions, how they are exploited, detected, and mitigated.',
    author: 'aymaan-balbale',
    tags: ['web-security', 'vulnerable-code', 'race-conditions'],
    image: '/blogs/img/understanding-vulnerable-python-code/image1.png',
  },
  {
    slug: 'usb-bellek-windows-dijital-izler',
    title: 'USB Bellek Çıkarıldıktan Sonra Windows’ta Kalan İzler',
    excerpt: 'USB bellek çıkarıldıktan sonra kimliği USBSTOR’da, ilk tanınma setupapi.dev.log içinde, son takılma ve çıkarılma damgaları Properties altında durur. Disk imajı gerekmez; Windows’un kendi araçları yeterlidir.',
    author: 'Bağdagül Çağlar',
    tags: ['soc', 'windows', 'forensics', 'usb'],
    image: '/blogs/img/usb-bellek-windows-dijital-izler/00-kapak.jpg',
  },
  {
    slug: 'rag-sistemlerinde-veri-guvenligi',
    title: 'RAG Sistemlerinde Veri Güvenliği: LLM’e Her Veriyi Vermek Neden Tehlikeli?',
    excerpt: 'RAG mimarisinde veri güvenliğinin önemi; Data Poisoning, Prompt Injection, Sensitive Data Leakage ve Access Control zafiyetleri ve çözüm yolları.',
    author: 'Meryem Şahin',
    tags: ['ai-security', 'rag', 'llm', 'cybersecurity', 'vector-database'],
    image: '/blogs/img/rag/img1.png',
  },
   {
    slug: 'git-cheat-sheet',
    title: 'Git Cheat Sheet: Günlük Geliştirmede İhtiyacınız Olan Git Komutları',
    excerpt: 'Bu yazıda Git komutlarını ezberlemek yerine, hangi durumda hangi Git komutunu kullanmanız gerektiğini anlamaya çalışacağız.',
    author: 'Güven Emre Keskin',
    tags: ['git', 'github', 'software-development'],
    image: '/blogs/img/git-cheat-sheet/git.png',
  },
   {
    slug: 'native',
    title: 'Android Native Katmanı: ELF ve Dinamik Linker',
    excerpt: 'Android uygulamalarının temelini oluşturan native katmanı, ELF dosya formatı ve dinamik linkerın işleyişi üzerine detaylı bir inceleme.',
    author: 'Simge Yiğit',
    tags: ['mobile', 'android', 'frida'],
    image: '/blogs/img/everNote/blog.jpg',
  },
   {
    slug: 'modern-web-nasil-calisir',
    title: 'Modern Web Nasıl Çalışır?',
    excerpt: 'İstemci-sunucu mimarisi,DNS ve HTTP istek süreçlerinin detaylı incelenmesi.',
    author: 'Sebahat Kuşcu',
    tags: ['web', 'networking', 'http', 'dns'],
    image: '/blogs/img/modern-web-nasil-calisir/image.png',
  },
  {
    slug: 'fortinet-ngfw-fortios',
    title: 'Fortinet Odaklı Kurumsal Ağ Güvenliği: Next-Generation Firewall Mimarisi ve FortiOS Teknolojileri',
    excerpt: 'FortiGate NGFW cihazlarının ASIC mimarisini, FortiOS ekosistemini ve kurumsal ağlarda güvenlik duvarı yapılandırma adımlarını inceledik.',
    author: 'Meryem Şahin',
    tags: ['network-security', 'firewall', 'fortinet', 'fortios'],
    image: '/blogs/img/fortinet-ngfw-fortios/img1.png',
  },
  {
    slug: 'wireshark-ile-derin-ag-trafigi-analizi',
    title: 'Wireshark ile Derin Ağ Trafiği Analizi: Paket Paket Güvenlik İncelemesi',
    excerpt: 'Eğitim amaçlı bir PCAP dosyası üzerinden saldırı trafiğini paket düzeyinde inceliyoruz: DNS ve HTTP filtreleriyle şüpheli aktivite tespiti, Follow TCP Stream ile veri sızıntısı analizi, ARP/DNS spoofing ve port taraması göstergeleri.',
    author: 'Bağdagül Çağlar',
    tags: ['wireshark', 'network-analysis', 'cybersecurity', 'pcap'],
    image: '/blogs/img/wireshark-ile-derin-ag-trafigi-analizi/01-wireshark-arayuz.png',
  },
  {
    slug: 'gtasa-save-reversing',
    title: 'Binary/File Format Reverse Engineering: Editing a GTA San Andreas Save File',
    excerpt: 'A practical walkthrough of reversing a GTA: San Andreas save file — identifying BLOCK structures, locating tag data, and patching it with proper checksum validation.',
    author: 'aymaan-balbale',
    tags: ['reverse-engineering', 'binary-analysis', 'file-format'],
    image: '/blogs/img/gtasa-save-reversing/image1.png',
  },
  {
    slug: 'owasp-kubernetes-top-10-2025',
    title: 'Kubernetes Top 10 Zafiyetleri',
    excerpt: 'Hem kubernetes güvenliğini öğrenebileceğiniz hem de size el defteri olabilecek bir rehber.',
    author: 'Hiranur Gemalmaz',
    tags: ['kubernetes', 'cloud', 'devsecops'],
    image: 'blogs/img/kubernetestop10/kubernetes1.png',
  },
  {
    slug: 'akilli-supurge-hack',
    title: 'Akıllı Süpürgeniz Hacklenebilir mi?',
    excerpt: 'Evlerimizdeki akıllı robot süpürgelerin barındırdığı güvenlik açıklarını ve gerçek dünya senaryolarını inceledik.',
    author: 'Burak Kıraç',
    tags: ['iot', 'hardware', 'pentest'],
    image: '/blogs/img/Akilli-Supurge-Hack/kapak-supurge.svg',
  },
  {
    slug: 'code-challenge1-writeup',
    title: 'Code Challenge Write-Up: Broken Object Level Authorization (BOLA)',
    excerpt: 'BOLA zafiyeti açıklanmış ve Code Challenge çözüm write-upı hazırlanmıştır.',
    author: 'Simge Yiğit',
    tags: ['web', 'bola', 'api-security'],
    image: '/blogs/img/codechallenge/challenge1_1.jpg',
  },
  {
    slug: 'ag-trafik-analizi',
    title: 'Ağ Trafik Analizi',
    excerpt: 'Ağ trafiği analizi, SOC süreçleri ve BPF filtreleme teknikleri üzerine detaylı inceleme.',
    author: 'Sebahat Kuşcu',
    tags: ['soc', 'network', 'forensics'],
    image: '/blogs/img/ag-trafik-analizi/image.png',
  },
  {
    slug: 'xss-payload-dissection-formatted',
    title: 'Understanding SVG XSS Payloads: A Tale of Two CVEs',
    excerpt: 'A deep dive into how SVG XSS payloads bypass security filters, analyzing CVE-2025-0133 on PAN-OS and CVE-2025-4406 on wpForo Forum.',
    author: 'aymaan-balbale',
    tags: ['web', 'xss', 'cve'],
    image: '/blogs/img/xss-payload-dissection-formatted/palo-alto-xss-flow.png',
  },
  {
    slug: 'types-of-ai-jailbreaking',
    title: 'Yapay Zekâ Jailbreaking Türleri',
    excerpt: 'Yapay zekâ modellerindeki güvenlik sınırlarının nasıl zorlandığını; 16 farklı jailbreak yönteminin çalışma mantığı, araştırma örnekleri ve savunma yaklaşımları üzerinden inceliyoruz.',
    author: 'Osman Erdem Dutar',
    tags: ['ai', 'llm', 'jailbreak'],
    image: '/blogs/img/types-of-ai-jailbreaking/image1.png',
  },
  {
    slug: 'aws-iam-privilege-escalation-and-cross-account-vulnerability-chains',
    title: 'AWS Ortamlarında IAM Yetki Yükseltme ve Çapraz Hesap Zafiyet Zincirleri',
    excerpt: 'AWS ortamlarında IAM yetki yükseltme ve çapraz hesap zafiyet zincirlerini keşfetmek için kapsamlı bir rehber. ',
    author: 'Meryem Şahin',
    tags: ['aws', 'cloud', 'iam'],
    image: '/blogs/img/aws-iam-privilege-escalation-and-cross-account-vulnerability-chains/image1.png',
  },
  {
    slug: 'aws-iam-cloud-security-misconfigurations',
    title: 'Bulut Güvenliği: AWS IAM Temelleri ve Sık Yapılan Yapılandırma Hataları',
    excerpt: 'Bulut ortamlarında güvenlik çevre çizgisi (perimeter) kimliktir. AWS IAM mimarisi, en sık yapılan misconfiguration (hatalı yapılandırma) türleri, IAM Privilege Escalation vektörleri ve IMDSv1/v2 zafiyetleri üzerine detaylı bir teknik inceleme.',
    author: 'Efe Kırbaş',
    tags: ['aws', 'cloud', 'security'],
    image: '/blogs/img/aws-iam-cloud-security-misconfigurations/banner.png',
  },
  {
    slug: 'windows-loglari-ransomware-taramasi',
    title: 'Windows Güvenlik Logları ile Ransomware Taraması',
    excerpt: 'Fidye yazılımı vakalarında şifrelenmiş dosyalar yalnızca son sahnedir; asıl hikâye Windows olay günlüklerinde saklıdır. 4625, 4624, 4720, 4732, 7045 ve 1102 ile saldırının izini adım adım sürüyoruz.',
    author: 'Bağdagül Çağlar',
    tags: ['soc', 'windows', 'ransomware'],
    image: '/blogs/img/windows-loglari-ransomware-taramasi/01-saldiri-akisi.png',
  },
  {
    slug: 'opnsense-trafik-analiz',
    title: "Gelenekselden Modern'e C2 Altyapıları ve OPNsense ile Trafik Analizi",
    excerpt: 'Geleneksel ve modern C2 altyapılarının çalışma mekanizmaları ile OPNsense firewall kullanarak ağ üzerindeki zararlı trafiğin analizi',
    author: 'Burak Kıraç',
    tags: ['network', 'c2', 'firewall'],
    image: '/blogs/img/opnsense-trafik-analiz/image1.webp',
  },
  {
    slug: 'poisoned-pipeline-execution-ppe',
    title: 'CI/CD Pipeline Saldırıları: Poisoned Pipeline Execution (PPE)',
    excerpt: 'Siber güvenlik dünyasında, özellikle DevSecOps süreçlerinde giderek daha fazla karşılaşılan ve sistemleri derinden sarsabilen kritik bir konu bulunmaktadır: Poisoned Pipeline Execution (PPE), yani Zehirlenmiş Pipeline Çalıştırması.',
    author: 'Efe Kırbaş',
    tags: ['devsecops', 'ci-cd', 'security'],
    image: '/blogs/img/poisoned-pipeline-execution-ppe/1.png',
  },
  {
    slug: 'modsecurity',
    title: 'Modsecurity Nedir?',
    excerpt: 'Web uygulamalarınızı OWASP Top 10 ve Katman 7 saldırılarına karşı koruyan açık kaynaklı güvenlik duvarı ModSecurity\'nin ne olduğunu ve nasıl çalıştığını keşfedin.',
    author: 'Güven Emre Keskin',
    tags: ['web', 'waf', 'owasp'],
    image: '/blogs/img/modsecurity/modsec1.jpg',
  },
  {
    slug: 'browser-extension-supply-chain-attacks',
    title: 'Browser Extension Supply Chain Attacks',
    excerpt: 'Extensions run inside your browser with access to every tab you open — and they auto-update silently. How extension supply chain attacks work, why they’re effective, and what you can do about them.',
    author: 'Matjaz Madon',
    tags: ['supply-chain', 'browser', 'security'],
    image: '/blogs/img/browser-extension/browser-extension.png',
  },
  {
    slug: 'frida-labs',
    title: 'Frida ile Android Uygulama Hooking — Lab 0x1: Method Hooking',
    excerpt: 'Bu yazıda, Frida ile Android uygulama hooking üzerine bir laboratuvar çalışması gerçekleştiriyoruz. Lab 0x1: Method Hooking adımında, uygulamanın belirli metodlarını hook ederek davranışlarını analiz ediyoruz.',
    author: 'Simge Yiğit',
    tags: ['mobile', 'android', 'frida'],
    image: '/blogs/img/frida-labs/frida.jpg',
  },
  {
    slug: 'ctf-8-tools-beginner-summary',
    title: 'CTF İçin 8 Temel Araç',
    excerpt: 'CTF’e yeni başlayanların bilmesi gereken Nmap, ffuf, Burp Suite, sqlmap, CyberChef, Wireshark, ExifTool ve John the Ripper gibi temel araçları kısa ve anlaşılır şekilde tanıtan bir rehberdir.',
    author: 'Osman Erdem Dutar',
    tags: ['ctf', 'tools', 'beginner'],
    image: '/blogs/img/ctf-8-tools-beginner-summary/opening.png',
  },
  {
    slug: 'network-devices',
    title: 'Ağ Güvenliği Cihazları',
    excerpt: 'Ağ güvenliği cihazları, ağ trafiğini izleyip analiz ederek yetkisiz erişimleri ve siber saldırıları farklı katmanlarda tespit eden, engelleyen ve müdahale eden güvenlik teknolojileridir.',
    author: 'Güven Emre Keskin',
    tags: ['network', 'security', 'hardware'],
    image: '/blogs/img/network-devices/firewall.jpg',
  },
  {
    slug: 'easypeasy-writeup',
    title: 'TryHackMe - EasyPeasy CTF Write-up',
    excerpt: 'TryHackMe platformunda yer alan ve siber güvenlik temellerini pekiştirmek için harika bir senaryoya sahip olan EasyPeasy makinesinin adım adım çözümü.',
    author: 'Burak Kıraç',
    tags: ['ctf', 'writeup', 'tryhackme'],
    image: '/blogs/img/easypeasy/easy1.webp',
  },
  {
    slug: 'androidde-llm',
    title: 'LLM Modellerini Android Uygulama Güvenliğinde Nasıl Kullanırız?',
    excerpt: 'LLM modelleri otomasyondan analiz, zafiyet tespiti ve raporlama gibi birçok alanda Android uygulama güvenliğinde devrim yaratıyor. Bu yazıda, LLM modellerinin Android güvenlik testlerinde nasıl etkili bir şekilde kullanılabileceğini keşfediyoruz.',
    author: 'Simge Yiğit',
    tags: ['ai', 'mobile', 'android'],
    image: '/blogs/img/blog-images/1.png',
  },
  {
    slug: 'ctf-solution-wordpress-royal-elementor-to-root-gridloy',
    title: 'CTF Çözümü: WordPress Royal Elementor Exploit ile Root’a Erişim',
    excerpt: 'Örnek bir senaryo üzerinde WordPress servis keşfi, Royal Elementor eklentisindeki zafiyetin istismarı, ilk erişim elde edilmesi ve root yetkisine kadar ilerleyen privilege escalation adımlarının incelendiği bu write-up.',
    author: 'Osman Erdem Dutar',
    tags: ['ctf', 'wordpress', 'writeup'],
    image: '/blogs/img/ctf-solution-wordpress-royal-elementor-to-root-gridloy/scenerio.png',
  },
  {
    slug: 'ctf-solution-information-disclosure-and-privilege-escalation-on-the-machine',
    title: 'CTF Çözümü: Information Disclosure ve Privilege Escalation',
    excerpt: 'Senaryo üzerinde bilgi ifşası, açıkta bırakılan geliştirme dizinleri, parola tekrar kullanımı ve hatalı sudo yetkilendirmesi üzerinden ilerlenen bu write-up\'ta; keşif, ilk erişim, lateral movement ve privilege escalation adımları incelenmektedir.',
    author: 'Osman Erdem Dutar',
    tags: ['ctf', 'writeup', 'linux'],
    image: '/blogs/img/ctf-solution-information-disclosure-and-privilege-escalation-on-the-machine/scenerio.png',
  },
  {
    slug: 'ceh',
    title: 'Siber Güvenlik Sertifikaları #5: CEH (Certified Ethical Hacker) Sınavının Anatomisi',
    excerpt: 'Siber güvenlik dünyasının en çok tartışılan ve reklamı yapılan sertifikası CEH’i, yeni v13 AI müfredatı ve sektörel geçerliliğiyle mercek altına alıyoruz.',
    author: 'Ozan İsmail Çolhak',
    tags: ['certification', 'pentest', 'career'],
    image: '/blogs/img/ceh/ceh.png',
  },
  {
    slug: 'oscp',
    title: 'Siber Güvenlik Sertifikaları #4: OSCP+ Sınavının Anatomisi',
    excerpt: 'Siber güvenlik dünyasının onur madalyası olarak kabul edilen OSCP+ sertifikasını, 24 saatlik maratonu ve yeni PEN-200 müfredatıyla masaya yatırıyoruz.',
    author: 'Ozan İsmail Çolhak',
    tags: ['certification', 'pentest', 'oscp'],
    image: '/blogs/img/oscp/oscp.png',
  },
  {
    slug: 'lazarus',
    title: 'Lazarus Group (APT 38) Rapor Analizi',
    excerpt: 'Lazarus Group, APT 38 olarak da bilinen Kuzey Kore hükümeti ile bağlantılı olduğu kabul edilen, devlet destekli bir APT grubudur.',
    author: 'Güven Emre Keskin',
    tags: ['threat-intel', 'apt', 'malware'],
    image: '/blogs/img/lazarus/lazarus_1.png',
  },
  {
    slug: 'soc-lab-6-wazuh',
    title: 'SOC Lab Rehberi Bölüm 6: Wazuh Dashboard ve İlk Agent Kurulumu',
    excerpt: 'Bu bölümde, kurduğumuz bu devasa yapının içine girip, izlemek istediğimiz cihazları sisteme nasıl bağlayacağımızı göreceğiz.',
    author: 'Güven Emre Keskin',
    tags: ['soc', 'siem', 'wazuh'],
    image: '/blogs/img/soc-lab-6-wazuh/wazuh.webp',
  },
  {
    slug: 'soc-lab-5-ubuntu-wazuh',
    title: 'SOC Lab Rehberi Bölüm 5: Ubuntu Server Üzerine Wazuh Kurulumu',
    excerpt: 'Bu bölümde, laboratuvarımızdaki tüm olayları tek bir merkezden izlememizi sağlayacak olan Wazuh platformunu kuruyoruz.',
    author: 'Güven Emre Keskin',
    tags: ['soc', 'siem', 'linux'],
    image: '/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu.webp',
  },
  {
    slug: 'soc-lab-4-ad',
    title: 'SOC Lab Rehberi Bölüm 4: Active Directory',
    excerpt: 'Bu bölümde, Windows Server 2022 makinesini bir Domain Controller yapısına dönüştürüyoruz.',
    author: 'Güven Emre Keskin',
    tags: ['soc', 'active-directory', 'windows'],
    image: '/blogs/img/soc-lab-4-ad/ad.webp',
  },
  {
    slug: 'soc-lab-3-winserver',
    title: 'SOC Lab Rehberi Bölüm 3: Windows Server',
    excerpt: 'Bu bölümde, laboratuvarın merkezi yönetim otoritesini, yani Windows Server 2022 kuruyoruz.',
    author: 'Güven Emre Keskin',
    tags: ['soc', 'windows', 'lab'],
    image: '/blogs/img/soc-lab-3-winserver/winserver.webp',
  },
  {
    slug: 'supply-chain-attacks',
    title: 'Supply Chain Attacks on Software Dependencies',
    excerpt: 'Attackers don’t hack your app—they poison what it trusts. A quick breakdown of how dependency-based supply chain attacks work, why they’re effective, and what the Axios npm compromise revealed.',
    author: 'Matjaz Madon',
    tags: ['supply-chain', 'security', 'javascript'],
    image: '/blogs/img/supply-chain/supply-chain.png',
  },
  {
    slug: 'emapt',
    title: 'Siber Güvenlik Sertifikaları #3: eMAPT Sınavının Anatomisi',
    excerpt: 'Webin kalabalık dünyasından sıyrılıp mobilin daha özel dünyasına adım atıyoruz. eMAPT sertifikasını tüm detayları ve Frida pratikleriyle inceliyoruz.',
    author: 'Ozan İsmail Çolhak',
    tags: ['certification', 'mobile', 'pentest'],
    image: '/blogs/img/emapt/emapt.png',
  },
  {
    slug: 'soc-lab-2-windows11',
    title: 'SOC Lab Rehberi Bölüm 2: Windows 11',
    excerpt: 'Bu bölümde, pfSense’in koruması altındaki iç ağımızda (LAN) konumlanacak, saldırıları analiz edeceğimiz ve güvenlik araçlarımızı koşturacağımız Windows 11 makinesinin kurulumunu gerçekleştiriyoruz.',
    author: 'Güven Emre Keskin',
    tags: ['soc', 'windows', 'lab'],
    image: '/blogs/img/soc-lab-2-windows11/win11.webp',
  },
  {
    slug: 'soc-lab-1-pfsense',
    title: 'SOC Lab Rehberi Bölüm 1: pfSense Firewall',
    excerpt: 'Bu bölümde, SOC laboratuvarımızın ağ trafiğini yönetmek ve güvenliği sağlamak için pfSense firewall kurulumunu gerçekleştiriyoruz.',
    author: 'Güven Emre Keskin',
    tags: ['soc', 'network', 'firewall'],
    image: '/blogs/img/soc-lab-1-pfsense/pfsense.webp',
  },
  {
    slug: 'analiz-sql',
    title: 'Bug Bounty Rapor Analizi : ownCloud Android — FileContentProvider SQL Injection',
    excerpt: 'Bu yazıda, ownCloud uygulamasında keşfedilen bir zafiyetin detaylı analizini ve raporunu inceleyeceğiz. Raporun içeriği, zafiyetin nasıl keşfedildiği ve istismar yöntemlerini kapsamaktadır.',
    author: 'Simge Yiğit',
    tags: ['bug-bounty', 'android', 'sql-injection'],
    image: '/blogs/img/sql-rapor-analiz/owncloudlogo.png',
  },
  {
    slug: 'ewptx',
    title: 'Siber Güvenlik Sertifikaları #2: eWPTx Sınavının Anatomisi',
    excerpt: 'Siber güvenlik dünyasındaki en popüler sertifikaları resmi verilerle masaya yatırıyor, tüm detaylarını açıklıyor ve 10 üzerinden acımasızca puanlıyoruz. Serimizin ikinci konuğu: eWPTx.',
    author: 'Ozan İsmail Çolhak',
    tags: ['certification', 'web', 'pentest'],
    image: '/blogs/img/ewptx/ewptx.png',
  },
  {
    slug: 'evernote',
    title: 'Bug Bounty Rapor Analizi : 2 click Remote Code execution in Evernote Android',
    excerpt: 'Bu yazıda, Evernote Android uygulamasında keşfedilen bir zafiyetin detaylı analizini ve raporunu inceleyeceğiz. Raporun içeriği, zafiyetin nasıl keşfedildiği ve istismar yöntemlerini kapsamaktadır.',
    author: 'Simge Yiğit',
    tags: ['bug-bounty', 'android', 'rce'],
    image: '/blogs/img/everNote/1.png',
  },
  {
    slug: 'bugrapor-linkedin',
    title: 'Bug Bounty Rapor Analizi: LinkedIn Android Uygulamasında Cookie Sızıntısı',
    excerpt: 'Bu yazıda, LinkedIn Android uygulamasında keşfedilen bir cookie sızıntısı zafiyetinin detaylı analizini ve raporunu inceleyeceğiz. Raporun içeriği, zafiyetin nasıl keşfedildiği, istismar yöntemleri ve önerilen düzeltme adımlarını kapsamaktadır.',
    author: 'Simge Yiğit',
    tags: ['bug-bounty', 'android', 'privacy'],
    image: '/blogs/img/buglinkedin/1.png',
  },
  {
    slug: 'idor',
    title: 'Insecure Direct Object Reference (IDOR)',
    excerpt: 'Learn about IDOR vulnerabilities where applications expose internal identifiers without proper authorization checks. Understand how attackers exploit this to access unauthorized resources and how to prevent it.',
    author: 'Matjaz Madon',
    tags: ['web', 'idor', 'owasp'],
    image: '/blogs/img/idor/idor.png',
  },
  {
    slug: 'remember-me-forget-mfa',
    title: 'Remember Me. Forget MFA',
    excerpt: 'Sometimes the most interesting vulnerabilities are not where you expect them. This finding started exactly like that. The target application had two-factor authentication. Everything looked fine. OTP code was coming, the screen was there, the flow was working. But something got my attention. "What happens when Remember Me is checked?"',
    author: 'Kayra Oksuz',
    tags: ['bug-bounty', 'auth', 'web'],
    image: '/blogs/img/remember-me-forget-mfa/cover.png',
  },
  {
    slug: 'ewpt',
    title: 'Siber Güvenlik Sertifikaları #1: eWPT (eLearnSecurity Web Application Penetration Tester)',
    excerpt: 'Siber güvenlik dünyasındaki en popüler sertifikaları resmi verilerle masaya yatırıyor, tüm detaylarını açıklayıp 10 üzerinden puanlıyoruz. Serimizin ilk konuğu: eWPT.',
    author: 'Ozan İsmail Çolhak',
    tags: ['certification', 'web', 'pentest'],
    image: '/blogs/img/ewpt/ewpt.png',
  },
  {
    slug: 'how-i-took-down-an-entire-application',
    title: 'How I Took Down an Entire Application Using google.com and Earned a $2,000 Bounty',
    excerpt: 'Sometimes the most interesting vulnerabilities are not the ones that leak sensitive data. Sometimes the biggest impact comes from bugs that reveal no internal services, return no useful information and look almost impossible to exploit at first glance.',
    author: 'Kayra Oksuz',
    tags: ['bug-bounty', 'dos', 'web'],
    image: '/blogs/img/how-i-took-down-an-entire-application/1.png',
  },
  {
    slug: 'a-graphql-dos-story',
    title: 'From One Mutation to a Full Service Outage: A GraphQL DoS Story',
    excerpt: 'Sometimes the most dangerous vulnerabilities do not leak any data. They do not expose sensitive information. They do not reveal internal services. But a single request can make the entire application completely unusable.',
    author: 'Kayra Oksuz',
    tags: ['bug-bounty', 'graphql', 'dos'],
    image: '/blogs/img/a-graphql-dos-story/1.png',
  },
  {
    slug: 'web-cache-deception',
    title: 'Web Cache Deception Vulnerability',
    excerpt: 'We will address the Web Cache Deception vulnerability, which is caused by the misconfiguration of caching mechanisms and may lead to the disclosure of users private data.',
    author: 'Kadir Arslan',
    tags: ['web', 'caching', 'security'],
    image: '/blogs/img/web-cache-deception/no-caching.png',
  },
  {
    slug: 'set-up-jenkins-with-keycloak',
    title: 'Setting up Jenkins with using Keycloak',
    excerpt: 'This blogpost contains detailed information about; Setting up an Ubuntu Jammy virtual machine, deploying a Single-server Kubernetes cluster using k3s, implementing Longhorn as the Distributed block storage system, deploying Jenkins through Helm, and integrating Keycloak with Jenkins using SAML and OpenID Connect protocols.',
    author: 'Kadir Arslan',
    tags: ['devsecops', 'jenkins', 'auth'],
    image: '/blogs/img/set-up-jenkins-with-keycloak/1.png',
  },
  {
    slug: 'cve-2019-15107-webmin-rce-on-void',
    title: 'CVE-2019-15107: Webmin RCE Zafiyeti',
    excerpt: 'Webmin 1.890 sürümünde bulunan CVE-2019-15107 Remote Code Execution zafiyetinin analiz edildiği bu write-up\'ta, hedef sistem üzerinde servis keşfi, Metasploit kullanarak zafiyetin istismarı ve sızma sonrası yapılan analiz adımları incelenmektedir.',
    author: 'Osman Erdem Dutar',
    tags: ['cve', 'rce', 'linux'],
    image: '/blogs/img/cve-2019-15107-webmin-rce-on-void/1-scenerioVoid.png',
  },
  {
    slug: 'csrf',
    title: 'Cross-Site Request Forgery (CSRF) Vulnerability',
    excerpt: 'CSRF attacks trick users into unknowingly performing malicious actions on behalf of the attacker. Learn how these attacks work, real-world examples, and effective protection strategies.',
    author: 'Matjaz Madon',
    tags: ['web', 'csrf', 'owasp'],
    image: '/blogs/img/csrf/csrf_diagram.png',
  },
  {
    slug: 'code-challenge-5',
    title: 'Code Challenge 5',
    excerpt: 'Bu challenge’da Ruby on Rails ile yazılmış bir JWT token servisinde hassas bilgilerin token içerisine gömülmesi incelenmektedir.',
    author: 'Ferhat Karasu',
    tags: ['code-challenge', 'jwt', 'ruby'],
    image: '/blogs/img/code-challenge_5/carbon.png',
  },
  {
    slug: 'code-challenge-4',
    title: 'Code Challenge 4',
    excerpt: 'Bu challenge’da client-side çalışan basit bir arama uygulamasında bulunan bir DOM-Based XSS zafiyeti incelenmektedir.  Uygulamanın amacı, URL üzerinden alınan `search` parametresini ekrana güvenli şekilde yazdırmaktır.',
    author: 'Ferhat Karasu',
    tags: ['code-challenge', 'xss', 'javascript'],
    image: '/blogs/img/code-challenge_4/carbon.png',
  },
  {
    slug: 'alice',
    title: 'TryHackMe-Wonderland Writeup',
    excerpt: 'TryHackMe-Wonderland odasıyla yetki yükseltme üzerine pratik yapalım.',
    author: 'Simge Yiğit',
    tags: ['ctf', 'writeup', 'tryhackme'],
    image: '/blogs/img/wonderland/1.png',
  },
  {
    slug: 'code-challenge-3',
    title: 'Code Challenge 3',
    excerpt: 'Bu challenge’da Express.js uygulaması, `/secret` path’i altındaki endpoint’leri  bir middleware ile token kontrolüne tabi tutmaktadır.',
    author: 'Ferhat Karasu',
    tags: ['code-challenge', 'node.js', 'auth'],
    image: '/blogs/img/code-challenge_1/carbon.png',
  },
  {
    slug: 'code-challenge-2',
    title: 'Code Challenge 2',
    excerpt: 'Bu challenge’da kullanıcıdan alınan path parametresi, internal bir API’ye HTTP isteği göndermek için kullanılmaktadır. Kodda bazı kontroller bulunsa da, bu kontroller güvenli değildir ve SSRF (Server-Side Request Forgery) zafiyetine yol açmaktadır.',
    author: 'Ferhat Karasu',
    tags: ['code-challenge', 'ssrf', 'api'],
    image: '/blogs/img/code-challenge_2/carbon.png',
  },
  {
    slug: 'code-challenge-1',
    title: 'Code Challenge 1',
    excerpt: 'Bu challenge’da Java ile yazılmış basit bir Admin Panel uygulamasında bulunan bir yetkilendirme hatası incelenmektedir.Uygulamanın amacı, yalnızca admin rolüne sahip kullanıcıların başka kullanıcıları silebilmesini sağlamaktır.',
    author: 'Ferhat Karasu',
    tags: ['code-challenge', 'java', 'authorization'],
    image: '/blogs/img/challenge001/1.png',
  },
  {
    slug: 'allsafe',
    title: 'AllSafe Write Up',
    excerpt: 'Allsafe Lab, içerisinde çeşitli zorluklar barındıran ve farklı güvenlik açığı kategorilerini kapsayan bir APK uygulamasıdır.',
    author: 'Simge Yiğit',
    tags: ['ctf', 'mobile', 'writeup'],
    image: '/blogs/img/Allsafe/1.png',
  },
  {
    slug: 'android-101',
    title: 'Android Security 101: Analiz Yöntemleri ve Araçları',
    excerpt: 'Mobil uygulama güvenliğinde başarı, doğru analiz yöntemlerini ve araçlarını etkin kullanmaktan geçer. Android Security 101 serisinin devamı niteliğindeki bu yazıda, analiz sürecini Statik ve Dinamik olmak üzere iki ana başlık altında inceliyoruz.',
    author: 'Simge Yiğit',
    tags: ['mobile', 'android', 'security'],
    image: '/blogs/img/android-101/1.png',
  },
  {
    slug: 'android-runtime',
    title: 'Android Runtime: Dalvik ve ART Mimarileri',
    excerpt: 'Bu yazı mobil uygulamaların gelişim sürecinde bir dönüm noktası olan Dalvik’ten ART mimarisine geçişin nedenlerini, sistem kaynaklarının yönetimini ve modern Android cihazlardaki çalışma prensiplerini ele alıyor.',
    author: 'Simge Yiğit',
    tags: ['mobile', 'android', 'architecture'],
    image: '/blogs/img/android-runTime/1.png',
  },
  {
    slug: 'mobilsecurity-owasp10',
    title: 'Mobil Uygulama Güvenliği Neden Önemlidir? Günlük Hayatımızdaki Riskler ve Örnekler',
    excerpt: 'Bu yazı, mobil uygulamaların günlük hayattaki kullanımının beraberinde getirdiği güvenlik risklerini ve bu risklerin neden ciddiye alınması gerektiğini özetlemektedir.OWASP Mobile Top 10 üzerinden örneklerlendirilmiştir.',
    author: 'Simge Yiğit',
    tags: ['mobile', 'owasp', 'security'],
    image: '/blogs/img/mobilsecurity-owasp/resim1.png',
  },
  {
    slug: 'case-insensitive-routing-bypass',
    title: 'Case-Insensitive Routing Bypass in Express.js Application',
    excerpt: 'Bu görevdeki zafiyet, case-insensitive routing ile case-sensitive erişim kontrolü arasındaki tutarsızlıktan kaynaklanan bir Authentication Bypass örneğidir.',
    author: 'Ferhat Karasu',
    tags: ['code-challenge', 'node.js', 'bypass'],
    image: '/blogs/img/case-insensitive-routing-bypass/3.png',
  },
  {
    slug: 'challange2',
    title: 'Challange002.apk Frida ile Çözümü (Android Runtime Hooking)',
    excerpt: 'Bu yazıda Challange002.apk üzerinde jadx ile flag mekanizmasını analiz ediyor ve Frida kullanarak get_flag() fonksiyonunu runtime’da doğrudan çağırarak flag’i elde ediyoruz.',
    author: 'Ozan İsmail Çolhak',
    tags: ['mobile', 'android', 'frida'],
    image: '/blogs/img/challange002/1.png',
  },
  {
    slug: 'challange1',
    title: 'Challange001.apk Frida ile Çözümü (Android Hooking)',
    excerpt: 'Bu yazıda Challange001.apk üzerinde Frida kurulumu, frida-server seçimi, PID doğrulaması ve input kontrolünü hook ederek flag’e giden yolu adım adım inceliyoruz.',
    author: 'Ozan İsmail Çolhak',
    tags: ['mobile', 'android', 'frida'],
    image: '/blogs/img/challenge001/1.png',
  },
  {
    slug: 'uncrackable2',
    title: 'OWASP UnCrackable Level 2 Çözümü: Android Native Reverse Engineering',
    excerpt: 'Bu makalede UnCrackable-Level2 Android challenge’ını çözüyoruz. Native (.so) kütüphane analizi, JNI fonksiyonları ve Ghidra kullanarak secret string’in elde edilmesini adım adım inceliyoruz.',
    author: 'Ozan İsmail Çolhak',
    tags: ['mobile', 'reverse-engineering', 'android'],
    image: '/blogs/img/uncrackable2/1.png',
  },
  {
    slug: 'uncrackable',
    title: 'OWASP UnCrackable Level 1 Çözümü: Android Reverse Engineering',
    excerpt: 'Bu makalede UnCrackable-Level1 Android challenge’ını adım adım çözüyoruz. Root kontrolü bypass, smali manipülasyonu, APK yeniden imzalama ve AES ile şifrelenmiş secret string’in çözümünü içerir.',
    author: 'Ozan İsmail Çolhak',
    tags: ['mobile', 'reverse-engineering', 'android'],
    image: '/blogs/img/uncrackable/1.png',
  },
  {
    slug: 'volatility-dumpme-writeup',
    title: 'DumpMe Memory Forensics Challenge Write-Up',
    excerpt: 'Bu yazıda, CyberDefenders DumpMe bellek analizi senaryosunu Volatility 3 ve Volatility 2 kullanarak adım adım çözüyoruz. RAM dökümünden sistem ve zararlı analizini içerir.',
    author: 'Ozan İsmail Çolhak',
    tags: ['forensics', 'volatility', 'ctf'],
    image: '/blogs/img/DumpMeWriteUp/windowsinfo.png',
  },
  {
    slug: 'web-to-ad-red-teaming',
    title: 'Full Red Teaming Senaryo: Web\'den Active Directory\'ye',
    excerpt: 'Bu yazıda, Microsoft Azure üzerinde kurduğum ve bir web sunucusundan başlayarak Active Directory içerisinde Domain Admin haklarına eriştiğim, kendi oluşturduğum laboratuvar ortamının çözüm yollarını ve öğrendiklerimi kendi üslubumla anlatıyor olacağım',
    author: 'Nadir Şensoy',
    tags: ['red-teaming', 'active-directory', 'web'],
    image: '/blogs/img/web-to-ad-red-teaming/redteam-1.png',
  },
  {
    slug: 'cve-2025-29927-nextjs-middleware-bypass',
    title: 'CVE-2025-29927: Next.js Middleware Bypass Zafiyeti',
    excerpt: 'Rachid Allam ve Yasser Allam tarafından keşfedilen ve Next.js\'in middleware katmanını tamamen atlatmayı sağlayan kritik bir zafiyetin incelenmesi.',
    author: 'Nadir Şensoy',
    tags: ['cve', 'nextjs', 'web'],
    image: '/blogs/img/cve-2025-29927-nextjs-middleware-bypass/nextjs-1.png',
  },
  {
    slug: 'siber-guvenlikte-yapay-zeka',
    title: 'Siber Güvenlikte Yapay Zeka: Tehditler ve Fırsatlar',
    excerpt: 'Günümüzün belki de en çok konuşulan ve ilgi odağı olan yapay zekanın, siber güvenlik ile bağlantısını inceleyeceğiz.',
    author: 'Hüseyin Aydın',
    tags: ['ai', 'security', 'future'],
    image: '/blogs/img/siber-guvenlikte-yapay-zeka/AiNedir.png',
  },
  {
    slug: 'phishing-email-analysis',
    title: 'Oltalama E-postası Analizi: Gerçek Bir Örnek Üzerinden',
    excerpt: 'Bu makalede gerçek bir oltalama e-postası örneği üzerinden, e-postanın içeriğini, kullanılan teknikleri ve nasıl tespit edilebileceğini inceleyeceğiz.',
    author: 'Rakun Toygun',
    tags: ['soc', 'phishing', 'email-analysis'],
    image: '/blogs/img/phishing-email-analysis/EmailAnaliz.png',
  },
  {
    slug: 'custom-log-source-normalization',
    title: 'Custom Log Source Normalization: SIEM Öncesi ve  Sonrası Tüm Aşamalar',
    excerpt: 'Bu makalede özelleştirilmiş log kaynaklarının normalizasyonu, SIEM öncesi ve sonrası tüm aşamalarıyla ele alınacaktır.',
    author: 'Ümmühan Atmaca',
    tags: ['soc', 'siem', 'log-analysis'],
    image: '/blogs/img/log-normalization/log-normalization.jpg',
  },
  {
    slug: 'c2-framework-nedir',
    title: 'C2 Framework Nedir? Amaçları, Faydaları ve En Popüler C2 Araçları',
    excerpt: 'Bu makalede C2 frameworklerinin ne olduğunu, nasıl çalıştığını, amaçlarını ve en popüler C2 araçlarını keşfedeceğiz.',
    author: 'Hilal Kavas',
    tags: ['red-teaming', 'c2', 'malware'],
    image: '/blogs/img/c2-framework-nedir/image1.png',
  },
  {
    slug: 'saldirganin-yol-haritasi',
    title: 'Saldırganın Yol Haritası',
    excerpt: 'Bu makalede, saldırganların bir hedefe nasıl yaklaşabileceğini, hangi adımları takip edebileceğini ve bu süreçte karşılaşabilecekleri zorlukları keşfedeceğiz.',
    author: 'Nur Sena Avcı',
    tags: ['red-teaming', 'pentest', 'methodology'],
    image: '/blogs/img/saldirganin-yol-haritasi/image1.png',
  },
  {
    slug: 'redos-zafiyeti',
    title: 'ReDoS (Regular Expression Denial of Service) Zafiyeti',
    excerpt: 'This article explores how a single SSRF vulnerability was exploited five times using different techniques, each bypassing a new layer of defense and earning a separate bounty.',
    author: 'Hilal Kavas',
    tags: ['web', 'redos', 'vulnerability'],
    image: '/blogs/img/redos/redos.png',
  },
  {
    slug: 'five-bounties-one-bug',
    title: 'Five Bounties, One Bug: Exploiting the Same SSRF via Five Unique Techniques',
    excerpt: 'This article explores how a single SSRF vulnerability was exploited five times using different techniques, each bypassing a new layer of defense and earning a separate bounty.',
    author: 'Kayra Oksuz',
    tags: ['bug-bounty', 'ssrf', 'web'],
    image: '/blogs/img/five-bounties-one-bug/ssrfpoc.png',
  },
  {
    slug: 'cti-on-telegram',
    title: 'Telegram Üzerinden Siber Tehdit İstihbaratı (CTI)',
    excerpt: 'Telegram’da yürütülen siber tehdit faaliyetlerini nasıl izleyeceğinizi, veri toplayacağınızı ve analiz edeceğinizi adım adım keşfedeceğiz.',
    author: 'Ayşe Bayraktar',
    tags: ['threat-intel', 'cti', 'telegram'],
    image: '/blogs/img/cti-on-telegram/voyant.png',
  },
  {
    slug: 'blue-team-beginners-guide',
    title: 'Mavi Takım Başlangıç Rehberi',
    excerpt: 'Mavi takım, siber güvenlik alanında savunma odaklı bir yaklaşımdır. Bu rehberde, mavi takımın temel ilkelerini ve nasıl etkili bir şekilde çalıştığını keşfedeceğiz.',
    author: 'Nur Sena Avcı',
    tags: ['blue-team', 'soc', 'beginner'],
    image: '/blogs/img/blueteam/blueteam.jpg',
  },
];

export const BlogList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('All Authors');
  const [selectedTag, setSelectedTag] = useState('All Tags');

  const authors = ['All Authors', ...Array.from(new Set(blogs.map((b) => b.author)))];
  const tags = ['All Tags', ...Array.from(new Set(blogs.flatMap((b) => b.tags || [])))];

  const filteredBlogs = blogs.filter((blog) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.author.toLowerCase().includes(query) ||
      (blog.tags && blog.tags.some(t => t.toLowerCase().includes(query)));

    const matchesAuthor =
      selectedAuthor === 'All Authors' || blog.author === selectedAuthor;

    const matchesTag =
      selectedTag === 'All Tags' || (blog.tags && blog.tags.includes(selectedTag));

    return matchesSearch && matchesAuthor && matchesTag;
  });

  return (
    <div className="min-h-screen bg-black text-custom-cyan py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Blog</h1>
          <p className="text-center max-w-3xl mx-auto mb-12 text-lg font-mono text-custom-cyan/90 leading-relaxed">
            Welcome to Gallipoli's blog section — your gateway to practical insights, tips, and
            stories from the world of cybersecurity.
          </p>
        </motion.div>

        {/* Arama Çubuğu ve Filtreler */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="max-w-4xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="relative md:col-span-6">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-custom-cyan">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-custom-cyan/5 border border-custom-cyan/30 text-custom-cyan placeholder-custom-cyan/40 rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:border-custom-cyan transition-colors font-mono text-sm"
              />
            </div>

            <div className="relative md:col-span-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-custom-cyan">
                <Filter size={15} />
              </span>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full bg-black border border-custom-cyan/30 text-custom-cyan rounded-lg pl-9 pr-6 py-2.5 focus:outline-none focus:border-custom-cyan transition-colors font-mono text-xs appearance-none cursor-pointer truncate"
              >
                {tags.map((tag, index) => (
                  <option key={index} value={tag} className="bg-black text-custom-cyan">
                    {tag === 'All Tags' ? tag : `#${tag}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative md:col-span-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-custom-cyan">
                <Filter size={15} />
              </span>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full bg-black border border-custom-cyan/30 text-custom-cyan rounded-lg pl-9 pr-6 py-2.5 focus:outline-none focus:border-custom-cyan transition-colors font-mono text-xs appearance-none cursor-pointer truncate"
              >
                {authors.map((author, index) => (
                  <option key={index} value={author} className="bg-black text-custom-cyan">
                    {author}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Blog Kartları Listesi */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
          initial="hidden"
          animate="show"
        >
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.slug}
                className="h-full flex"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/blog/${blog.slug}`}
                  className="w-full flex flex-col justify-between bg-custom-cyan/5 border border-custom-cyan/30 rounded-lg overflow-hidden hover:bg-custom-cyan/10 hover:border-custom-cyan/50 transition-all duration-300 cursor-pointer"
                  style={{ textDecoration: 'none' }}
                >
                  {/* Blog Görseli (Kapsayıcı sabit yükseklikte ve object-cover ile taşma engellendi) */}
                  <div className="relative w-full h-52 overflow-hidden border-b border-custom-cyan/20 bg-black/40">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col flex-grow justify-between p-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-3 text-custom-cyan leading-snug">{blog.title}</h2>
                      <p className="text-custom-cyan/80 font-mono text-sm mb-6 leading-relaxed">{blog.excerpt}</p>
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.map((tag, tIndex) => (
                            <span
                              key={tIndex}
                              className="text-xs font-mono px-2.5 py-1 rounded border border-custom-cyan/30 text-custom-cyan bg-custom-cyan/10"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-custom-cyan/10">
                        <p className="text-xs text-custom-cyan/70 font-mono">Author: {blog.author}</p>
                        <span className="inline-flex items-center text-custom-cyan font-mono text-xs hover:text-white transition">
                          Read More
                          <motion.span whileHover={{ x: 5 }} className="ml-1">
                            →
                          </motion.span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-custom-cyan/60 font-mono text-lg">
              No matching blogs found.
            </div>
          )}
        </motion.div>

        <motion.section className="text-center mt-24" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to Share Your Knowledge?</h2>
          <p className="font-mono text-custom-cyan/90 mb-8 max-w-2xl mx-auto">
            If you have insights, experiences, or stories about cybersecurity, we’d love to hear from you.
            Contribute to our blog and inspire others in the community!
          </p>
          <a
            href="https://t.me/gallipolixyz"
            target="_blank"
            rel="noopener noreferrer"
            className="click-ripple interactive-hover group inline-flex items-center px-8 py-4 bg-custom-cyan/10 border-2 border-custom-cyan/50 rounded-lg font-mono text-lg text-custom-cyan hover:bg-custom-cyan/20 hover:border-white hover:text-white transition-all duration-300"
          >
            Share Your Article
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.section>

      </div>
    </div>
  );
};

export default BlogList;
