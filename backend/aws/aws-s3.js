const { v4: uuidv4 } = require('uuid');
const {
	DeleteObjectCommand,
	ListBucketsCommand,
	ListObjectsCommand,
	PutObjectCommand,
	S3Client,
} = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const bucket = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;
const IAM = process.env.S3_IAM;

const s3 = new S3Client({
	region: region,
	credentials: fromIni({ profile: IAM }),
});

const deletePhoto = async (key) => {
	const bucketParams = { Bucket: bucket, Key: key };

	const data = await s3.send(new DeleteObjectCommand(bucketParams));
	console.log('Success. Object deleted.', data);
	return;
};

const listObjects = async () => {
	const bucketParams = { Bucket: bucket };

	const data = await s3.send(new ListObjectsCommand(bucketParams));
	console.log('Success', data);
	return data;
};

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

	await s3.send(new PutObjectCommand(uploadParams));

	return uploadParams.Key;
};

module.exports = {
	deletePhoto,
	listObjects,
	uploadPhoto,
};
