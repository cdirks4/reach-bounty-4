import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const [accAlice, accBob] = await stdlib.newTestAccounts(2, startingBalance);
console.log('Hello, Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);

console.log('Starting backends...');
const users = [];

const startBobs = async () => {
	const newBob = async (who) => {
		const acc = await stdlib.newTestAccount(startingBalance);
		const ctc = acc.contract(backend, ctcAlice.getInfo());
		users.push(acc.getAddress());
	};

	await newBob('Bob2');
	await newBob('Bob3');

	console.log(users);
};

await ctcAlice.p.Alice({
	ready: () => {
		console.log('ready');
		startBobs();
	},

	...stdlib.hasRandom,
	// implement Alice's interact object here
});
console.log('Goodbye, Alice and Bob!');
