using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proje.Models
{
    public class KapıModel
    {
        public int Id { get; set; }
        public int KapıNo { get; set; }
        public string Koordinat { get; set; }
        public int MahalleId { get; set; }
    }
}