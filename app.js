const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
var url = require("url");
var http = require("http");
app.set("view engine", "ejs");
app.use(express.static("./A"));
app.use(bodyParser.urlencoded({
  extended: true
}));
var a2;
var amt;
var id;
var CID;
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Amitgupta@76",
  database: "project2",
  connectionLimit: 10
});

// JSDOM.fromFile("0-10.html",options).then(dom => {
//   console.log(dom.serialize());
// });

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/logout",function(req,res){
  a2=null;
  res.redirect("/");
})

app.post("/signup", function(req, res) {
  const FNAME = req.body.fname;
  const LNAME = req.body.lname;
  a2 = req.body.email;
  const EMAIL = req.body.email;
  const sign = req.body.signup;

  let sql = "insert into USER(FNAME,LNAME,EMAIL) VALUES ?";
  let values = [
    [FNAME, LNAME, EMAIL]
  ]
  db.query(sql, [values], function(err, result) {
    if (err) {
      let sql2 = 'select PASSWORD from USER where EMAIL = ? ';
      db.query(sql2, [EMAIL], function(err1, result3) {
        const password = result3;
        if (password.length === 0) {
          console.log(result3);
          res.redirect("/password.html");
        } else {
          console.log(result3);

          res.send("<h1>Email id already exists, please login to continue</h1>");
        }
      });
    } else {
      res.redirect("/password.html");
    }
  });

});

app.get("/signup", function(req, res) {
  res.sendFile(__dirname + "/password.html");
})


app.post("/password", function(req, res) {
  const P1 = req.body.p2;
  const PAASWORD = req.body.password;

  let sql1 = 'select PASSWORD from USER where EMAIL = ?';
  db.query(sql1, [a2], function(err, result1) {
    if (err) {
      res.send(err);
    } else {
      if (result1) {
        let sql = 'UPDATE USER SET PASSWORD = ? where EMAIL = ?';
        db.query(sql, [P1, a2], function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.redirect("/menu.html");
          }
        });
      }
    }


  });

});

app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/menu.html");
});

app.post("/login", function(req, res) {
  const P2 = req.body.p1;
  a2 = req.body.email1;
  const EMAIL1 = req.body.email1;

  let sql = 'select distinct FNAME from USER where EMAIL = ? and PASSWORD = ?';
  db.query(sql, [EMAIL1, P2], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result != '') {
        res.redirect("/menu.html");
      } else {
        let sql1 = 'select distinct FNAME from USER where EMAIL = ?'
        db.query(sql1, [EMAIL1], function(err, result1) {
          if (result1 != "") {
            res.send("<h1>Please enter the correct password.</h1>");
          } else {
            res.send("<h1>Email id does not exist, please sign up.</h1>");
          }
        });
      }
    }
  });
});


app.post("/contact", function(req, res) {
  const FNAME = req.body.fname1;
  const LNAME = req.body.lname1;
  const EMAIL = req.body.email1;
  const TEXT = req.body.text;


  let sql = 'insert into QUERY values(?,?,?,?)';
  db.query(sql, [FNAME, LNAME, EMAIL, TEXT], function(err, result) {
    if (err) {
      res.send("<h1>Email id does not exist, please sign up and then continue</h1>");
    } else {
      res.send("<h1>We will contact with you shortly");
    }
  });

});

// app.post("/menu", function(req, res) {
//   const SEARCH = req.body.search;
//
//   let sql = 'select *,CAT_NAME from MENU,CATEGORIES where (FOOD_NAME = ? or CAT_NAME = ?)  and MENU.CAT_ID=CATEGORIES.CAT_ID';
//   db.query(sql, [SEARCH, SEARCH], function(err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("found", {
//         searchedItems: result
//       });
//     }
//   });
// });

app.post("/0-10", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/10-20", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ? and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ? and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/20-30", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/30-40", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/40-50", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/50", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=2)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/0-100", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/100-200", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/200-300", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/300-400", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/400-500", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/500", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=1)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/1-0-10", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/1-10-20", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/1-20-30", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/1-30-40", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/1-40-50", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/1-50", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=3)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/2-0-10", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=4)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=4)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/2-10-20", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=4)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=4)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/2-20-30", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=4)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=4)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/2-30-40", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=4)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=4)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/2-40", function(req, res) {
  const name = req.body.fname;
  var qty = req.body.Qty;
  let sql = 'select * from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=4)';
  db.query(sql, [name], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = "select PRICE,FOOD_ID from MENU,CATEGORIES where (FOOD_NAME = ?  and MENU.CAT_ID=CATEGORIES.CAT_ID and MENU.CAT_ID=4)";
      db.query(sql2, [name], function(err, result1) {
        if (err) {
          console.log(err);
        } else {
          id = result1[0].FOOD_ID;
          console.log(id);
          var yes = result1[0].PRICE;
          amt = qty * yes;
          res.render("order", {
            searchedItems: result,
            QTY: qty,
            AMT: amt
          });
        }
      });
    }
  });
});

app.post("/review", function(req, res) {
  const FNAME = req.body.fname;
  const EMAIL = req.body.email;
  const RATING = req.body.rating;
  const TEXT = req.body.text;

  let sql = 'insert into REVIEW(EMAIL,NAME,TEXT,RATINGS) values (?,?,?,?)';
  db.query(sql, [EMAIL, FNAME, TEXT, RATING], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      let sql2 = 'select * from REVIEW';
      db.query(sql2, [EMAIL], function(err, result2) {
        if (err) {
          console.log(err);
        } else {
          if (RATING <= 5.0) {
            res.render("review", {
              reviewedItems: result2
            });
          } else {
            res.send("Rating should be less than 5.")
          }
        }
      });
    }
  });
});

app.post("/order", function(req, res) {
  const EMAIL = a2;
  const AMT = amt;
  const ID = id;
  console.log(a2);
  let sql = "select MAX(ORDER_ID) as count from ORDERS";
  db.query(sql, [EMAIL], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      CID = result[0].count;
      CID++;
      let sql1 = "insert into ORDERS values(?,?,?,?)";
      db.query(sql1, [EMAIL, CID, ID, AMT], function(err, result1) {
        if (err) {
          console.log(err);
        } else {

          res.redirect("/success.html");
        }
      });
    }

  });
});

app.post("/success",function(req,res){
  let sql = "select max(ORDER_ID) as MAX from ORDERS";
  db.query(sql,function(err,result){
    if(err){
      console.log(err);
    }else{
      var item = result[0].MAX;
      if(CID === item){
        let sql2 = "delete from ORDERS where ORDER_ID = ?";
        db.query(sql2,[item],function(err,result1){
          if(err){
            console.log(err);
          } else{
            res.redirect("/cancel.html");
          }
        });
      }else{
        res.redirect("/cancel.html");
      }
    }
  });
});

app.get("/logout",function(req,res){
  a2=null;
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
