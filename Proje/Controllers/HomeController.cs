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
            //List<Mahalle> districts;

            //List<Kapı> doors;
            /*
            var data = new LeafletModel();

            using (var db = new LeafletContext())
            {

                data.Kapılar = db.Kapılar
                    .Select(i => new KapıModel()
                    {
                        Id = i.Id,
                        KapıNo = i.KapıNo,
                        Koordinat = i.KapıKoordinat
                    }).ToList();

                data.Mahalleler = db.Mahalleler
                    .Select(i => new MahalleModel(){

                        Id =i.Id,
                        Ad = i.MahalleAdi,
                        Koordinatlar =i.MahalleKoordinatlar

                    }).ToList();

                
            }

            return View(data);
            */
            
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
                    Koordinat = i.KapıKoordinat
                }).ToList();

                data.Mahalleler = db.Mahalleler.Select(i=> new MahalleModel()
                {
                    Id = i.Id,
                    Ad = i.MahalleAdi,
                    Koordinatlar = i.MahalleKoordinatlar
                }).ToList();
            }

            return Json(data, JsonRequestBehavior.AllowGet);
            
            /*
            var kapı = new KapıModel() { Id = 0, KapıNo = 777, Koordinat = "39.257778150283364,29.212646484375004", MahalleId = 0 };
            var kapı2 = new KapıModel() { Id = 1, KapıNo = 666, Koordinat = "39.357778150283364,29.512646484375004", MahalleId = 0 };

            var mahalle = new MahalleModel() { Id = 0, Ad = "Abc", Koordinatlar = "39.791654835253425,37.49633789062501,39.38526381099774,39.97924804687501,38.16047628099622,39.29809570312501,38.659777730712534,37.22167968750001" };

            data.Kapılar.Add(kapı);
            data.Kapılar.Add(kapı2);

            data.Mahalleler.Add(mahalle);

            return Json(data, JsonRequestBehavior.AllowGet);
            */
        }

        [HttpPost]
        public ActionResult SaveDoorData(KapıModel data)
        {
            using (var db = new LeafletContext())
            {
                db.Kapılar.Add(new Kapı() { KapıNo = data.KapıNo, KapıKoordinat = data.Koordinat, MahalleId = data.MahalleId });
                db.SaveChanges();
            }

            return new HttpStatusCodeResult(200);
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

            return new HttpStatusCodeResult(200);
        }


    }
}