import fs from 'fs';
import { en } from '../src/i18n/translations/en.ts';
import { de } from '../src/i18n/translations/de.ts';
import { fr } from '../src/i18n/translations/fr.ts';
import { nl } from '../src/i18n/translations/nl.ts';
import { cn } from '../src/i18n/translations/cn.ts';
import { ru } from '../src/i18n/translations/ru.ts';
import { ar } from '../src/i18n/translations/ar.ts';
import { ja } from '../src/i18n/translations/ja.ts';

const enKeys = Object.keys(en);

// German
const DE_MAP: Record<string, string> = {
  nav_home: 'Startseite', nav_tours: 'Touren', nav_hotels: 'Hotels', nav_flights: 'Flüge', nav_cars: 'Mietwagen',
  nav_about: 'Über uns', nav_blog: 'Blog', nav_contact: 'Kontakt', nav_signin: 'Anmelden', nav_signout: 'Abmelden',
  nav_bookings: 'Meine Buchungen', nav_wishlist: 'Wunschliste', nav_dashboard: 'Mein Dashboard', nav_settings: 'Profileinstellungen', nav_admin: 'Admin-Panel',
  search_going_to: 'Reiseziel', search_start_date: 'Startdatum', search_guests: 'Gäste', search_city_hotel: 'Stadt oder Hotel',
  search_check_in: 'Anreise', search_check_out: 'Abreise', search_flying_from: 'Abflug von', search_date: 'Datum', search_class: 'Klasse',
  class_economy: 'Economy', class_business: 'Business', class_first: 'First Class', search_pickup: 'Abholort', search_vehicle: 'Fahrzeug',
  search_button: 'Touren suchen', common_save: 'Speichern', common_cancel: 'Abbrechen', common_edit: 'Bearbeiten', common_delete: 'Löschen',
  common_submit: 'Absenden', common_close: 'Schließen', common_back: 'Zurück', common_loading: 'Laden...', common_error: 'Ein Fehler ist aufgetreten',
  common_success: 'Erfolgreich', common_pending: 'Ausstehend', common_approved: 'Genehmigt', common_rejected: 'Abgelehnt',
  common_sample_review: 'Beispielbewertung', common_verified_client: 'Verifizierter Kunde', common_verified_guest: 'Verifizierter Gast',
  common_search: 'Suchen', common_filter: 'Filter', common_clear: 'Filter zurücksetzen', common_total: 'Gesamt', common_subtotal: 'Zwischensumme',
  common_taxes: 'Steuern & Gebühren', common_status: 'Status', common_action: 'Aktion', common_actions: 'Aktionen', common_date: 'Datum', common_rating: 'Bewertung',
  hero_badge2: 'SRI LANKA, WONDER AWAITS', hero_title_1: 'Entdecken Sie die Welt,', hero_title_2: 'Perfektioniert für Sie',
  hero_desc: 'Handverlesene Touren, Luxusresorts und maßgeschneiderte Erlebnisse für moderne Reisende.',
  home_rating: 'Bewertung', home_travelers: 'Reisende', home_curated: 'KURATIERTE REISEROUTEN', home_featured: 'Empfohlene Expeditionen',
  home_stories: 'REISEGESCHICHTEN', home_guests_say: 'Was unsere Gäste sagen', home_real_journeys: 'Echte Reisen. Echte Erlebnisse.', home_view_all_reviews: 'Alle Bewertungen anzeigen',
  checkout_title: 'Buchung abschließen', checkout_subtitle: 'Überprüfen Sie Ihre Reisedaten und wählen Sie eine Zahlungsmethode.',
  checkout_primary_guest: 'Angaben zum Hauptgast', checkout_first_name: 'Vorname', checkout_last_name: 'Nachname', checkout_email: 'E-Mail-Adresse', checkout_phone: 'Telefon / WhatsApp',
  checkout_special_requests: 'Besondere Wünsche', checkout_confirm: 'Buchung bestätigen & abschließen', checkout_processing: 'Buchung wird verarbeitet...',
  checkout_protection_fee: 'Buchungsschutzgebühr', checkout_total_due: 'Gesamtbetrag', checkout_select_payment: 'Zahlungsoption', checkout_card_payment: 'Kredit- / Debitkarte',
  checkout_bank_payment: 'Direkte Banküberweisung', checkout_whatsapp_payment: 'Über WhatsApp Concierge buchen',
  bank_title: 'Offizielles Reservierungskonto', bank_subtitle: 'Überweisen Sie den Betrag direkt auf unser Konto bei der Bank of Ceylon für eine sofortige Bestätigung.',
  bank_name: 'Bankname', bank_account_no: 'Kontonummer', bank_account_name: 'Begünstigter Name', bank_ref_code: 'Erforderlicher Zahlungsreferenzcode', bank_copy_ref: 'Code kopieren', bank_copied: 'Kopiert!', bank_branch: 'Filiale', bank_branch_value: 'BOC Hauptsitz, Colombo',
  receipt_title: 'Angehängter Banküberweisungsbeleg', receipt_drag_drop: 'Ziehen Sie Ihren Beleg hierher oder klicken Sie zum Durchsuchen', receipt_uploaded_success: 'Beleg erfolgreich hochgeladen und verknüpft',
  voucher_title: 'Offizieller Buchungsgutschein', voucher_download: 'Gutschein herunterladen / drucken', voucher_booking_ref: 'Buchungsreferenz', voucher_traveler_info: 'Reisendeninformationen', voucher_payment_summary: 'Zahlungsübersicht', voucher_close: 'Gutschein schließen',
  tour_detail_book: 'Jetzt buchen', tour_detail_overview: 'Übersicht', tour_detail_highlights: 'Highlights', tour_detail_itinerary: 'Detaillierter Reiseverlauf', tour_detail_included: 'Inbegriffen', tour_detail_not_included: 'Nicht inbegriffen', tour_detail_group_size: 'Gruppengröße', tour_detail_duration: 'Dauer', tour_detail_chauffeur: 'Inklusive Fahrer & Reiseleiter',
  hotel_detail_reserve: 'Zimmer reservieren', hotel_detail_overview: 'Übersicht', hotel_detail_amenities: 'Luxusausstattung', hotel_detail_rooms: 'Verfügbare Zimmer & Suiten', hotel_detail_available: 'Verfügbar', hotel_detail_check_availability: 'Verfügbarkeit prüfen',
  sort_featured: 'Sortieren: Empfohlen', sort_highest: 'Sortieren: Beste Bewertung', sort_price_low: 'Sortieren: Preis (niedrig bis hoch)', sort_price_high: 'Sortieren: Preis (hoch bis niedrig)',
  about_story: "Einzigartige Sri Lanka-Reisen seit 2018", about_subtitle: "Premier Tours ist ein von der Sri Lanka Tourism Development Authority (SLTDA) lizenziertes Reiseunternehmen.",
  partners_badge: "PREMIER HOSPITALITY PARTNER", partners_title_1: "Handverlesene Partnerhotels &", partners_title_2: "Luxus-Öko-Resorts", partners_desc: "Wir arbeiten exklusiv mit den besten 5-Sterne-Hotels in Sri Lanka zusammen.",
  map_badge: "NACH REGION ERKUNDEN", map_title: "Interaktive Sri Lanka Reisekarte", map_subtitle: "Klicken Sie auf ein Reiseziel auf der Karte, um Touren und Kundenberichte zu entdecken.", map_view_curated_tours: "Kuratierte Touren anzeigen", map_no_stories: "Keine Berichte für diese Region vorhanden", map_reset_view: "Ansicht zurücksetzen", map_explore: "Reiseziel erkunden", map_loading: "Karten-Daten werden geladen...", map_unavailable: "Karte wird aktualisiert",
  auth_signin: "Anmelden", auth_register: "Konto registrieren", auth_email: "E-Mail-Adresse", auth_password: "Passwort", auth_forgot: "Passwort vergessen?", auth_fullname: "Vollständiger Name", auth_confirm_pass: "Passwort bestätigen", auth_create_acc: "Konto erstellen", auth_reset_inst: "Geben Sie Ihre E-Mail-Adresse ein, um Anweisungen zu erhalten.", auth_send_reset: "Reset-Link senden", auth_guest: "Als Gast fortfahren", profile_theme_dark: "Dunkler Modus",
  dashboard_welcome: "Willkommen zurück,", dashboard_overview: "Übersicht", dashboard_my_bookings: "Meine Buchungen", dashboard_saved: "Gespeicherte Wunschliste", dashboard_profile: "Profileinstellungen", dashboard_upcoming: "Anstehende Reise", dashboard_recent_activity: "Letzte Aktivitäten", dashboard_total_spent: "Gesamtausgaben", dashboard_completed: "Abgeschlossene Touren", dashboard_edit_profile: "Profil bearbeiten", dashboard_change_photo: "Foto ändern",
  admin_dashboard: "Admin-Dashboard", admin_bookings: "Buchungsverwaltung", admin_tours: "Tourenverwaltung", admin_hotels: "Hotelverwaltung", admin_cars: "Fahrzeugflotte", admin_flights: "Flugverbindungen", admin_reviews: "Bewertungsmoderation", admin_customers: "Kundenverzeichnis", admin_payments: "Zahlungsbuch", admin_inbox: "Anfragen-Posteingang", admin_blog: "Journal-Editor", admin_settings: "Systemeinstellungen", admin_database: "Datenbank", admin_total_revenue: "Gesamteinnahmen", admin_active_bookings: "Aktive Buchungen", admin_total_customers: "Kunden gesamt", admin_add_new: "Eintrag hinzufügen", admin_filter_status: "Status filtern", admin_search_records: "Datensätze suchen...",
  review_form_title: "Teilen Sie Ihre Reiseerfahrung", review_form_subtitle: "Ihr Feedback hilft zukünftigen Reisenden bei der Auswahl des perfekten Abenteuers.", review_form_tour_select: "Expedition / Erlebnis auswählen", review_form_your_name: "Ihr Name", review_form_location: "Ihr Land / Ihre Stadt", review_form_rating: "Gesamtbewertung", review_form_headline: "Bewertungstitel", review_form_content: "Ausführliche Bewertung", review_form_submit: "Bewertung absenden",
  whatsapp_title: "24/7 VIP WhatsApp Concierge", whatsapp_sub: "Sprechen Sie direkt mit unseren Experten in Colombo für sofortige individuelle Anpassungen.", whatsapp_button: "Auf WhatsApp chatten"
};

