const express = require('express');
const path = require('path');
const app = express();
const si = require('systeminformation');

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (_req, res) => {
	let cpu = await si.cpu();
	let memory = await si.mem();
	let temp = await si.cpuTemperature();
	let load = await si.currentLoad();
	cpu['arch'] = process.env['PROCESSOR_ARCHITECTURE'];
	res.render('sys info', { cpu, temp, memory, load, os: require('os'), process });
});

app.use((_req, res) => {
	res.status(404).json({ error: 404, message: 'Not Found' });
});

app.use((err, _req, res, _) => {
	console.log(err);
	res.status(500).json({ error: 500, message: 'Something went wrong!' });
});

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`);
});
