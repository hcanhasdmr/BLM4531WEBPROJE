using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.Category;
using webapi.ViewModel.Customer;
using webapi.ViewModel.General.Grid;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : BaseWebApiController
    {
        public Category[] myCategory;
        private static readonly string[] Names = new[]
        {
            "Category1","Category2","Category3"
        };

        public CategoryController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        [HttpGet(Name = "CategoryController")]
        public IEnumerable<Category> Get()
        {
            var a = Enumerable.Range(1, 4).Select(index => new Category
            {
                KategoriAdi = Names[Random.Shared.Next(Names.Length)],
                Id = index

            }).ToArray();

            return a;
        }

        [HttpPost("CreateOrUpdate")]
        public ApiResult CreateOrUpdate([FromBody] CategoryCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            Category data;
            if (dataVM.Id > 0)
            {
                data = _unitOfWork.Repository<Category>().GetById(dataVM.Id);
                data.KategoriAdi = dataVM.KategoriAdi;
            }
            else
            {
                data = new Category()
                {
                    KategoriAdi = dataVM.KategoriAdi,
                };
                if (_unitOfWork.Repository<Category>().Any(x => x == data))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiş" };
                }
            }

            _unitOfWork.Repository<Category>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<Category>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanıcı tarafından kullanılmaktadır." };
            //}

            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen kategori bulunamadı." };
            }

            _unitOfWork.Repository<Category>().SoftDelete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<CategoryGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<Category>()
            .Select(x => new CategoryGridVM
            {
                Id = x.Id,
                KategoriAdi = x.KategoriAdi,
            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<CategoryGridVM>> { Data = rest, Result = true };
        }

        [HttpPost("Get")]
        public ApiResult<CategoryGridVM> Get(int id)
        {
            var category = _unitOfWork.Repository<Category>().GetById(id);
            CategoryGridVM categoryVM = new CategoryGridVM
            {
                Id = category.Id,
                KategoriAdi = category.KategoriAdi,
            };
            return new ApiResult<CategoryGridVM> { Data = categoryVM, Result = true };
        }

        /*[HttpPost("GetCategoryGrid")]
        [AllowAnonymous]
        public ApiResult<GridResultModel<CategoryGridVM>> GetCategoryGrid()
        {

            var query = _unitOfWork.Repository<Category>()
            .Select(x => new CategoryGridVM
            {
                Id = x.Id,
                KategoriAdi = x.KategoriAdi,
            });

            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<CategoryGridVM>> { Data = rest, Result = true };

        }*/

    }
}


