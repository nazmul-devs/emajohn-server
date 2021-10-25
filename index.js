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
		// create a document to insert
		// GET PRODUCT
		app.get("/porducts", async (req, res) => {
			const result = await productCollection.find({}).toArray();
			const count = await productCollection.find({}).count();
			res.send({ count, result });

			console.log("Data loaded successfully", count);
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