// French
const FR_MAP: Record<string, string> = {
  nav_home: 'Accueil', nav_tours: 'Circuits', nav_hotels: 'Hôtels', nav_flights: 'Vols', nav_cars: 'Location de voitures',
  nav_about: 'À propos', nav_blog: 'Blog', nav_contact: 'Contact', nav_signin: 'Se connecter', nav_signout: 'Se déconnecter',
  nav_bookings: 'Mes réservations', nav_wishlist: 'Favoris', nav_dashboard: 'Mon tableau de bord', nav_settings: 'Paramètres du profil', nav_admin: 'Panneau d\'administration',
  search_going_to: 'Destination', search_start_date: 'Date de début', search_guests: 'Voyageurs', search_city_hotel: 'Ville ou Hôtel',
  search_check_in: 'Arrivée', search_check_out: 'Départ', search_flying_from: 'Départ de', search_date: 'Date', search_class: 'Classe',
  class_economy: 'Économique', class_business: 'Affaires', class_first: 'Première classe', search_pickup: 'Lieu de prise en charge', search_vehicle: 'Véhicule',
  search_button: 'Rechercher des circuits', common_save: 'Enregistrer', common_cancel: 'Annuler', common_edit: 'Modifier', common_delete: 'Supprimer',
  common_submit: 'Soumettre', common_close: 'Fermer', common_back: 'Retour', common_loading: 'Chargement...', common_error: 'Une erreur est survenue',
  common_success: 'Succès', common_pending: 'En attente', common_approved: 'Approuvé', common_rejected: 'Rejeté',
  common_sample_review: 'Avis exemple', common_verified_client: 'Client vérifié', common_verified_guest: 'Invité vérifié',
  common_search: 'Rechercher', common_filter: 'Filtrer', common_clear: 'Réinitialiser les filtres', common_total: 'Total', common_subtotal: 'Sous-total',
  common_taxes: 'Taxes et frais', common_status: 'Statut', common_action: 'Action', common_actions: 'Actions', common_date: 'Date', common_rating: 'Note',
  hero_badge2: 'SRI LANKA, L\'ÉMERVEILLEMENT VOUS ATTEND', hero_title_1: 'Découvrez le monde,', hero_title_2: 'Conçu sur mesure pour vous',
  hero_desc: 'Circuits d\'exception, hôtels de luxe et expériences uniques conçus pour les voyageurs modernes.',
  home_rating: 'Note', home_travelers: 'Voyageurs', home_curated: 'ITINÉRAIRES SUR MESURE', home_featured: 'Expéditions à la une',
  home_stories: 'HISTOIRES DE VOYAGEURS', home_guests_say: 'Ce que disent nos clients', home_real_journeys: 'De vrais voyages. De vraies expériences.', home_view_all_reviews: 'Voir tous les avis',
  checkout_title: 'Finaliser votre réservation', checkout_subtitle: 'Vérifiez vos détails de voyage et choisissez votre mode de paiement.',
  checkout_primary_guest: 'Informations du voyageur principal', checkout_first_name: 'Prénom', checkout_last_name: 'Nom', checkout_email: 'Adresse e-mail', checkout_phone: 'Téléphone / WhatsApp',
  checkout_special_requests: 'Demandes particulières', checkout_confirm: 'Confirmer et réserver', checkout_processing: 'Traitement de la réservation...',
  checkout_protection_fee: 'Frais de garantie de réservation', checkout_total_due: 'Montant total dû', checkout_select_payment: 'Option de paiement', checkout_card_payment: 'Carte de crédit / débit',
  checkout_bank_payment: 'Virement bancaire direct', checkout_whatsapp_payment: 'Réserver via Concierge WhatsApp',
  bank_title: 'Compte bancaire officiel des réservations', bank_subtitle: 'Effectuez un virement direct sur notre compte Bank of Ceylon pour une confirmation instantanée.',
  bank_name: 'Nom de la banque', bank_account_no: 'Numéro de compte', bank_account_name: 'Nom du bénéficiaire', bank_ref_code: 'Code de référence obligatoire', bank_copy_ref: 'Copier le code', bank_copied: 'Copié !', bank_branch: 'Agence', bank_branch_value: 'BOC Siège social, Colombo',
  receipt_title: 'Reçu de virement bancaire joint', receipt_drag_drop: 'Glissez-déposez le reçu bancaire ici ou cliquez pour parcourir', receipt_uploaded_success: 'Reçu téléchargé et associé à votre réservation',
  voucher_title: 'Voucher de réservation officiel', voucher_download: 'Télécharger / Imprimer le voucher', voucher_booking_ref: 'Référence de réservation', voucher_traveler_info: 'Informations voyageur', voucher_payment_summary: 'Récapitulatif du paiement', voucher_close: 'Fermer le voucher',
  tour_detail_book: 'Réserver ce voyage', tour_detail_overview: 'Aperçu', tour_detail_highlights: 'Points forts', tour_detail_itinerary: 'Itinéraire détaillé', tour_detail_included: 'Inclus', tour_detail_not_included: 'Non inclus', tour_detail_group_size: 'Taille du groupe', tour_detail_duration: 'Durée', tour_detail_chauffeur: 'Chauffeur et guide inclus',
  hotel_detail_reserve: 'Réserver une chambre', hotel_detail_overview: 'Aperçu', hotel_detail_amenities: 'Équipements de luxe', hotel_detail_rooms: 'Chambres et suites disponibles', hotel_detail_available: 'Disponible', hotel_detail_check_availability: 'Vérifier la disponibilité',
  sort_featured: 'Trier: À la une', sort_highest: 'Trier: Les mieux notés', sort_price_low: 'Trier: Prix croissant', sort_price_high: 'Trier: Prix décroissant',
  about_story: "Créateur de voyages d'exception au Sri Lanka depuis 2018", about_subtitle: "Premier Tours est une agence de voyages agréée par l'Autorité de développement touristique du Sri Lanka (SLTDA).",
  partners_badge: "PARTENAIRES D'EXCEPTION", partners_title_1: "Hôtels partenaires &", partners_title_2: "Éco-resorts de luxe", partners_desc: "Nous collaborons exclusivement avec les plus grands établissements 5 étoiles du Sri Lanka.",
  map_badge: "EXPLORER PAR RÉGION", map_title: "Carte interactive du Sri Lanka", map_subtitle: "Cliquez sur une destination sur la carte pour découvrir les circuits et avis clients.", map_view_curated_tours: "Voir les circuits", map_no_stories: "Aucun récit disponible pour cette région", map_reset_view: "Réinitialiser la carte", map_explore: "Explorer la destination", map_loading: "Chargement de la carte...", map_unavailable: "Carte en cours de mise à jour",
  auth_signin: "Se connecter", auth_register: "Créer un compte", auth_email: "Adresse e-mail", auth_password: "Mot de passe", auth_forgot: "Mot de passe oublié ?", auth_fullname: "Nom complet", auth_confirm_pass: "Confirmer le mot de passe", auth_create_acc: "Créer un compte", auth_reset_inst: "Saisissez votre e-mail pour recevoir les instructions.", auth_send_reset: "Envoyer le lien de réinitialisation", auth_guest: "Continuer en tant qu'invité", profile_theme_dark: "Mode sombre",
  dashboard_welcome: "Ravi de vous revoir,", dashboard_overview: "Vue d'ensemble", dashboard_my_bookings: "Mes réservations", dashboard_saved: "Liste de souhaits", dashboard_profile: "Paramètres du profil", dashboard_upcoming: "Prochain voyage", dashboard_recent_activity: "Activité récente", dashboard_total_spent: "Total dépensé", dashboard_completed: "Circuits effectués", dashboard_edit_profile: "Modifier le profil", dashboard_change_photo: "Changer la photo",
  admin_dashboard: "Tableau de bord admin", admin_bookings: "Gestion des réservations", admin_tours: "Gestion des circuits", admin_hotels: "Gestion des hôtels", admin_cars: "Flotte de véhicules", admin_flights: "Lignes aériennes", admin_reviews: "Modération des avis", admin_customers: "Annuaire clients", admin_payments: "Registre des paiements", admin_inbox: "Boîte de réception", admin_blog: "Éditeur du journal", admin_settings: "Paramètres système", admin_database: "Base de données", admin_total_revenue: "Revenu total", admin_active_bookings: "Réservations actives", admin_total_customers: "Nombre de clients", admin_add_new: "Ajouter un élément", admin_filter_status: "Filtrer par statut", admin_search_records: "Rechercher...",
  review_form_title: "Partagez votre expérience de voyage", review_form_subtitle: "Votre avis aide d'autres voyageurs à choisir leur aventure idéale au Sri Lanka.", review_form_tour_select: "Sélectionner le circuit", review_form_your_name: "Votre nom", review_form_location: "Votre pays / ville", review_form_rating: "Note globale", review_form_headline: "Titre de l'avis", review_form_content: "Contenu de l'avis", review_form_submit: "Publier l'avis",
  whatsapp_title: "Conciergerie WhatsApp VIP 24/7", whatsapp_sub: "Discutez en direct avec nos experts à Colombo pour une personnalisation instantanée.", whatsapp_button: "Discuter sur WhatsApp"
};

