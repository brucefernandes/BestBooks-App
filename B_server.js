const Client = require('pg').Client;
const express = require('express');

const app = express();

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const client = new Client({
	user: "postgres",
	password: 1234,
	host: "localhost",
	port: 8000,
	database: "bookstore"

})

var session_obj = {'array' : []};
var shopping_cart = {'list' : []};

app.get("/", createHome);
app.get("/createUser", async (req, res, next) => {res.render("pages/displayCreateUser", {s : session_obj});});
app.get("/books/:isbn", displayBook);
app.get("/displayShoppingCart", async (req, res, next) => {res.render("pages/displayShoppingCart", {s : session_obj, cart : shopping_cart});});
app.get("/trackOrders", trackOrders);
app.get("/trackOrders/:tracking_no", track);
app.get("/loginForm", loginForm)
app.post("/sendOrder", sendOrder);
app.post("/addToCart/:isbn", addToCart);
app.post("/addUser", addUser);
app.post("/loginUser", loginUser);
app.get("/logoutUser/:user_id", logoutUser);
app.post("/someBooks", searchSomeBooks);

async function createHome(req, res, next){

	const rows = await getAllBooks();
	res.setHeader("content-type", "text/html");

	res.render("pages/home", { books : rows, s : session_obj, cart : shopping_cart});

}
async function loginForm(req, res, next){
	res.render("pages/loginForm", { s : session_obj});
}
async function trackOrders(req, res, next){
	let user_id = session_obj.array[0].user_id;

	let orders = await client.query("select * from bookstore where user_id = $1", [user_id]);

	console.table(orders.rows);
	console.log(JSON.stringify(orders.rows));
	//let order_obj = {list : orders.rows}

	res.render('pages/orderList', { s : session_obj,  cart : shopping_cart, o : orders.rows })

}

async function track(req, res, next){

	let tracking_no = req.params.tracking_no;

	const show_tracking_info = await client.query("select * from tracking_info where tracking_no = $1", [tracking_no]);

	console.table(show_tracking_info.rows);

	res.render("pages/trackingInfo", { s : session_obj,  cart : shopping_cart, t : show_tracking_info.rows })



}

async function sendOrder(req, res, next){

	console.log('These are the orders: ' + shopping_cart.list);

	shopping_cart.list.forEach( async book => {

		let tracking_no = generate(5);

		let u_id 		= session_obj.array[0].user_id;
		let isbn 		= book.isbn;
		let title 		= book.title;
		let price 		= book.price;
		let order_no 	= book.order_no;

		let insert_into_tracking_info =  await client.query("insert into tracking_info values ($1,$2,$3,$4,$5,$6) ",
		[	book.order_no,
			book.title,
			"warehouse",
	 		"20",
			"04",
			tracking_no
		]);

		let insert_into_bookstore = await client.query("insert into bookstore values ($1,$2,$3,$4,$5,$6) ",
		[	u_id,
			isbn,
			title,
	 		price,
			order_no,
			tracking_no
		]);

		//reduces the stock
		const update_query = await client.query("update books set quantity = quantity - 1 where books.isbn = $1 and quantity > 0",[isbn])



	});

	const show_tracking_info = await client.query("select * from tracking_info");
    const show_bookstore = await client.query("select * from bookstore");

	console.log('Emptying cart...');
	shopping_cart.list = [];

	console.log('Tracking_info: ' );
	console.table(show_tracking_info.rows)

	console.log('Showing bookstore');
	console.table(show_bookstore.rows);

	res.redirect('/');



}


async function addToCart(req, res, next){

	let book_isbn = req.params.isbn;

	const book_to_add = await client.query("select * from books where isbn = $1",[book_isbn]);
	console.log(book_to_add.rows);

	//Now that we found the book we want to add we must create a randome order number

	let order_no = generate(5);

	console.log('random  order number generated: ' + order_no);

	let current_order = {

		user_id: 	session_obj.array[0].user_id,
		isbn:    	book_isbn,
		title:   	book_to_add.rows[0].title,
		price:   	book_to_add.rows[0].price,
		order_no:	order_no,
		tracking_no: 0
	}

	shopping_cart.list.push(current_order);

	res.redirect("/");


}

