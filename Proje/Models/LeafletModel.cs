using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proje.Models
{
    public class LeafletModel
    {
        public LeafletModel()
        {
            this.Doors = new List<DoorModel>();

            this.Districts = new List<DistrictModel>();
        }
        public List<DoorModel> Doors { get; set; }
        public List<DistrictModel> Districts { get; set; }
        
    }
}