// Chinese
const CN_MAP: Record<string, string> = {
  nav_home: '首页', nav_tours: '旅行线路', nav_hotels: '奢华酒店', nav_flights: '航班机票', nav_cars: '包车租车',
  nav_about: '关于我们', nav_blog: '旅行专栏', nav_contact: '联系我们', nav_signin: '登录', nav_signout: '退出登录',
  nav_bookings: '我的预订', nav_wishlist: '心愿单', nav_dashboard: '个人中心', nav_settings: '账户设置', nav_admin: '管理后台',
  search_going_to: '目的地', search_start_date: '出发日期', search_guests: '出行人数', search_city_hotel: '城市或酒店名称',
  search_check_in: '入住日期', search_check_out: '退房日期', search_flying_from: '出发城市', search_date: '日期', search_class: '舱位等级',
  class_economy: '经济舱', class_business: '公务舱', class_first: '头等舱', search_pickup: '取车地点', search_vehicle: '车型选择',
  search_button: '搜索线路', common_save: '保存', common_cancel: '取消', common_edit: '编辑', common_delete: '删除',
  common_submit: '提交', common_close: '关闭', common_back: '返回', common_loading: '加载中...', common_error: '发生错误',
  common_success: '成功', common_pending: '待审核', common_approved: '已批准', common_rejected: '已拒绝',
  common_sample_review: '示例评价', common_verified_client: '已认证客户', common_verified_guest: '已认证访客',
  common_search: '搜索', common_filter: '筛选', common_clear: '清除筛选', common_total: '总计', common_subtotal: '小计',
  common_taxes: '税费与服务费', common_status: '状态', common_action: '操作', common_actions: '操作', common_date: '日期', common_rating: '评分',
  hero_badge2: '斯里兰卡，开启奇幻之旅', hero_title_1: '探索世界之美，', hero_title_2: '为您量身打造',
  hero_desc: '精选奢华路线、私人导游与顶级度假村，为品味卓越的旅行者定制独一无二的斯里兰卡之旅。',
  home_rating: '综合评分', home_travelers: '服务客户数', home_curated: '精选定制行程', home_featured: '招牌推荐路线',
  home_stories: '真实旅行故事', home_guests_say: '宾客真实评价', home_real_journeys: '真实旅程，真实感动。', home_view_all_reviews: '查看全部评价',
  checkout_title: '完成您的预订', checkout_subtitle: '核对您的出行信息并选择支付方式。',
  checkout_primary_guest: '主要出行人信息', checkout_first_name: '名字', checkout_last_name: '姓氏', checkout_email: '电子邮箱', checkout_phone: '联系电话 / WhatsApp',
  checkout_special_requests: '特殊要求或偏好', checkout_confirm: '确认并完成预订', checkout_processing: '正在处理您的预订...',
  checkout_protection_fee: '行程保障费用', checkout_total_due: '应付总金额', checkout_select_payment: '支付方式', checkout_card_payment: '信用卡 / 借记卡',
  checkout_bank_payment: '银行转账 (Direct Bank Transfer)', checkout_whatsapp_payment: '通过 WhatsApp 管家预订',
  bank_title: '官方预订收款账户', bank_subtitle: '请直接转账至我们的锡兰银行 (Bank of Ceylon) 账户以快速确认预订。',
  bank_name: '开户银行', bank_account_no: '银行账号', bank_account_name: '收款人姓名', bank_ref_code: '必需的付款参考代码', bank_copy_ref: '复制代码', bank_copied: '已复制！', bank_branch: '开户支行', bank_branch_value: 'BOC 总行，科伦坡',
  receipt_title: '上传银行转账凭证', receipt_drag_drop: '将转账凭证图片拖放到此处，或点击浏览', receipt_uploaded_success: '凭证已成功上传并关联至您的预订',
  voucher_title: '官方预订确认单', voucher_download: '下载 / 打印凭证', voucher_booking_ref: '预订参考号', voucher_traveler_info: '出行人信息', voucher_payment_summary: '结算摘要', voucher_close: '关闭凭证',
  tour_detail_book: '立即预订行程', tour_detail_overview: '行程概览', tour_detail_highlights: '行程亮点', tour_detail_itinerary: '每日详细行程', tour_detail_included: '费用包含', tour_detail_not_included: '费用不含', tour_detail_group_size: '成团人数', tour_detail_duration: '行程天数', tour_detail_chauffeur: '含私人司导与专车',
  hotel_detail_reserve: '预订客房', hotel_detail_overview: '酒店概况', hotel_detail_amenities: '奢华设施', hotel_detail_rooms: '房型与套房列表', hotel_detail_available: '可预订', hotel_detail_check_availability: '查询空房',
  sort_featured: '排序: 官方推荐', sort_highest: '排序: 评分最高', sort_price_low: '排序: 价格从低到高', sort_price_high: '排序: 价格从高到低',
  about_story: "自 2018 年起打造非凡斯里兰卡之旅", about_subtitle: "Premier Tours 是经斯里兰卡旅游发展局 (SLTDA) 正式批准注册的持牌旅行机构。",
  partners_badge: "顶级奢华合作伙伴", partners_title_1: "精选合作酒店与", partners_title_2: "奢华生态度假村", partners_desc: "我们仅与斯里兰卡顶尖五星级酒店及历史茶园庄园合作。",
  map_badge: "按区域探索", map_title: "斯里兰卡互动旅行地图", map_subtitle: "点击地图上的任意目的地，探索专属行程与客户评价。", map_view_curated_tours: "查看精选线路", map_no_stories: "该区域暂无故事", map_reset_view: "重置地图视图", map_explore: "探索该目的地", map_loading: "正在加载地图数据...", map_unavailable: "地图更新中",
  auth_signin: "登录", auth_register: "注册新账号", auth_email: "电子邮箱", auth_password: "密码", auth_forgot: "忘记密码？", auth_fullname: "真实姓名", auth_confirm_pass: "确认密码", auth_create_acc: "创建账号", auth_reset_inst: "输入您的邮箱地址以接收重置密码邮件。", auth_send_reset: "发送重置链接", auth_guest: "以游客身份继续", profile_theme_dark: "深色模式",
  dashboard_welcome: "欢迎回来，", dashboard_overview: "概览", dashboard_my_bookings: "我的预订", dashboard_saved: "心愿单", dashboard_profile: "个人设置", dashboard_upcoming: "即将到来的行程", dashboard_recent_activity: "近期动态", dashboard_total_spent: "累计消费", dashboard_completed: "已完成行程", dashboard_edit_profile: "编辑资料", dashboard_change_photo: "更换头像",
  admin_dashboard: "管理后台控制台", admin_bookings: "预订管理", admin_tours: "线路管理", admin_hotels: "酒店管理", admin_cars: "车队管理", admin_flights: "航线管理", admin_reviews: "评价审核", admin_customers: "客户名录", admin_payments: "账单台账", admin_inbox: "咨询收件箱", admin_blog: "文章编辑器", admin_settings: "系统设置", admin_database: "数据库架构", admin_total_revenue: "总收入", admin_active_bookings: "活跃预订", admin_total_customers: "客户总数", admin_add_new: "新增条目", admin_filter_status: "按状态筛选", admin_search_records: "搜索记录...",
  review_form_title: "分享您的斯里兰卡之旅", review_form_subtitle: "您的真实评价将为未来的旅行者提供宝贵参考。", review_form_tour_select: "选择您参加的线路/体验", review_form_your_name: "您的姓名", review_form_location: "您的国家 / 城市", review_form_rating: "总体评分", review_form_headline: "评价标题", review_form_content: "评价详细内容", review_form_submit: "提交评价",
  whatsapp_title: "24/7 VIP WhatsApp 私人管家", whatsapp_sub: "随时与我们位于科伦坡的旅行专家沟通，即时定制行程。", whatsapp_button: "通过 WhatsApp 沟通"
};

