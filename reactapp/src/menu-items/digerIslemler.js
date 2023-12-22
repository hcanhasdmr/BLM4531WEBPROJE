// assets
import { IconUsers } from '@tabler/icons';
import { IconCategory } from '@tabler/icons';
import { IconPackage } from '@tabler/icons';

// constant
const icons = { IconUsers, IconCategory, IconPackage };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const digerIslemler = {
    id: 'digerIslemler',
    title: 'Diğer İşlemler',
    type: 'group',
    children: [
        {
            id: 'musteriler',
            title: 'Müşteriler',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [
                {
                    id: 'musteriler',
                    title: 'Müşteri Listesi',
                    type: 'item',
                    url: '/digerIslemler/musteriler',
                    breadcrumbs: false
                },
                {
                    id: 'musteri-ekle',
                    title: 'Müşteri Ekle',
                    type: 'item',
                    url: '/digerIslemler/musteri-ekle',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'kategoriler',
            title: 'Kategoriler',
            type: 'collapse',
            icon: icons.IconCategory,
            children: [
                {
                    id: 'kategoriler',
                    title: 'Kategori Listesi',
                    type: 'item',
                    url: '/digerIslemler/kategoriler',
                    breadcrumbs: false
                },
                {
                    id: 'kategori-ekle',
                    title: 'Kategori Ekle',
                    type: 'item',
                    url: '/digerIslemler/kategori-ekle',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'urunler',
            title: 'Urunler',
            type: 'collapse',
            icon: icons.IconPackage,
            children: [
                {
                    id: 'urunler',
                    title: 'Urunler Listesi',
                    type: 'item',
                    url: '/digerIslemler/urunler',
                    breadcrumbs: false
                },
                {
                    id: 'urun-ekle',
                    title: 'Urun Ekle',
                    type: 'item',
                    url: '/digerIslemler/urun-ekle',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'teklifler',
            title: 'Teklifler',
            type: 'collapse',
            icon: icons.IconReportMoney,
            children: [
                {
                    id: 'teklif-olustur',
                    title: 'Teklif Oluştur',
                    type: 'item',
                    url: '/digerIslemler/teklif-olustur'
                },
                {
                    id: 'tekliflerim',
                    title: 'Tekliflerim',
                    type: 'item',
                    url: '/digerIslemler/tekliflerim'
                }
            ]
        }
    ]
};

export default digerIslemler;
