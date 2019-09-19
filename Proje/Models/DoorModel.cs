using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proje.Models
{
    public class DoorModel
    {
        public int Id { get; set; }
        public int DoorNo { get; set; }
        public string Coordinate { get; set; }
        public int DistrictId { get; set; }
        public string DistrictName { get; set; }
    }
}