// Russian
const RU_MAP: Record<string, string> = {
  nav_home: 'Главная', nav_tours: 'Туры', nav_hotels: 'Отели', nav_flights: 'Авиабилеты', nav_cars: 'Аренда авто',
  nav_about: 'О нас', nav_blog: 'Блог', nav_contact: 'Контакты', nav_signin: 'Войти', nav_signout: 'Выйти',
  nav_bookings: 'Мои бронирования', nav_wishlist: 'Избранное', nav_dashboard: 'Панель управления', nav_settings: 'Настройки профиля', nav_admin: 'Админ-панель',
  search_going_to: 'Куда едем', search_start_date: 'Дата начала', search_guests: 'Гости', search_city_hotel: 'Город или отель',
  search_check_in: 'Заезд', search_check_out: 'Выезд', search_flying_from: 'Откуда вылет', search_date: 'Дата', search_class: 'Класс',
  class_economy: 'Эконом', class_business: 'Бизнес', class_first: 'Первый класс', search_pickup: 'Место подачи', search_vehicle: 'Автомобиль',
  search_button: 'Найти туры', common_save: 'Сохранить', common_cancel: 'Отмена', common_edit: 'Редактировать', common_delete: 'Удалить',
  common_submit: 'Отправить', common_close: 'Закрыть', common_back: 'Назад', common_loading: 'Загрузка...', common_error: 'Произошла ошибка',
  common_success: 'Успешно', common_pending: 'В ожидании', common_approved: 'Одобрено', common_rejected: 'Отклонено',
  common_sample_review: 'Пример отзыва', common_verified_client: 'Проверенный клиент', common_verified_guest: 'Проверенный гость',
  common_search: 'Поиск', common_filter: 'Фильтр', common_clear: 'Сбросить фильтры', common_total: 'Итого', common_subtotal: 'Подытог',
  common_taxes: 'Налоги и сборы', common_status: 'Статус', common_action: 'Действие', common_actions: 'Действия', common_date: 'Дата', common_rating: 'Рейтинг',
  hero_badge2: 'ШРИ-ЛАНКА ЖДЕТ ВАС', hero_title_1: 'Откройте для себя мир,', hero_title_2: 'Созданный специально для вас',
  hero_desc: 'Эксклюзивные туры, премиальные курорты и индивидуальные путешествия по Шри-Ланке.',
  home_rating: 'Рейтинг', home_travelers: 'Путешественников', home_curated: 'АВТОРСКИЕ МАРШРУТЫ', home_featured: 'Рекомендуемые экспедиции',
  home_stories: 'ИСТОРИИ ПУТЕШЕСТВЕННИКОВ', home_guests_say: 'Отзывы наших гостей', home_real_journeys: 'Настоящие путешествия. Настоящие эмоции.', home_view_all_reviews: 'Смотреть все отзывы',
  checkout_title: 'Завершение бронирования', checkout_subtitle: 'Проверьте детали поездки и выберите способ оплаты.',
  checkout_primary_guest: 'Информация о основном госте', checkout_first_name: 'Имя', checkout_last_name: 'Фамилия', checkout_email: 'Email адрес', checkout_phone: 'Телефон / WhatsApp',
  checkout_special_requests: 'Особые пожелания', checkout_confirm: 'Подтвердить и забронировать', checkout_processing: 'Обработка бронирования...',
  checkout_protection_fee: 'Сбор гарантии бронирования', checkout_total_due: 'Итого к оплате', checkout_select_payment: 'Вариант оплаты', checkout_card_payment: 'Банковская карта',
  checkout_bank_payment: 'Прямой банковский перевод', checkout_whatsapp_payment: 'Забронировать через WhatsApp',
  bank_title: 'Официальный банковский счет', bank_subtitle: 'Переведите средства на счет в Bank of Ceylon для мгновенного подтверждения.',
  bank_name: 'Название банка', bank_account_no: 'Номер счета', bank_account_name: 'Получатель', bank_ref_code: 'Код ссылки для оплаты', bank_copy_ref: 'Копировать код', bank_copied: 'Скопировано!', bank_branch: 'Филиал', bank_branch_value: 'Главный офис BOC, Коломбо',
  receipt_title: 'Прикрепленный чек перевода', receipt_drag_drop: 'Перетащите квитанцию сюда или нажмите для выбора', receipt_uploaded_success: 'Чек успешно загружен и привязан к бронированию',
  voucher_title: 'Официальный ваучер бронирования', voucher_download: 'Скачать / Распечатать ваучер', voucher_booking_ref: 'Номер бронирования', voucher_traveler_info: 'Информация о путешественниках', voucher_payment_summary: 'Детали оплаты', voucher_close: 'Закрыть ваучер',
  tour_detail_book: 'Забронировать тур', tour_detail_overview: 'Обзор', tour_detail_highlights: 'Главные впечатления', tour_detail_itinerary: 'Подробная программа', tour_detail_included: 'В стоимость входит', tour_detail_not_included: 'Не входит в стоимость', tour_detail_group_size: 'Размер группы', tour_detail_duration: 'Продолжительность', tour_detail_chauffeur: 'Личный водитель и гид включены',
  hotel_detail_reserve: 'Забронировать номер', hotel_detail_overview: 'Обзор', hotel_detail_amenities: 'Премиум удобства', hotel_detail_rooms: 'Доступные номера и люксы', hotel_detail_available: 'Доступно', hotel_detail_check_availability: 'Проверить наличие',
  sort_featured: 'Сортировка: Рекомендуемые', sort_highest: 'Сортировка: С высоким рейтингом', sort_price_low: 'Сортировка: Сначала дешевле', sort_price_high: 'Сортировка: Сначала дороже',
  about_story: "Создаем незабываемые путешествия по Шри-Ланке с 2018 года", about_subtitle: "Premier Tours — лицензированный туроператор, зарегистрированный в SLTDA.",
  partners_badge: "ПРЕМИАЛЬНЫЕ ПАРТНЕРЫ", partners_title_1: "Лучшие отели и", partners_title_2: "Эко-курорты Шри-Ланки", partners_desc: "Мы сотрудничаем только с эксклюзивными 5-звездочными отелями и чайными поместьями.",
  map_badge: "ИССЛЕДУЙТЕ ПО региону", map_title: "Интерактивная карта Шри-Ланки", map_subtitle: "Нажмите на любой регион на карте, чтобы узнать о турах и отзывах.", map_view_curated_tours: "Посмотреть туры", map_no_stories: "Нет отзывов для данного региона", map_reset_view: "Сбросить карту", map_explore: "Исследовать направление", map_loading: "Загрузка данных карты...", map_unavailable: "Карта обновляется",
  auth_signin: "Войти", auth_register: "Зарегистрироваться", auth_email: "Email адрес", auth_password: "Пароль", auth_forgot: "Забыли пароль?", auth_fullname: "Полное имя", auth_confirm_pass: "Подтверждение пароля", auth_create_acc: "Создать аккаунт", auth_reset_inst: "Введите email для получения инструкций по сбросу пароля.", auth_send_reset: "Отправить ссылку", auth_guest: "Продолжить как гость", profile_theme_dark: "Темная тема",
  dashboard_welcome: "С возвращением,", dashboard_overview: "Обзор", dashboard_my_bookings: "Мои бронирования", dashboard_saved: "Избранное", dashboard_profile: "Настройки профиля", dashboard_upcoming: "Предстоящая поездка", dashboard_recent_activity: "Последние действия", dashboard_total_spent: "Всего потрачено", dashboard_completed: "Завершенные туры", dashboard_edit_profile: "Редактировать профиль", dashboard_change_photo: "Изменить фото",
  admin_dashboard: "Панель администратора", admin_bookings: "Управление бронированиями", admin_tours: "Управление турами", admin_hotels: "Управление отелями", admin_cars: "Автопарк", admin_flights: "Авиарейсы", admin_reviews: "Модерация отзывов", admin_customers: "База клиентов", admin_payments: "Реестр платежей", admin_inbox: "Входящие сообщения", admin_blog: "Редактор блога", admin_settings: "Настройки системы", admin_database: "База данных", admin_total_revenue: "Общий доход", admin_active_bookings: "Активные брони", admin_total_customers: "Всего клиентов", admin_add_new: "Добавить запись", admin_filter_status: "Фильтр статуса", admin_search_records: "Поиск записей...",
  review_form_title: "Поделитесь впечатлениями о поездке", review_form_subtitle: "Ваш отзыв поможет другим путешественникам выбрать идеальный тур.", review_form_tour_select: "Выберите тур / программу", review_form_your_name: "Ваше имя", review_form_location: "Ваша страна / город", review_form_rating: "Общая оценка", review_form_headline: "Заголовок отзыва", review_form_content: "Текст отзыва", review_form_submit: "Опубликовать отзыв",
  whatsapp_title: "24/7 VIP Консьерж в WhatsApp", whatsapp_sub: "Свяжитесь с нашими экспертами в Коломбо для моментального расчета тура.", whatsapp_button: "Написать в WhatsApp"
};

