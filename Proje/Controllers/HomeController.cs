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
            var districtList = new List<MahalleModel>();

            using (var db = new LeafletContext())
            {
                db.Mahalleler.Add(new Mahalle() { MahalleAdi = data.Ad, MahalleKoordinatlar = data.Koordinatlar });
                db.SaveChanges();

                districtList = db.Mahalleler.Select(i => new MahalleModel
                {
                    Id = i.Id,
                    Ad = i.MahalleAdi,
                    Koordinatlar = i.MahalleKoordinatlar
                    
                }).ToList();
                
            }

            //var result = new { Code = 1, Message = "Success" };

            return Json(districtList);
        }


    }
}