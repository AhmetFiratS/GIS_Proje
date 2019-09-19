using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proje.Models
{
    public class District
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Coordinates { get; set; }

        public List<Door> Doors { get; set; }
    }
}