// Arabic
const AR_MAP: Record<string, string> = {
  nav_home: 'الرئيسية', nav_tours: 'الجولات', nav_hotels: 'الفنادق', nav_flights: 'الطيران', nav_cars: 'تأجير سيارات',
  nav_about: 'من نحن', nav_blog: 'المدونة', nav_contact: 'اتصل بنا', nav_signin: 'تسجيل الدخول', nav_signout: 'تسجيل الخروج',
  nav_bookings: 'حجوزاتي', nav_wishlist: 'المفضلة', nav_dashboard: 'لوحة التحكم', nav_settings: 'إعدادات الملف الشخصي', nav_admin: 'لوحة الإدارة',
  search_going_to: 'الوجهة', search_start_date: 'تاريخ البدء', search_guests: 'الضيوف', search_city_hotel: 'المدينة أو الفندق',
  search_check_in: 'تاريخ الوصول', search_check_out: 'تاريخ المغادرة', search_flying_from: 'المغادرة من', search_date: 'التاريخ', search_class: 'الدرجة',
  class_economy: 'السياحية', class_business: 'رجال الأعمال', class_first: 'الدرجة الأولى', search_pickup: 'مكان الاستلام', search_vehicle: 'نوع السيارة',
  search_button: 'البحث عن الجولات', common_save: 'حفظ', common_cancel: 'إلغاء', common_edit: 'تعديل', common_delete: 'حذف',
  common_submit: 'إرسال', common_close: 'إغلاق', common_back: 'رجوع', common_loading: 'جاري التحميل...', common_error: 'حدث خطأ ما',
  common_success: 'تم بنجاح', common_pending: 'قيد الانتظار', common_approved: 'مقبول', common_rejected: 'مرفوض',
  common_sample_review: 'تقييم نموذجي', common_verified_client: 'عميل موثق', common_verified_guest: 'ضيف موثق',
  common_search: 'بحث', common_filter: 'تصفية', common_clear: 'مسح التصفية', common_total: 'الإجمالي', common_subtotal: 'المجموع الفرعي',
  common_taxes: 'الضرائب والرسوم', common_status: 'الحالة', common_action: 'الإجراء', common_actions: 'الإجراءات', common_date: 'التاريخ', common_rating: 'التقييم',
  hero_badge2: 'سريلانكا، سحر العجائب بانتظارك', hero_title_1: 'اكتشف العالم،', hero_title_2: 'مصمم خصيصاً لك',
  hero_desc: 'جولات فاخرة، منتجعات راقية، وتجارب استثنائية مصممة خصيصاً للمسافر العصري.',
  home_rating: 'التقييم', home_travelers: 'المسافرين', home_curated: 'برامج سياحية مختارة', home_featured: 'أبرز الرحلات الاستكشافية',
  home_stories: 'قصص المسافرين', home_guests_say: 'ماذا يقول ضيوفنا', home_real_journeys: 'رحلات حقيقية. تجارب ملهمة.', home_view_all_reviews: 'عرض جميع التقييمات',
  checkout_title: 'إتمام الحجز', checkout_subtitle: 'مراجعة تفاصيل الرحلة واختيار طريقة الدفع المفضلة.',
  checkout_primary_guest: 'معلومات الضيف الرئيسي', checkout_first_name: 'الاسم الأول', checkout_last_name: 'اسم العائلة', checkout_email: 'البريد الإلكتروني', checkout_phone: 'رقم الهاتف / الواتساب',
  checkout_special_requests: 'طلبات خاصة', checkout_confirm: 'تأكيد وإتمام الحجز', checkout_processing: 'جاري معالجة الحجز...',
  checkout_protection_fee: 'رسوم حماية الحجز', checkout_total_due: 'المبلغ الإجمالي المستحق', checkout_select_payment: 'خيار الدفع', checkout_card_payment: 'بطاقة ائتمان / خصم',
  checkout_bank_payment: 'تحويل بنكي مباشر', checkout_whatsapp_payment: 'الحجز عبر خدمة الواتساب VIP',
  bank_title: 'الحساب البنكي الرسمي للحجوزات', bank_subtitle: 'حول المبلغ مباشرة إلى حسابنا في بنك سيلان للحصول على تأكيد فوري.',
  bank_name: 'اسم البنك', bank_account_no: 'رقم الحساب', bank_account_name: 'اسم المستفيد', bank_ref_code: 'رمز مرجع الدفع المطلوب', bank_copy_ref: 'نسخ الرمز', bank_copied: 'تم النسخ!', bank_branch: 'الفرع', bank_branch_value: 'المقر الرئيسي لبنك سيلان، كولومبو',
  receipt_title: 'إيصال التحويل البنكي المرفق', receipt_drag_drop: 'اسحب وأسقط صورة الإيصال هنا أو انقر للاستعراض', receipt_uploaded_success: 'تم رفع الإيصال وربطه برقم الحجز بنجاح',
  voucher_title: 'قسيمة الحجز الرسمية', voucher_download: 'تحميل / طباعة القسيمة', voucher_booking_ref: 'رقم مرجع الحجز', voucher_traveler_info: 'معلومات المسافرين', voucher_payment_summary: 'ملخص الدفع', voucher_close: 'إغلاق القسيمة',
  tour_detail_book: 'احجز هذه الرحلة', tour_detail_overview: 'نظرة عامة', tour_detail_highlights: 'أبرز المعالم', tour_detail_itinerary: 'برنامج الرحلة التفصيلي', tour_detail_included: 'الخدمات المشمولة', tour_detail_not_included: 'غير مشمول', tour_detail_group_size: 'حجم المجموعة', tour_detail_duration: 'المدة', tour_detail_chauffeur: 'سائق خاص والمرشد شامل',
  hotel_detail_reserve: 'حجز الغرفة', hotel_detail_overview: 'نظرة عامة', hotel_detail_amenities: 'وسائل الراحة الفاخرة', hotel_detail_rooms: 'الغرف والأجنحة المتاحة', hotel_detail_available: 'متاح', hotel_detail_check_availability: 'التحقق من التوفر',
  sort_featured: 'الترتيب: المميز أولاً', sort_highest: 'الترتيب: الأعلى تقييماً', sort_price_low: 'الترتيب: السعر (من الأقل إلى الأعلى)', sort_price_high: 'الترتيب: السعر (من الأعلى إلى الأقل)',
  about_story: "صناع الرحلات الاستثنائية في سريلانكا منذ عام 2018", about_subtitle: "بريمير تورز هي شركة إدارة سفر مرخصة رسمياً ومسجلة لدى هيئة تطوير السياحة في سريلانكا (SLTDA).",
  partners_badge: "شركاء الضيافة الفاخرة", partners_title_1: "فنادت شريكة مختارة و", partners_title_2: "منتجعات بيئية فاخرة", partners_desc: "نتعاون حصرياً مع أرقى فنادق 5 نجوم ومنتجعات الشاي في سريلانكا.",
  map_badge: "استكشف حسب المنطقة", map_title: "خريطة سريلانكا التفاعلية", map_subtitle: "انقر على أي وجهة على الخريطة لاكتشاف الرحلات والتقييمات.", map_view_curated_tours: "عرض الجولات المختارة", map_no_stories: "لا توجد قصص متاحة لهذه المنطقة حالياً", map_reset_view: "إعادة ضبط الخريطة", map_explore: "استكشاف الوجهة", map_loading: "جاري تحميل بيانات الخريطة...", map_unavailable: "الخريطة قيد التحديث",
  auth_signin: "تسجيل الدخول", auth_register: "إنشاء حساب جديد", auth_email: "البريد الإلكتروني", auth_password: "كلمة المرور", auth_forgot: "هل نسيت كلمة المرور؟", auth_fullname: "الاسم الكامل", auth_confirm_pass: "تأكيد كلمة المرور", auth_create_acc: "إنشاء الحساب", auth_reset_inst: "أدخل بريدك الإلكتروني لتلقي تعليمات إعادة الضبط.", auth_send_reset: "إرسال رابط الإعادة", auth_guest: "المتابعة كضيف", profile_theme_dark: "الوضع الداكن",
  dashboard_welcome: "مرحباً بك مجدداً،", dashboard_overview: "نظرة عامة", dashboard_my_bookings: "حجوزاتي", dashboard_saved: "المفضلة", dashboard_profile: "إعدادات الحساب", dashboard_upcoming: "الرحلة القادمة", dashboard_recent_activity: "النشاط الأخير", dashboard_total_spent: "إجمالي الإنفاق", dashboard_completed: "الجولات المكتملة", dashboard_edit_profile: "تعديل الملف", dashboard_change_photo: "تغيير الصورة",
  admin_dashboard: "لوحة التحكم الإدارية", admin_bookings: "إدارة الحجوزات", admin_tours: "إدارة الجولات", admin_hotels: "إدارة الفنادق", admin_cars: "أسطول السيارات", admin_flights: "مسارات الطيران", admin_reviews: "مراجعة التقييمات", admin_customers: "دليل العملاء", admin_payments: "سجل المدفوعات", admin_inbox: "صندوق الاستفسارات", admin_blog: "محرر المقالات", admin_settings: "إعدادات النظام", admin_database: "قاعدة البيانات", admin_total_revenue: "إجمالي الإيرادات", admin_active_bookings: "الحجوزات النشطة", admin_total_customers: "إجمالي العملاء", admin_add_new: "إضافة عنصر جديد", admin_filter_status: "تصفية حسب الحالة", admin_search_records: "البحث في السجلات...",
  review_form_title: "شاركنا تجربتك في السفر", review_form_subtitle: "رأيك يساعد المسافرين الآخرين في اختيار الرحلة المثالية.", review_form_tour_select: "اختر الجولة / التجربة", review_form_your_name: "اسمك", review_form_location: "بلدك / مدينتك", review_form_rating: "التقييم العام", review_form_headline: "عنوان التقييم", review_form_content: "تفاصيل التقييم", review_form_submit: "نشر التقييم",
  whatsapp_title: "خدمة الواتساب VIP على مدار 24/7", whatsapp_sub: "تواصل مباشرة مع خبراء السفر في كولومبو لتصميم رحلتك فوراً.", whatsapp_button: "محادثة عبر الواتساب"
};

