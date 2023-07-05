const host = 'https://api.jiajutech.com';
const baseUrl = process.env.NODE_ENV === "development" ?
	"https://api.jiajutech.com" :
	"https://api.jiajutech.com";
module.exports = {
	host,
	baseUrl,
}