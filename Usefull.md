In order to handle http -> https : 
I need an ssl certificate free/paid
For the free version use certBot which works great on web servers live apache but
I am not using that i am using spring boot server and so just use bash commands:

sudo certbot certonly --manual --key-type rsa --preferred-challenges=dns -d codemetrics.info --email chiriaccasian@gmail.com

in order to validate the certificate create a new TXT under advanced DNS in the hostname provider
(namecheap) and the Host should be _acme-challenge (given by them before the key)

now export the ssl certificate in a format that can be used with spring boot
sudo openssl pkcs12 -export -in /etc/letsencrypt/live/codemetrics.info/fullchain.pem -inkey /etc/letsencrypt/live/codemetrics.info/privkey.pem -out keystore.p12 -name tomcat
now search for keystore.p12 and with that you can certify the spring boot server

for the react server you will need 