// Dutch
const NL_MAP: Record<string, string> = {
  nav_home: 'Home', nav_tours: 'Tours', nav_hotels: 'Hotels', nav_flights: 'Vluchten', nav_cars: 'Autoverhuur',
  nav_about: 'Over ons', nav_blog: 'Blog', nav_contact: 'Contact', nav_signin: 'Inloggen', nav_signout: 'Uitloggen',
  nav_bookings: 'Mijn Boekingen', nav_wishlist: 'Verlanglijst', nav_dashboard: 'Mijn Dashboard', nav_settings: 'Profielinstellingen', nav_admin: 'Beheerderspaneel',
  search_going_to: 'Bestemming', search_start_date: 'Startdatum', search_guests: 'Gasten', search_city_hotel: 'Stad of Hotel',
  search_check_in: 'Inchecken', search_check_out: 'Uitchecken', search_flying_from: 'Vertrek vanaf', search_date: 'Datum', search_class: 'Klasse',
  class_economy: 'Economy', class_business: 'Business', class_first: 'First Class', search_pickup: 'Ophaallocatie', search_vehicle: 'Voertuig',
  search_button: 'Tours Zoeken', common_save: 'Opslaan', common_cancel: 'Annuleren', common_edit: 'Bewerken', common_delete: 'Verwijderen',
  common_submit: 'Versturen', common_close: 'Sluiten', common_back: 'Terug', common_loading: 'Laden...', common_error: 'Er is een fout opgetreden',
  common_success: 'Succes', common_pending: 'In behandeling', common_approved: 'Goedgekeurd', common_rejected: 'Afgewezen',
  common_sample_review: 'Voorbeeldbeoordeling', common_verified_client: 'Geverifieerde klant', common_verified_guest: 'Geverifieerde gast',
  common_search: 'Zoeken', common_filter: 'Filteren', common_clear: 'Filters wisssen', common_total: 'Totaal', common_subtotal: 'Subtotaal',
  common_taxes: 'Belastingen & Toeslagen', common_status: 'Status', common_action: 'Actie', common_actions: 'Acties', common_date: 'Datum', common_rating: 'Beoordeling',
  hero_badge2: 'SRI LANKA, WONDEREN WACHTEN', hero_title_1: 'Ontdek de wereld,', hero_title_2: 'Perfect voor u gemaakt',
  hero_desc: 'Handgeplukte tours, luxe resorts en op maat gemaakte ervaringen voor de moderne reiziger.',
  home_rating: 'Beoordeling', home_travelers: 'Reizigers', home_curated: 'GEURATEERDE REISROUTES', home_featured: 'Aanbevolen Expedities',
  home_stories: 'REISVERHALEN', home_guests_say: 'Wat onze gasten zeggen', home_real_journeys: 'Echte reizen. Echte ervaringen.', home_view_all_reviews: 'Bekijk alle beoordelingen',
  checkout_title: 'Afronden van uw boeking', checkout_subtitle: 'Controleer uw reisgegevens en kies uw gewenste betaalmethode.',
  checkout_primary_guest: 'Informatie hoofdgast', checkout_first_name: 'Voornaam', checkout_last_name: 'Achternaam', checkout_email: 'E-mailadres', checkout_phone: 'Telefoon / WhatsApp',
  checkout_special_requests: 'Speciale verzoeken', checkout_confirm: 'Boeking bevestigen & voltooien', checkout_processing: 'Boeking verwerken...',
  checkout_protection_fee: 'Boekingsbeschermingskosten', checkout_total_due: 'Totaal te betalen', checkout_select_payment: 'Betaaloptie', checkout_card_payment: 'Creditcard / Debitkaart',
  checkout_bank_payment: 'Directe bankoverschrijving', checkout_whatsapp_payment: 'Boeken via WhatsApp Concierge',
  bank_title: 'Officiële reserveringsbankrekening', bank_subtitle: 'Maak de betaling direct over naar onze Bank of Ceylon-rekening voor directe bevestiging.',
  bank_name: 'Banknaam', bank_account_no: 'Rekeningnummer', bank_account_name: 'Naam ontvanger', bank_ref_code: 'Vereiste betalingsreferentiecode', bank_copy_ref: 'Code kopiëren', bank_copied: 'Gekopieerd!', bank_branch: 'Filiaal', bank_branch_value: 'BOC Hoofdkantoor, Colombo',
  receipt_title: 'Bijgevoegd bankoverschrijvingsbewijs', receipt_drag_drop: 'Sleep uw overschrijvingsbewijs hierheen of klik om te bladeren', receipt_uploaded_success: 'Bewijs geüpload en gekoppeld aan uw boeking',
  voucher_title: 'Officieel boekingsvoucher', voucher_download: 'Voucher downloaden / afdrukken', voucher_booking_ref: 'Boekingsreferentie', voucher_traveler_info: 'Reizigersinformatie', voucher_payment_summary: 'Betalingsoverzicht', voucher_close: 'Voucher sluiten',
  tour_detail_book: 'Boek deze reis', tour_detail_overview: 'Overzicht', tour_detail_highlights: 'Hoogtepunten', tour_detail_itinerary: 'Gedetailleerd reisprogramma', tour_detail_included: 'Inbegrepen', tour_detail_not_included: 'Niet inbegrepen', tour_detail_group_size: 'Groepsgrootte', tour_detail_duration: 'Duur', tour_detail_chauffeur: 'Inclusief chauffeur & gids',
  hotel_detail_reserve: 'Kamer reserveren', hotel_detail_overview: 'Overzicht', hotel_detail_amenities: 'Luxe voorzieningen', hotel_detail_rooms: 'Beschikbare kamers & suites', hotel_detail_available: 'Beschikbaar', hotel_detail_check_availability: 'Beschikbaarheid controleren',
  sort_featured: 'Sorteren: Aanbevolen', sort_highest: 'Sorteren: Hoogst beoordeeld', sort_price_low: 'Sorteren: Prijs (laag naar hoog)', sort_price_high: 'Sorteren: Prijs (hoog naar laag)',
  about_story: "Bijzondere reizen in Sri Lanka sinds 2018", about_subtitle: "Premier Tours is een erkend reisbureau geregistreerd bij de Sri Lanka Tourism Development Authority (SLTDA).",
  partners_badge: "PREMIER HOSPITALITY PARTNERS", partners_title_1: "Handgeplukte partnerhotels &", partners_title_2: "Luxe eco-resorts", partners_desc: "Wij werken exclusief samen met de beste 5-sterren accommodaties in Sri Lanka.",
  map_badge: "ONTDEK PER REGIO", map_title: "Interactieve reiskaart van Sri Lanka", map_subtitle: "Klik op een bestemming op de kaart om tours en beoordelingen te bekijken.", map_view_curated_tours: "Tours bekijken", map_no_stories: "Geen verhalen beschikbaar voor deze regio", map_reset_view: "Kaartweergave herstellen", map_explore: "Bestemming verkennen", map_loading: "Kaartgegevens laden...", map_unavailable: "Kaart wordt bijgewerkt",
  auth_signin: "Inloggen", auth_register: "Account registreren", auth_email: "E-mailadres", auth_password: "Wachtwoord", auth_forgot: "Wachtwoord vergeten?", auth_fullname: "Volledige naam", auth_confirm_pass: "Wachtwoord bevestigen", auth_create_acc: "Account aanmaken", auth_reset_inst: "Voer uw e-mailadres in voor instructies.", auth_send_reset: "Reset-link versturen", auth_guest: "Doorgaan als gast", profile_theme_dark: "Donkere modus",
  dashboard_welcome: "Welkom terug,", dashboard_overview: "Overzicht", dashboard_my_bookings: "Mijn boekingen", dashboard_saved: "Verlanglijst", dashboard_profile: "Profielinstellingen", dashboard_upcoming: "Aankomende reis", dashboard_recent_activity: "Recente activiteit", dashboard_total_spent: "Totaal uitgegeven", dashboard_completed: "Afgeronde tours", dashboard_edit_profile: "Profiel bewerken", dashboard_change_photo: "Foto wijzigen",
  admin_dashboard: "Beheerdersdashboard", admin_bookings: "Boekingen beheren", admin_tours: "Tours beheren", admin_hotels: "Hotels beheren", admin_cars: "Wagenpark", admin_flights: "Vliegroutes", admin_reviews: "Beoordelingen modereren", admin_customers: "Klantenbestand", admin_payments: "Betalingsoverzicht", admin_inbox: "Inkomende vragen", admin_blog: "Blog-editor", admin_settings: "Systeeminstellingen", admin_database: "Database", admin_total_revenue: "Totale omzet", admin_active_bookings: "Actieve boekingen", admin_total_customers: "Totaal aantal klanten", admin_add_new: "Nieuwe toevoegen", admin_filter_status: "Status filteren", admin_search_records: "Zoeken in gegevens...",
  review_form_title: "Deel uw reiservaring", review_form_subtitle: "Uw feedback helpt toekomstige reizigers de perfecte reis te kiezen.", review_form_tour_select: "Selecteer reis / ervaring", review_form_your_name: "Uw naam", review_form_your_location: "Uw land / stad", review_form_rating: "Algemene beoordeling", review_form_headline: "Titel van uw beoordeling", review_form_content: "Gedetailleerde beoordeling", review_form_submit: "Beoordeling versturen",
  whatsapp_title: "24/7 VIP WhatsApp Concierge", whatsapp_sub: "Spreek rechtstreeks met onze reisexperts in Colombo voor directe reisaanpassingen.", whatsapp_button: "Chat via WhatsApp"
};

