const { v4: uuidv4 } = require('uuid');
const {
	ListBucketsCommand,
	PutObjectCommand,
	S3Client,
} = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const bucket = process.env.S3_BUCKET;
const region = process.env.S3_REGION;
const IAM = process.env.S3_IAM;

const s3 = new S3Client({
	region: region,
	credentials: fromIni({ profile: IAM }),
});

const bucketParams = { Bucket: bucket };

const uploadPhoto = async (user, content, filename) => {
	//need to have uuid for filename and return the filename for databse storage
	const name = `${uuidv4()}-${filename}`;
	const uploadParams = {
		Bucket: bucket,
		// Specify the name of the new object. For example, 'index.html'.
		// To create a directory for the object, use '/'. For example, 'myApp/package.json'.
		Key: `${user}/photos/${name}`,
		// Content of the new object.
		Body: content.buffer,
	};

	try {
		await s3.send(new PutObjectCommand(uploadParams));
		return name;
	} catch (err) {
		return err;
	}
};

const run = async () => {
	try {
		const data = await s3.send(new ListBucketsCommand({}));
		console.log('Success', data.Buckets);
		return data; // For unit tests.
	} catch (err) {
		console.log('Error', err);
	}
};

module.exports = {
	run,
	uploadPhoto,
};