async function displayBook(req, res, next){
	let book_isbn = req.params.isbn;


	const book_to_display = await client.query("select * from books where isbn = $1",[book_isbn]);
	console.log(book_to_display.rows);

	res.render("pages/book_profile", {b : book_to_display.rows, s : session_obj, cart : shopping_cart});


}

async function loginUser(req, res, next){
	let login_user = req.body;
	console.log(login_user);
	console.log("Checking if " + login_user.username + " is already in our  USERS table");

	const result = await client.query("select * from users where name = $1", [login_user.username]);
	console.log('Does our user exist? : ' + JSON.stringify(result.rows));


	if(result.rows[0]){
		//User has been created before
		session_obj.array.push(result.rows[0]);
		console.log('Current Session: ' + JSON.stringify(session_obj));

		//CHANGING OUR SESSION USER TO REGISTERED IN THE SERVER (NOT DB)
		session_obj.array[0].registered = true;

		//CHANGING THE USER REGISTERED TO TRUE IN OUR DB
		const update_query = await client.query("update users set registered = true where users.name = $1",[session_obj.array[0].name])


		res.redirect("/");
	}
	else{
		//USER HAS NOT BEEN CREATED AND NOT FOUND IN database
		res.send("This user has not been created please go back")

	}
}


async function logoutUser(req, res, next){
	let unregister_user_id = req.params.user_id;
	//POPPING OUR CURRENT SESSION USER OFF THE SERVER
	session_obj.array.pop();

	shopping_cart.list = [];

	//CHANGING OUR USER TO UNREGISTERED ON THE DBS
	const update_query = await client.query("update users set registered = false where users.user_id = $1",[unregister_user_id])

	res.redirect("/");
}




async function addUser(req, res, next){

	let new_user = req.body;
	console.log(req.body);
	console.log("Checking if " + new_user.name + " is already in our table");

	const result = await client.query("select name from users where name = $1", [new_user.name]);
	console.log('Does our user exist? : ' + JSON.stringify(result.rows));


	if(!result.rows[0]){
		console.log('User doesnt exist proceeding to add user');
		let user_id = generate(5);
		console.log('user_id created: ' + user_id);
		let registered = false;

		const insert_query = await client.query("insert into users values ($1,$2,$3,$4,$5,$6,$7,$8) ",
		[	user_id,
			new_user.name,
			new_user.street,
	 		new_user.apt_no,
			new_user.city,
			new_user.bank_name,
			new_user.card_name,
			registered
		]);
		res.redirect("/");

	}
	else{
		res.send("this user already exists please go back");
	}


}

async function searchSomeBooks(req, res, next){
	console.log('Searching...');
	let searched_parameter = req.query.search;
	console.log(searched_parameter);


	try{
		const results = await client.query("select * from books where title = $1 or author = $1 or genre = $1 or isbn = $1", [searched_parameter])
		console.log(results.rows);
		console.table(results.rows);

		res.send(JSON.stringify(results.rows));

	}

	catch(e){
		return "Error: book not found, query failed"
	}




}

async function getAllBooks(){
	try{
		const results = await client.query("select * from books");
		return results.rows
	}

	catch(e){
		return [];
	}

}

function generate(n) {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

        if ( n > max ) {
                return generate(max) + generate(n - max);
        }

        max        = Math.pow(10, n+add);
        var min    = max/10; // Math.pow(10, n) basically
        var number = Math.floor( Math.random() * (max - min + 1) ) + min;

        return ("" + number).substring(add);
}
async function connect(){
	try{
		await client.connect()
	}
	catch(e){
		console.error(`Failed to connect ${e}`);
	}

}

async function start(){
	connect() //connects to the post gres database
}
start();

app.listen(3000, () => console.log('Server is listening'))
// client.connect()
// .then(() => console.log("We connected!"))
// .then(() => client.query("select * from student where dept_name = $1", ["Comp. Sci."]))
// .then(results => console.table(results.rows))
// .catch(err => console.log("Error: " + err))
// .finally(() => client.end())
