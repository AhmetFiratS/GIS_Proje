using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proje.Models
{
    public class Mahalle
    {
        public int Id { get; set; }
        public string MahalleAdi { get; set; }
        public string MahalleKoordinatlar { get; set; }

        public List<Kapı> Kapılar { get; set; }
    }
}