/*  
-create fake data in Mockaroo
- [docs](https://www.mockaroo.com/)
- copy from assets or final project
- log user id
- create seed.js
- run "node prisma/seedJobs"
*/


const { PrismaClient } = require('@prisma/client');
const data = require('./mock-data-jobs.json');
const prisma = new PrismaClient();

async function main() {
	const clerkId = 'user_2d3VY2r3Od0IoAc8BwedMJcnbhY';
	const organizationId = 'org_2dFXecYWyFpnip00LF4M37urhlm';
	const organizationName = 'IOA';
	const createdBy = 'Pavel';
	const updatedBy = 'Pavel';
	const jobs = data.map((job) => {
		return {
			...job,
			clerkId,
			organizationId,
			organizationName,
			//createdBy,
			//updatedBy
		};
	});
	for (const job of jobs) {
		await prisma.job.create({
			data: job,
		});
	}
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});