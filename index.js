const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

// mognoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f4mgp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		const database = client.db("emajohn");
		const productCollection = database.collection("product");
		const orderCollectin = database.collection("ordered");
		// create a document to insert
		// GET PRODUCT
		app.get("/porducts", async (req, res) => {
			const page = Number(req.query.page);
			const size = Number(req.query.size);
			let result;
			const count = await productCollection.find({}).count();

			if (page >= 0) {
				result = await productCollection
					.find({})
					.skip(page * size)
					.limit(size)
					.toArray();
			} else {
				result = await productCollection.find({}).toArray();
			}
			res.send({ result, count });

			console.log("Data loaded successfully", page, size);
		});
		// GET data by keys
		app.post("/porducts/orderItems", async (req, res) => {
			const keys = req.body;
			const query = { key: { $in: keys } };
			const orderItems = await productCollection.find(query).toArray();
			console.log("hitted order items", keys);
			res.json(orderItems);
		});

		// Order Info
		app.post("/orderinfo", async (req, res) => {
			const info = req.body;
			const result = await orderCollectin.insertOne(info);
			res.json(result);
			console.log("User info added");
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("This is from emajohn server");
});

app.listen(port, () => {
	console.log("Listing port ", port);
});
