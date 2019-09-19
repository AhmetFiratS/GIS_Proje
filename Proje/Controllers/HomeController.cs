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
                data.Doors = db.Doors.Select(i => new DoorModel()
                {
                    Id = i.Id,
                    DoorNo = i.DoorNo,
                    Coordinate = i.Coordinate,
                    DistrictId = i.DistrictId
                }).ToList();
                
                data.Districts = db.Districts.Select(i => new DistrictModel()
                {
                    Id = i.Id,
                    Name = i.Name,
                    Coordinates = i.Coordinates
                }).ToList();
            }

            return Json(data, JsonRequestBehavior.AllowGet);


        }

        [HttpPost]
        public ActionResult SaveDoorData(DoorModel data)
        {
            using (var db = new LeafletContext())
            {

                db.Doors.Add(new Door() { DoorNo = data.DoorNo, Coordinate = data.Coordinate, DistrictId = data.DistrictId });
                db.SaveChanges();
                
            }

            var result = new { Code = 1, Message = "Success" };

            return Json(result);
        }

        [HttpPost]
        public ActionResult SaveDistrictData(DistrictModel data)
        {
            var districtList = new List<DistrictModel>();

            using (var db = new LeafletContext())
            {
                db.Districts.Add(new District() { Name = data.Name, Coordinates = data.Coordinates });
                db.SaveChanges();

                districtList = db.Districts.Select(i => new DistrictModel
                {
                    Id = i.Id,
                    Name = i.Name,
                    Coordinates = i.Coordinates

                }).ToList();

            }

            //var result = new { Code = 1, Message = "Success" };

            return Json(districtList);
        }

        public ActionResult SelectDistrictData()
        {
            var districts = new List<DistrictModel>();

            using (var db = new LeafletContext())
            {
                districts = db.Districts.Select(i => new DistrictModel()
                {
                    Id = i.Id,
                    Name = i.Name,
                    Coordinates = i.Coordinates
                }).ToList();
            }

            return Json(districts, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SelectDoorData()
        {
            var doors = new List<DoorModel>();

            using (var db = new LeafletContext())
            {
                doors = db.Doors.Select(i => new DoorModel()
                {
                    Id = i.Id,
                    DoorNo = i.DoorNo,
                    Coordinate = i.Coordinate,
                    DistrictId = i.DistrictId,
                    DistrictName = i.District.Name
                }).ToList();
            }

            return Json(doors, JsonRequestBehavior.AllowGet);
        }
    }
}