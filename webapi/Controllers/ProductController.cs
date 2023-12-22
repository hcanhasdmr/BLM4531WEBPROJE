using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel.Product;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [AllowAnonymous]
    public class ProductController : BaseWebApiController
    {
        public Product[] myProduct;
        private static readonly string[] ProductNames = new[]
        {
            "Product1","Product2","Product3"
        };

        public ProductController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }


        [HttpGet(Name = "ProductController")]
        public IEnumerable<Product> Get()
        {
            var a = Enumerable.Range(1, 4).Select(index => new Product
            {
                UrunAdi = ProductNames[Random.Shared.Next(ProductNames.Length)],
                Id = index,
                UrunAciklamasi = "iyi ürün",
                UrunEbadi = "125x12",
                UrunFiyati = "150000",
                TedarikciFİrma = "EHSİM",
                KdvOrani = "%10",
                Kategori = "Kategori1"
            }).ToArray();

            return a;
        }

        [HttpPost("CreateOrUpdateProduct")]
        [AllowAnonymous]
        public ApiResult CreateOrUpdateProduct([FromBody] ProductCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            Product data = null;
            if (dataVM.Id > 0)
                data = _unitOfWork.Repository<Product>().GetById(dataVM.Id);
            else
                data = new Product()
                {
                    UrunAdi = dataVM.UrunAdi,
                    UrunAciklamasi = dataVM.UrunAciklamasi,
                    UrunEbadi = dataVM.UrunEbadi,
                    UrunFiyati = dataVM.UrunFiyati,
                    TedarikciFİrma = dataVM.TedarikciFİrma,
                    KdvOrani = dataVM.KdvOrani,
                    Kategori = dataVM.Kategori
                };


            _unitOfWork.Repository<Product>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetProductGrid")]
        [AllowAnonymous]
        public ApiResult<GridResultModel<ProductGridVM>> GetProductGrid()
        {

            var query = _unitOfWork.Repository<Product>()
            .Select(x => new ProductGridVM
            {
                Id = x.Id,
                UrunAdi = x.UrunAdi,
                UrunAciklamasi = x.UrunAciklamasi,
                UrunEbadi = x.UrunEbadi,
                UrunFiyati = x.UrunFiyati,
                TedarikciFİrma = x.TedarikciFİrma,
                KdvOrani = x.KdvOrani,
                Kategori = x.Kategori

            });

            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<ProductGridVM>> { Data = rest, Result = true };
        }

    }
}

