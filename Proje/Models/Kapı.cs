using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proje.Models
{
    public class Kapı
    {
        public int Id { get; set; }
        public int KapıNo { get; set; }
        public string KapıKoordinat { get; set; }

        public int MahalleId { get; set; }
        public Mahalle Mahalle { get; set; }

    }
}