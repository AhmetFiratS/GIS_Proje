using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Proje.Models;

namespace Proje.Controllers
{
    public class HomeController : Controller
    {

        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        /*
        public string getData()
        {
            var data = new LeafletModel();

            var kapı = new KapıModel() { Id = 0, KapıNo = 777, Koordinat = "39.257778150283364,29.212646484375004" };

            data.Kapılar.Add(kapı);

            var result = JsonConvert.SerializeObject(kapı);

            return result;
        }
        */

        public JsonResult SelectData()
        {
            var data = new LeafletModel();

            using (var db = new LeafletContext())
            {
                data.Kapılar = db.Kapılar.Select(i => new KapıModel()
                {
                    Id = i.Id,
                    KapıNo = i.KapıNo,
                    Koordinat = i.KapıKoordinat,
                    MahalleId = i.MahalleId
                }).ToList();

                data.Mahalleler = db.Mahalleler.Select(i => new MahalleModel()
                {
                    Id = i.Id,
                    Ad = i.MahalleAdi,
                    Koordinatlar = i.MahalleKoordinatlar
                }).ToList();
            }

            return Json(data, JsonRequestBehavior.AllowGet);


        }

        [HttpPost]
        public ActionResult SaveDoorData(KapıModel data)
        {
            using (var db = new LeafletContext())
            {
                db.Kapılar.Add(new Kapı() { KapıNo = data.KapıNo, KapıKoordinat = data.Koordinat, MahalleId = data.MahalleId });
                db.SaveChanges();
            }

            var result = new { Code = 1, Message = "Success" };

            return Json(result);
        }

        [HttpPost]
        public ActionResult SaveDistrictData(MahalleModel data)
        {
            using (var db = new LeafletContext())
            {
                db.Mahalleler.Add(new Mahalle() { MahalleAdi = data.Ad, MahalleKoordinatlar = data.Koordinatlar });
                db.SaveChanges();
                var deneme = db.Mahalleler.ToList();
            }

            var result = new { Code = 1, Message = "Success" };

            return Json(result);
        }


    }
}