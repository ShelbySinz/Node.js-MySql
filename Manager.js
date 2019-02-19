var mysql = require("mysql");
var inquirer = require('inquirer');
var chalk = require('chalk');

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

function managersDuty() {

    inquirer.prompt([{
            type: "list",
            message: "What would you like to do?",
            name: "manager",
            choices: ["view products for sale", "view low Inventory", "Add to Inventory", "Add new product" ,"exit"]
        }

    ]).then(function (answer) {
           switch(answer.manager){
               case "view products for sale":
               readProducts(function(){
                   managersDuty();
               });
              
                   break;
               
               case "view low Inventory":
              
               lowInventory(function(){
                managersDuty();
               });
               
                   break;

               case "Add to Inventory":
               addtoinventory();
              
                    break;

              case  "Add new product":
              addNewProduct();
            
                    break;
              
              case "exit":
              connection.end();  
                    break;
           }
            
        });
    }



function readProducts() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++) {
            console.log(chalk.green.bold.underline("\n " + res[i].productName + " | $" + res[i].price + " | Item #" + res[i].id + " | Quantity: " + res[i].stock_quantity + "\n"));
        };


    });
}

function lowInventory(){
    connection.query("SELECT productName, stock_quantity , id FROM products WHERE stock_quantity < 5", function (error, results){
        if(error) throw(error);

           for(var i = 0; i < results.length; i++){
               console.log("\n Products low in Inventory: " + results[i].id + " | " + results[i].productName +" , quantity: " + results[i].stock_quantity);
           }

    })

    }

function addtoinventory(){
   
        readProducts();
        inquirer.prompt([
            {
                type: "input",
                message: "item Number you want to order",
                name: "orderNum"
            },
            {
                type:"input", 
                message: "Amount of product you want to order",
                name: "howMuch"
            }
        ]).then(function(order){

            connection.query("SELECT * FROM products WHERE ?", {
                id: order.orderNum
              }, function (err, res) {
            var orderit = res[0].stock_quantity + parseInt(order.howMuch);

            connection.query("UPDATE products SET ? WHERE ?", 
            [
            {
                stock_quantity: orderit
            },
            {
                id: order.orderNum
            }

        ],function(err, res){
            console.log("New inventory = " + orderit);
               connection.end();
        })

        });
    
    })

}


function addNewProduct(){
    inquirer.prompt([
    {
        type: "input",
        message: "Product Name",
        name: "productName"
    },
    {
        type: "input",
        message: "Department",
        name: "department"
    },
    {
        type: "input",
        message: "Price of item",
        name: "price"
    },
    {
        type: "input",
        message: "How many items do you want to order",
        name:"stock_quantity"
    }

    ]).then(function(newP){
        connection.query(
            "INSERT INTO products SET ?",
            {
              productName: newP.productName,
              department: newP.department,
              price: newP.price,
              stock_quantity: newP.stock_quantity
            },
            function(err) {
              if (err) throw err;
              console.log("Your Product was ordered successfully!");
              
              connection.end();
            }
          );


    })
}




managersDuty();