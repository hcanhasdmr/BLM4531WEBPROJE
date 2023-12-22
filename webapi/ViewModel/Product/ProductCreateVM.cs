using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.Product
{
    public class ProductCreateVM
    {
        public int Id { get; set; }
        public string UrunAdi { get; set; }
        public string UrunAciklamasi { get; set; }
        public string UrunEbadi { get; set; }
        public string UrunFiyati { get; set; }
        public string TedarikciFİrma { get; set; }
        public string KdvOrani { get; set; }
        public string Kategori { get; set; }
    }
}