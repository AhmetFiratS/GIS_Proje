using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Proje.Models
{
    public class LeafletInitializer : DropCreateDatabaseIfModelChanges<LeafletContext>
    {
        protected override void Seed(LeafletContext context)
        {
            base.Seed(context);
        }
    }
}