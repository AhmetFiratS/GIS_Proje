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
            this.Kapılar = new List<KapıModel>();

            this.Mahalleler = new List<MahalleModel>();
        }
        public List<KapıModel> Kapılar { get; set; }
        public List<MahalleModel> Mahalleler { get; set; }
        
    }
}