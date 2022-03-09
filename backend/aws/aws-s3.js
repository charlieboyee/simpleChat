const { S3Client } = require('@aws-sdk/client-s3');
const { ListBucketsCommand } = require('@aws-sdk/client-s3');

const { fromIni } = require('@aws-sdk/credential-provider-ini');
const s3 = new S3Client({
	region: process.env.S3_REGION,
	credentials: fromIni({ profile: process.env.S3_IAM }),
});

const run = async () => {
	try {
		const data = await s3.send(new ListBucketsCommand({}));
		console.log('Success', data.Buckets);
		return data; // For unit tests.
	} catch (err) {
		console.log('Error', err);
	}
};

module.exports = { run };
