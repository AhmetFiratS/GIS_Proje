using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Proje.Models
{
    public class LeafletContext : DbContext
    {
        public LeafletContext() : base("AppDb")
        {
            Database.SetInitializer(new LeafletInitializer());
        }

        public DbSet<District> Districts { get; set; }
        public DbSet<Door> Doors { get; set; }
    }
}