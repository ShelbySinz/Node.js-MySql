var mysql = require("mysql");
var inquirer = require('inquirer');
const chalk = require('chalk');

var connection = mysql.createConnection({
  host: "localhost",

  
  port: 3306,

  user: "root",

  
  password: "",
  database: "bamazon_db"
});


connection.connect(function (err) {
  if (err) throw err;
  
});




function buySomething(){
  console.log(chalk.blue("\n Welcome to Bamazon! Feel free to browse our products!\n\n"));
  readProducts();


inquirer.prompt([{
    name: "itemNum",
    type: "input",
    message: "Enter the Item number for to product you wish to buy."
  },
  {
    name: "itemquantity",
    type: "input",
    message: "Enter the Number of Items wanted"
  }
]).then(function (answer) {
 // console.log(answer.itemNum + "| " + answer.itemquantity);
  connection.query("SELECT * FROM products WHERE ?", {
    id: answer.itemNum
  }, function (err, res) {
    if (res[0].stock_quantity > answer.itemquantity) {
      var cost = res[0].price * answer.itemquantity;

      console.log(chalk.green("Your total is $" + cost + " Thank you for your order!"));
      var newqty = res[0].stock_quantity - answer.itemquantity;
      //console.log(newqty);

      connection.query(
        "UPDATE products SET ? WHERE ?", 
      [
         {
          stock_quantity: newqty
        },
        {
          id: answer.itemNum

        }

      ], function (err, res) {
        if(err) throw err;
            //console.log(res);
            
            inquirer.prompt([
              {
                type: "confirm",
                message: "Would you like to buy something else?",
                name: "buyagain"
              }
            ]).then(function(answer){
                 if(answer.buyagain){
                   buySomething();

                 }else{
                   connection.end();
                 }
            })
      });
    }else{
      console.log("Sorry We dont have enought Inventory!");
      buySomething();
    }
  });
});
}




















function readProducts() {

  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    for (var i = 0; i < res.length; i++) {
      console.log("\n " + res[i].productName + " | $" + res[i].price + " | Item #" + res[i].id + " | Quantity: " + res[i].stock_quantity + "\n");
    };


  });
}

buySomething();