function buildFile(varName: string, existingDict: any, customMap: Record<string, string>) {
  const result: Record<string, string> = {};
  for (const k of enKeys) {
    result[k] = customMap[k] || existingDict[k] || (en as Record<string, string>)[k];
  }
  return `export const ${varName} = ${JSON.stringify(result, null, 2)};\n`;
}

fs.writeFileSync('./src/i18n/translations/de.ts', buildFile('de', de, DE_MAP));
fs.writeFileSync('./src/i18n/translations/fr.ts', buildFile('fr', fr, FR_MAP));
fs.writeFileSync('./src/i18n/translations/nl.ts', buildFile('nl', nl, NL_MAP));
fs.writeFileSync('./src/i18n/translations/cn.ts', buildFile('cn', cn, CN_MAP));
fs.writeFileSync('./src/i18n/translations/ru.ts', buildFile('ru', ru, RU_MAP));
fs.writeFileSync('./src/i18n/translations/ar.ts', buildFile('ar', ar, AR_MAP));
fs.writeFileSync('./src/i18n/translations/ae.ts', buildFile('ar', ar, AR_MAP));
fs.writeFileSync('./src/i18n/translations/ja.ts', buildFile('ja', ja, {}));
fs.writeFileSync('./src/i18n/translations/jp.ts', buildFile('ja', ja, {}));

console.log('Successfully generated all translation files!');
